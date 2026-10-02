"use strict";

const crypto = require("node:crypto");
const { promisify } = require("node:util");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { DatabaseSync } = require("node:sqlite");

const scrypt = promisify(crypto.scrypt);
const root = __dirname;
const dataDirectory = path.join(root, "data");
const databasePath = process.env.SIMA_DB_PATH || path.join(dataDirectory, "sima.sqlite");
const host = process.env.SIMA_HOST || "127.0.0.1";
const port = Number(process.env.SIMA_PORT || 8000);
const sessionDuration = 7 * 24 * 60 * 60 * 1000;
const passwordSaltBytes = 16;
const passwordKeyBytes = 64;

if (!Number.isInteger(port) || port < 0 || port > 65535) {
  throw new Error("SIMA_PORT deve ser um número entre 0 e 65535.");
}

fs.mkdirSync(path.dirname(databasePath), { recursive: true });
const database = new DatabaseSync(databasePath);
database.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_salt TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Analista',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
`);

const findUserByEmail = database.prepare(
  "SELECT id, name, email, password_salt, password_hash, role FROM users WHERE email = ?"
);
const insertUser = database.prepare(
  "INSERT INTO users (name, email, password_salt, password_hash, role) VALUES (?, ?, ?, ?, 'Analista')"
);
const insertSession = database.prepare(
  "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)"
);
const findSessionUser = database.prepare(`
  SELECT users.id, users.name, users.email, users.role, sessions.expires_at
  FROM sessions JOIN users ON users.id = sessions.user_id
  WHERE sessions.token_hash = ?
`);
const deleteSession = database.prepare("DELETE FROM sessions WHERE token_hash = ?");
const deleteExpiredSessions = database.prepare("DELETE FROM sessions WHERE expires_at <= ?");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function sendJson(response, status, payload, headers = {}) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers
  });
  response.end(JSON.stringify(payload));
}

function cookieValue(request, name) {
  const cookieHeader = request.headers.cookie || "";
  for (const cookie of cookieHeader.split(";")) {
    const separator = cookie.indexOf("=");
    if (separator < 0) continue;
    if (cookie.slice(0, separator).trim() === name) {
      return cookie.slice(separator + 1).trim();
    }
  }
  return null;
}

function cookieOptions(request) {
  return `Path=/; HttpOnly; SameSite=Strict; Max-Age=${Math.floor(sessionDuration / 1000)}${request.socket.encrypted ? "; Secure" : ""}`;
}

function sessionCookie(request, token) {
  return `sima_session=${token}; ${cookieOptions(request)}`;
}

function clearedSessionCookie(request) {
  return `sima_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${request.socket.encrypted ? "; Secure" : ""}`;
}

function tokenHash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function requireSameOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.host;
  } catch {
    return false;
  }
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body) > 16 * 1024) {
      const error = new Error("O corpo da solicitação excede o limite permitido.");
      error.status = 413;
      throw error;
    }
  }
  try {
    return JSON.parse(body);
  } catch {
    const error = new Error("Envie os dados em formato JSON válido.");
    error.status = 400;
    throw error;
  }
}

function validateCredentials(name, email, password) {
  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 80) {
    return "Informe um nome entre 2 e 80 caracteres.";
  }
  if (typeof email !== "string" || email.length > 254 || !emailPattern.test(email)) {
    return "Informe um endereço de e-mail válido.";
  }
  if (typeof password !== "string" || password.length < 12 || password.length > 128) {
    return "A senha deve ter entre 12 e 128 caracteres.";
  }
  return null;
}

async function passwordHash(password, salt) {
  return scrypt(password, salt, passwordKeyBytes, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
}

function getCurrentUser(request) {
  deleteExpiredSessions.run(Date.now());
  const token = cookieValue(request, "sima_session");
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const user = findSessionUser.get(tokenHash(token));
  if (!user || user.expires_at <= Date.now()) return null;
  return user;
}

async function handleApi(request, response, pathname) {
  if (request.method !== "GET" && request.method !== "POST") {
    sendJson(response, 405, { error: "Método não permitido." }, { Allow: "GET, POST" });
    return;
  }
  if (request.method === "POST" && !requireSameOrigin(request)) {
    sendJson(response, 403, { error: "Origem da solicitação não permitida." });
    return;
  }

  if (pathname === "/api/register" && request.method === "POST") {
    const input = await readJson(request);
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      sendJson(response, 400, { error: "Envie os dados de cadastro como um objeto JSON." });
      return;
    }
    const name = typeof input.name === "string" ? input.name.trim() : input.name;
    const email = typeof input.email === "string" ? input.email.trim().toLocaleLowerCase("en-US") : input.email;
    const password = input.password;
    const validationError = validateCredentials(name, email, password);
    if (validationError) {
      sendJson(response, 400, { error: validationError });
      return;
    }

    const salt = crypto.randomBytes(passwordSaltBytes);
    const hashedPassword = await passwordHash(password, salt);
    let result;
    try {
      result = insertUser.run(name, email, salt.toString("hex"), hashedPassword.toString("hex"));
    } catch (error) {
      if (error.code === "ERR_SQLITE_ERROR" && /unique constraint failed/i.test(error.message)) {
        sendJson(response, 409, { error: "Já existe uma conta com este e-mail." });
        return;
      }
      throw error;
    }

    const user = { id: Number(result.lastInsertRowid), name, email, role: "Analista" };
    const token = crypto.randomBytes(32).toString("hex");
    insertSession.run(tokenHash(token), user.id, Date.now() + sessionDuration);
    sendJson(response, 201, { user }, { "Set-Cookie": sessionCookie(request, token) });
    return;
  }

  if (pathname === "/api/login" && request.method === "POST") {
    const input = await readJson(request);
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      sendJson(response, 400, { error: "Envie os dados de login como um objeto JSON." });
      return;
    }
    const email = typeof input.email === "string" ? input.email.trim().toLocaleLowerCase("en-US") : "";
    const password = input.password;
    if (email.length > 254 || typeof password !== "string" || password.length > 128) {
      sendJson(response, 400, { error: "Informe um e-mail e uma senha válidos." });
      return;
    }

    const user = findUserByEmail.get(email);
    if (!user) {
      await passwordHash(password || "", Buffer.alloc(passwordSaltBytes));
      sendJson(response, 401, { error: "E-mail ou senha incorretos." });
      return;
    }
    const actualHash = await passwordHash(password || "", Buffer.from(user.password_salt, "hex"));
    const expectedHash = Buffer.from(user.password_hash, "hex");
    if (actualHash.length !== expectedHash.length || !crypto.timingSafeEqual(actualHash, expectedHash)) {
      sendJson(response, 401, { error: "E-mail ou senha incorretos." });
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");
    insertSession.run(tokenHash(token), user.id, Date.now() + sessionDuration);
    sendJson(response, 200, { user: publicUser(user) }, { "Set-Cookie": sessionCookie(request, token) });
    return;
  }

  if (pathname === "/api/session" && request.method === "GET") {
    const user = getCurrentUser(request);
    if (!user) {
      sendJson(response, 401, { error: "Não há uma sessão ativa." });
      return;
    }
    sendJson(response, 200, { user: publicUser(user) });
    return;
  }

  if (pathname === "/api/logout" && request.method === "POST") {
    const token = cookieValue(request, "sima_session");
    if (token && /^[a-f0-9]{64}$/.test(token)) deleteSession.run(tokenHash(token));
    sendJson(response, 200, { ok: true }, { "Set-Cookie": clearedSessionCookie(request) });
    return;
  }

  sendJson(response, 404, { error: "Rota não encontrada." });
}

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

async function serveStatic(request, response, pathname) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    sendJson(response, 405, { error: "Método não permitido." }, { Allow: "GET, HEAD" });
    return;
  }
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    sendJson(response, 400, { error: "Caminho inválido." });
    return;
  }
  const relativePath = decodedPath === "/" ? "index.html" : decodedPath.replace(/^\/+/, "");
  const filePath = path.resolve(root, relativePath);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    sendJson(response, 403, { error: "Acesso negado." });
    return;
  }
  try {
    const file = await fs.promises.readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": [".css", ".html", ".js"].includes(path.extname(filePath).toLowerCase())
        ? "no-cache"
        : "public, max-age=3600"
    });
    response.end(request.method === "HEAD" ? undefined : file);
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "EISDIR") {
      sendJson(response, 404, { error: "Arquivo não encontrado." });
      return;
    }
    throw error;
  }
}

const server = http.createServer(async (request, response) => {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "same-origin");
  try {
    const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    if (requestUrl.pathname.startsWith("/api/")) {
      await handleApi(request, response, requestUrl.pathname);
      return;
    }
    await serveStatic(request, response, requestUrl.pathname);
  } catch (error) {
    console.error("Erro ao processar solicitação:", error);
    if (!response.headersSent) sendJson(response, error.status || 500, { error: error.status ? error.message : "Erro interno do servidor." });
    else response.destroy(error);
  }
});

server.listen(port, host, () => {
  const address = server.address();
  console.log(`SIMA disponível em http://${host}:${address.port}`);
  console.log(`Banco de dados SQLite: ${databasePath}`);
});

function closeServer() {
  server.close(() => {
    database.close();
    process.exit(0);
  });
}

process.on("SIGINT", closeServer);
process.on("SIGTERM", closeServer);
