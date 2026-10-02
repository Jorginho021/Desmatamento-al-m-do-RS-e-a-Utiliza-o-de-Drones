(() => {
  "use strict";

  const states = [
    { name: "Acre", uf: "AC", region: "Norte", lat: -9.02, lng: -70.81, risk: "Alto" },
    { name: "Alagoas", uf: "AL", region: "Nordeste", lat: -9.57, lng: -36.78, risk: "Moderado" },
    { name: "Amapá", uf: "AP", region: "Norte", lat: 1.41, lng: -51.77, risk: "Moderado" },
    { name: "Amazonas", uf: "AM", region: "Norte", lat: -4.2, lng: -64.2, risk: "Crítico" },
    { name: "Bahia", uf: "BA", region: "Nordeste", lat: -12.4, lng: -41.7, risk: "Alto" },
    { name: "Ceará", uf: "CE", region: "Nordeste", lat: -5.3, lng: -39.5, risk: "Moderado" },
    { name: "Distrito Federal", uf: "DF", region: "Centro-Oeste", lat: -15.78, lng: -47.93, risk: "Baixo" },
    { name: "Espírito Santo", uf: "ES", region: "Sudeste", lat: -19.5, lng: -40.7, risk: "Baixo" },
    { name: "Goiás", uf: "GO", region: "Centro-Oeste", lat: -15.8, lng: -49.6, risk: "Alto" },
    { name: "Maranhão", uf: "MA", region: "Nordeste", lat: -5.2, lng: -45, risk: "Alto" },
    { name: "Mato Grosso", uf: "MT", region: "Centro-Oeste", lat: -12.8, lng: -55.4, risk: "Crítico" },
    { name: "Mato Grosso do Sul", uf: "MS", region: "Centro-Oeste", lat: -20.5, lng: -54.5, risk: "Alto" },
    { name: "Minas Gerais", uf: "MG", region: "Sudeste", lat: -18.5, lng: -44.7, risk: "Moderado" },
    { name: "Pará", uf: "PA", region: "Norte", lat: -4.8, lng: -52.5, risk: "Crítico" },
    { name: "Paraíba", uf: "PB", region: "Nordeste", lat: -7.2, lng: -36.7, risk: "Baixo" },
    { name: "Paraná", uf: "PR", region: "Sul", lat: -24.7, lng: -51.5, risk: "Moderado" },
    { name: "Pernambuco", uf: "PE", region: "Nordeste", lat: -8.3, lng: -37.9, risk: "Moderado" },
    { name: "Piauí", uf: "PI", region: "Nordeste", lat: -7.3, lng: -42.8, risk: "Alto" },
    { name: "Rio de Janeiro", uf: "RJ", region: "Sudeste", lat: -22.3, lng: -42.8, risk: "Baixo" },
    { name: "Rio Grande do Norte", uf: "RN", region: "Nordeste", lat: -5.7, lng: -36.6, risk: "Baixo" },
    { name: "Rio Grande do Sul", uf: "RS", region: "Sul", lat: -29.8, lng: -53.2, risk: "Moderado" },
    { name: "Rondônia", uf: "RO", region: "Norte", lat: -10.8, lng: -63.3, risk: "Alto" },
    { name: "Roraima", uf: "RR", region: "Norte", lat: 2.1, lng: -61.4, risk: "Moderado" },
    { name: "Santa Catarina", uf: "SC", region: "Sul", lat: -27.2, lng: -50.4, risk: "Baixo" },
    { name: "São Paulo", uf: "SP", region: "Sudeste", lat: -22.2, lng: -48.6, risk: "Moderado" },
    { name: "Sergipe", uf: "SE", region: "Nordeste", lat: -10.6, lng: -37.4, risk: "Baixo" },
    { name: "Tocantins", uf: "TO", region: "Norte", lat: -10, lng: -48.2, risk: "Alto" }
  ];
  const brazilBounds = [[-34, -74], [6, -34]];

  const alerts = [
    { id: "SIMA-2025-0841", type: "Queimada", title: "Foco de calor em área de conservação", location: "Novo Airão, Amazonas", state: "Amazonas", uf: "AM", coordinates: "-3.4653, -62.2159", lat: -3.4653, lng: -62.2159, risk: "Crítico", status: "Em análise", hours: 1, sensor: "Satélite + Drone Arara-07" },
    { id: "SIMA-2025-0840", type: "Desmatamento", title: "Supressão vegetal detectada", location: "Altamira, Pará", state: "Pará", uf: "PA", coordinates: "-3.2034, -52.2064", lat: -3.2034, lng: -52.2064, risk: "Crítico", status: "Encaminhado", hours: 3, sensor: "Sentinel-2" },
    { id: "SIMA-2025-0839", type: "Queimada", title: "Queimada próxima a área indígena", location: "Canarana, Mato Grosso", state: "Mato Grosso", uf: "MT", coordinates: "-13.55, -52.27", lat: -13.55, lng: -52.27, risk: "Alto", status: "Em análise", hours: 5, sensor: "VIIRS" },
    { id: "SIMA-2025-0838", type: "Área de risco", title: "Risco de propagação por baixa umidade", location: "Corumbá, Mato Grosso do Sul", state: "Mato Grosso do Sul", uf: "MS", coordinates: "-19.01, -57.65", lat: -19.01, lng: -57.65, risk: "Alto", status: "Em monitoramento", hours: 8, sensor: "INMET + Sentinel-2" },
    { id: "SIMA-2025-0837", type: "Desmatamento", title: "Nova abertura em área florestal", location: "Porto Velho, Rondônia", state: "Rondônia", uf: "RO", coordinates: "-8.76, -63.9", lat: -8.76, lng: -63.9, risk: "Alto", status: "Encaminhado", hours: 11, sensor: "Landsat-9" },
    { id: "SIMA-2025-0836", type: "Queimada", title: "Focos ativos em vegetação nativa", location: "Balsas, Maranhão", state: "Maranhão", uf: "MA", coordinates: "-7.53, -46.04", lat: -7.53, lng: -46.04, risk: "Moderado", status: "Resolvido", hours: 17, sensor: "Aqua MODIS" },
    { id: "SIMA-2025-0835", type: "Área de risco", title: "Alerta preventivo de estiagem", location: "Rio Branco, Acre", state: "Acre", uf: "AC", coordinates: "-9.97, -67.81", lat: -9.97, lng: -67.81, risk: "Moderado", status: "Em monitoramento", hours: 25, sensor: "INMET + SIMA" },
    { id: "SIMA-2025-0834", type: "Queimada", title: "Foco isolado próximo a unidade de conservação", location: "Formosa do Rio Preto, Bahia", state: "Bahia", uf: "BA", coordinates: "-11.05, -45.19", lat: -11.05, lng: -45.19, risk: "Baixo", status: "Resolvido", hours: 42, sensor: "VIIRS" }
  ];

  const riskColors = { Crítico: "#ff6666", Alto: "#ff914d", Moderado: "#f2c75c", Baixo: "#55d68b" };
  const riskKeys = { Crítico: "critical", Alto: "high", Moderado: "moderate", Baixo: "low" };
  const statusKeys = { "Em análise": "status-review", "Em monitoramento": "status-active", Encaminhado: "status-forwarded", Resolvido: "status-closed" };
  const typeIcons = { Queimada: "flame", Desmatamento: "trees", "Área de risco": "triangle-alert" };
  const views = { dashboard: "Visão geral", alerts: "Alertas", drones: "Operação de drones", risk: "Nível de risco", statistics: "Estatísticas", reports: "Relatórios", history: "Histórico", settings: "Configurações" };
  const drones = [
    { name: "Arara-07", location: "Novo Airão, AM", battery: 82, status: "Online" },
    { name: "Guará-03", location: "Altamira, PA", battery: 67, status: "Online" },
    { name: "Tucano-12", location: "Sinop, MT", battery: 91, status: "Online" },
    { name: "Uirapuru-02", location: "Porto Velho, RO", battery: 12, status: "Retornando" },
    { name: "Carcará-05", location: "Manaus, AM", battery: 74, status: "Online" },
    { name: "Jacutinga-09", location: "Cuiabá, MT", battery: 0, status: "Offline" },
    { name: "Andorinha-01", location: "Santarém, PA", battery: 56, status: "Online" },
    { name: "Sabiá-04", location: "Rio Branco, AC", battery: 0, status: "Offline" }
  ];
  const state = { maps: {}, charts: {}, reportHistory: [], role: "Analista", user: null, notificationSettings: { critical: true, new: true, daily: false } };

  const byId = (id) => document.getElementById(id);
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const localDate = (hoursAgo = 0) => {
    const date = new Date(Date.now() - hoursAgo * 3600000);
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(date);
  };
  const dateShort = (hoursAgo = 0) => new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(Date.now() - hoursAgo * 3600000));
  const icon = (name, extra = "") => `<i data-lucide="${name}"${extra}></i>`;
  const renderIcons = () => { if (window.lucide) window.lucide.createIcons(); };

  function toast(message, kind = "success") {
    const node = document.createElement("div");
    node.className = `toast-message${kind === "error" ? " error" : ""}`;
    node.innerHTML = `${icon(kind === "error" ? "circle-alert" : "circle-check")}<span>${escapeHtml(message)}</span>`;
    byId("toast-stack").append(node);
    renderIcons();
    window.setTimeout(() => node.remove(), 3700);
  }

  function persist(key, value) {
    try { localStorage.setItem(`sima-${key}`, JSON.stringify(value)); }
    catch (error) { console.warn(`Não foi possível salvar a preferência "${key}".`, error); }
  }
  function retrieve(key) {
    try {
      const stored = localStorage.getItem(`sima-${key}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn(`Não foi possível carregar a preferência "${key}".`, error);
      return null;
    }
  }

  async function apiRequest(endpoint, options = {}) {
    let response;
    try {
      response = await fetch(endpoint, {
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options
      });
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error("Não foi possível conectar ao servidor. Inicie o SIMA com npm.cmd start e tente novamente.");
      }
      throw error;
    }
    let payload;
    try {
      payload = await response.json();
    } catch {
      throw new Error("Resposta inválida do servidor.");
    }
    if (!response.ok) throw new Error(payload.error || "Não foi possível concluir a solicitação.");
    return payload;
  }

  function showAuthMode(mode) {
    const isRegistering = mode === "register";
    byId("close-login").hidden = !state.user;
    byId("login-form").hidden = isRegistering;
    byId("register-form").hidden = !isRegistering;
    byId("login-title").textContent = isRegistering ? "Criar conta no SIMA" : "Bem-vindo ao SIMA";
    byId("auth-description").textContent = isRegistering
      ? "Cadastre-se para acessar o sistema de monitoramento."
      : "Entre com sua conta para continuar.";
    byId("auth-switch").firstChild.textContent = isRegistering ? "Já tem uma conta? " : "Ainda não tem uma conta? ";
    byId("show-register").textContent = isRegistering ? "Entrar" : "Cadastre-se";
    byId("login-error").hidden = true;
    byId("register-error").hidden = true;
    byId("login-modal").hidden = false;
  }

  function displayAuthError(formName, message) {
    const error = byId(`${formName}-error`);
    error.textContent = message;
    error.hidden = false;
  }

  function clearAuthPasswords() {
    byId("login-password").value = "";
    byId("register-password").value = "";
    byId("register-confirm-password").value = "";
  }

  function setAuthenticatedUser(user) {
    state.user = user;
    const initials = user.name.trim().split(/\s+/).slice(0, 2).map((part) => Array.from(part)[0]).join("").toLocaleUpperCase("pt-BR");
    byId("sidebar-avatar").textContent = initials;
    byId("profile-avatar").textContent = initials;
    byId("sidebar-user-name").textContent = user.name;
    byId("profile-name").textContent = user.name;
    byId("settings-user").textContent = `${user.name} · ${user.email}`;
    setRole(user.role);
    clearAuthPasswords();
    byId("login-modal").hidden = true;
  }

  async function initializeAuth() {
    try {
      const result = await apiRequest("/api/session", { method: "GET", headers: {} });
      setAuthenticatedUser(result.user);
    } catch (error) {
      showAuthMode("login");
      if (error.message !== "Não há uma sessão ativa.") {
        displayAuthError("login", "Não foi possível conectar ao servidor. Inicie o sistema com npm start e tente novamente.");
      }
    }
  }

  async function submitLogin(event) {
    event.preventDefault();
    const button = byId("login-form").querySelector('button[type="submit"]');
    button.disabled = true;
    byId("login-error").hidden = true;
    try {
      const result = await apiRequest("/api/login", {
        method: "POST",
        body: JSON.stringify({ email: byId("login-email").value, password: byId("login-password").value })
      });
      setAuthenticatedUser(result.user);
      toast("Login realizado com sucesso.");
    } catch (error) {
      displayAuthError("login", error.message);
    } finally {
      button.disabled = false;
    }
  }

  async function submitRegistration(event) {
    event.preventDefault();
    const form = byId("register-form");
    const button = form.querySelector('button[type="submit"]');
    const password = byId("register-password").value;
    if (password !== byId("register-confirm-password").value) {
      displayAuthError("register", "As senhas informadas não coincidem.");
      return;
    }
    button.disabled = true;
    byId("register-error").hidden = true;
    try {
      const result = await apiRequest("/api/register", {
        method: "POST",
        body: JSON.stringify({
          name: byId("register-name").value,
          email: byId("register-email").value,
          password
        })
      });
      setAuthenticatedUser(result.user);
      toast("Conta criada com sucesso.");
    } catch (error) {
      displayAuthError("register", error.message);
    } finally {
      button.disabled = false;
    }
  }

  async function logout() {
    const button = byId("logout-button");
    button.disabled = true;
    try {
      await apiRequest("/api/logout", { method: "POST", body: "{}" });
      state.user = null;
      byId("sidebar-user-name").textContent = "Visitante";
      byId("profile-name").textContent = "Visitante";
      byId("settings-user").textContent = "Faça login para ver os dados da conta.";
      byId("sidebar-role").textContent = "Não autenticado";
      byId("sidebar-avatar").textContent = "S";
      byId("profile-avatar").textContent = "S";
      showAuthMode("login");
      toast("Sessão encerrada.");
    } catch (error) {
      toast(`Não foi possível encerrar a sessão: ${error.message}`, "error");
    } finally {
      button.disabled = false;
    }
  }

  function activeAlertCount() {
    return alerts.filter((alert) => alert.status !== "Resolvido").length;
  }

  function setAlertCount() {
    const count = activeAlertCount();
    byId("nav-alert-count").textContent = String(count).padStart(2, "0");
    byId("metric-alerts").innerHTML = `${String(count).padStart(2, "0")} <small>alertas</small>`;
    byId("dashboard-map-count").textContent = String(alerts.length);
    document.querySelectorAll(".count-badge").forEach((badge) => { badge.textContent = String(count).padStart(2, "0"); });
  }

  function statusBadge(status) {
    return `<span class="status-pill ${statusKeys[status] || "status-active"}"><i></i>${escapeHtml(status)}</span>`;
  }

  function riskBadge(risk) {
    return `<span class="risk-tag ${riskKeys[risk]}">${escapeHtml(risk)}</span>`;
  }

  function navigate(viewName) {
    if (!views[viewName]) return;
    document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === `view-${viewName}`));
    document.querySelectorAll(".nav-link[data-view]").forEach((link) => link.classList.toggle("active", link.dataset.view === viewName));
    byId("breadcrumb-current").textContent = views[viewName];
    byId("sidebar").classList.remove("open");
    if (viewName === "risk" || viewName === "dashboard") {
      window.setTimeout(() => {
        const map = state.maps[viewName === "risk" ? "risk-map" : "dashboard-map"];
        if (map) {
          map.invalidateSize({ pan: false });
          fitBrazil(map);
        }
      }, 80);
    }
    if (viewName === "alerts") renderAlerts();
    if (viewName === "history") renderHistory();
    if (viewName === "reports") renderReportHistory();
  }

  function iconForType(type) {
    return typeIcons[type] || "triangle-alert";
  }

  function renderRecentAlerts() {
    byId("recent-alerts").innerHTML = alerts.slice(0, 5).map((alert) => `
      <div class="recent-alert" data-alert-id="${alert.id}" role="button" tabindex="0" aria-label="Ver ${escapeHtml(alert.title)} no mapa">
        <span class="alert-type-icon ${alert.type === "Desmatamento" ? "deforest" : alert.type === "Área de risco" ? "risk" : ""}">${icon(iconForType(alert.type))}</span>
        <span class="recent-alert-copy"><strong>${escapeHtml(alert.title)}</strong><small>${escapeHtml(alert.location)} · ${localDate(alert.hours)}</small></span>
        ${riskBadge(alert.risk)}
      </div>`).join("");
    byId("recent-alerts").querySelectorAll(".recent-alert").forEach((row) => {
      row.addEventListener("click", () => showAlertOnMap(row.dataset.alertId));
      row.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") showAlertOnMap(row.dataset.alertId); });
    });
    renderIcons();
  }

  function renderDashboardDrones() {
    byId("dashboard-drones").innerHTML = drones.slice(0, 4).map((drone) => `
      <div class="drone-row"><span class="drone-avatar">${icon("navigation")}</span><span class="drone-row-copy"><strong>${escapeHtml(drone.name)}</strong><small>${escapeHtml(drone.location)}</small></span><span class="drone-battery">${drone.status === "Offline" ? "Offline" : `${drone.battery}%`}</span></div>`).join("");
    renderIcons();
  }

  function createMap(elementId, zoom = 4) {
    if (!window.L || state.maps[elementId]) return;
    const map = L.map(elementId, { zoomControl: false, scrollWheelZoom: false, preferCanvas: true }).setView([-14.5, -52], zoom);
    L.control.zoom({ position: "topright" }).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: "abc",
      maxZoom: 19
    }).addTo(map);
    state.maps[elementId] = map;
    return map;
  }

  function fitBrazil(map) {
    map.fitBounds(brazilBounds, { padding: [18, 18], maxZoom: 4, animate: false });
  }

  function popupContent(title, location, risk, extra = "") {
    return `<strong>${escapeHtml(title)}</strong><br>${escapeHtml(location)}<br><span class="popup-risk">${escapeHtml(risk)}${extra ? ` · ${escapeHtml(extra)}` : ""}</span>`;
  }

  function renderDashboardMap() {
    const map = createMap("dashboard-map", 4);
    if (!map || map._simaMarkers) return;
    map._simaMarkers = true;
    alerts.forEach((alert) => {
      const marker = L.circleMarker([alert.lat, alert.lng], {
        radius: alert.risk === "Crítico" ? 8 : 6,
        color: "#e8f2eb",
        weight: 1.2,
        fillColor: riskColors[alert.risk],
        fillOpacity: .93
      }).addTo(map);
      marker.bindPopup(popupContent(alert.type, alert.location, alert.risk, alert.id));
      marker.on("mouseover", function () { this.openPopup(); });
    });
    fitBrazil(map);
  }

  function renderRiskMap() {
    const map = createMap("risk-map", 4);
    if (!map || map._simaMarkers) return;
    map._simaMarkers = true;
    states.forEach((item) => {
      const count = alerts.filter((alert) => alert.state === item.name).length;
      const marker = L.circleMarker([item.lat, item.lng], {
        radius: item.risk === "Crítico" ? 10 : item.risk === "Alto" ? 8 : 6,
        color: "#e8f2eb",
        weight: 1.1,
        fillColor: riskColors[item.risk],
        fillOpacity: .88
      }).addTo(map);
      marker.bindPopup(popupContent(`${item.name} (${item.uf})`, item.region, item.risk, `${count} ${count === 1 ? "alerta registrado" : "alertas registrados"}`));
      marker.on("mouseover", function () { this.openPopup(); });
    });
    byId("risk-map-center").addEventListener("click", () => fitBrazil(map));
  }

  function showAlertOnMap(id) {
    const alert = alerts.find((item) => item.id === id);
    if (!alert) return;
    navigate("dashboard");
    window.setTimeout(() => {
      const map = state.maps["dashboard-map"];
      if (!map) return;
      map.setView([alert.lat, alert.lng], 7, { animate: true });
      map.eachLayer((layer) => {
        if (layer instanceof L.CircleMarker && layer.getLatLng().lat === alert.lat && layer.getLatLng().lng === alert.lng) layer.openPopup();
      });
    }, 100);
  }

  function renderRiskSummary() {
    const levels = ["Crítico", "Alto", "Moderado", "Baixo"];
    byId("risk-summary").innerHTML = levels.map((level) => `
      <div class="risk-summary-card"><span class="risk-summary-color ${riskKeys[level]}"></span><span><strong>${states.filter((item) => item.risk === level).length}</strong><small>Estados · ${level}</small></span></div>`).join("");
    const riskOrder = ["Crítico", "Alto", "Moderado", "Baixo"];
    byId("risk-distribution").innerHTML = riskOrder.map((level) => {
      const matched = states.filter((item) => item.risk === level);
      return `<div class="risk-dist-item"><div class="risk-dist-head"><span>${level}</span><strong>${matched.length} <small>estados</small></strong></div><div class="risk-dist-bar"><i style="--bar-color:${riskColors[level]};width:${(matched.length / states.length) * 100}%"></i></div><div class="risk-dist-states">${matched.map((item) => item.uf).join(" · ")}</div></div>`;
    }).join("");
    byId("risk-update-time").textContent = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date());
  }

  function populateStateFilter() {
    const select = byId("alert-state");
    states.slice().sort((a, b) => a.name.localeCompare(b.name, "pt-BR")).forEach((item) => {
      const option = document.createElement("option");
      option.value = item.name;
      option.textContent = `${item.name} (${item.uf})`;
      select.append(option);
    });
  }

  function alertCard(alert) {
    const thumbClass = alert.type === "Desmatamento" ? "thumb-deforest" : alert.type === "Área de risco" ? "thumb-risk" : "";
    return `<article class="alert-card">
      <div class="alert-thumb ${thumbClass}" role="img" aria-label="Imagem demonstrativa da ocorrência de ${escapeHtml(alert.type.toLowerCase())}"></div>
      <div class="alert-main"><h3>${escapeHtml(alert.title)}</h3><p>${escapeHtml(alert.type)} · ${escapeHtml(alert.location)}</p><small>${icon("scan-eye")} ${escapeHtml(alert.sensor)} <span>·</span> ${escapeHtml(alert.id)}</small></div>
      <div class="alert-meta"><span>${icon("map-pin")} ${escapeHtml(alert.coordinates)}</span><span>${icon("clock-3")} ${localDate(alert.hours)}</span></div>
      <div class="alert-status">${riskBadge(alert.risk)}${statusBadge(alert.status)}</div>
      <button class="alert-action" data-map-alert="${alert.id}">${icon("map-pin")} Ver no mapa</button>
    </article>`;
  }

  function renderAlerts() {
    const search = byId("alert-search").value.trim().toLocaleLowerCase("pt-BR");
    const selectedState = byId("alert-state").value;
    const selectedRisk = byId("alert-risk").value;
    const period = byId("alert-period").value;
    const matches = alerts.filter((alert) => {
      const textMatch = !search || [alert.title, alert.type, alert.location, alert.coordinates, alert.id, alert.sensor].some((field) => field.toLocaleLowerCase("pt-BR").includes(search));
      const periodMatch = !period || (period === "today" ? alert.hours <= 24 : alert.hours <= 168);
      return textMatch && (!selectedState || alert.state === selectedState) && (!selectedRisk || alert.risk === selectedRisk) && periodMatch;
    });
    const activeCritical = matches.filter((alert) => alert.risk === "Crítico" && alert.status !== "Resolvido").length;
    byId("alert-results-count").textContent = `Exibindo ${matches.length} ${matches.length === 1 ? "ocorrência" : "ocorrências"}`;
    byId("critical-count").textContent = activeCritical;
    byId("alerts-list").innerHTML = matches.length ? matches.map(alertCard).join("") : `<div class="empty-state">Nenhuma ocorrência encontrada com esses filtros.</div>`;
    byId("alerts-list").querySelectorAll("[data-map-alert]").forEach((button) => button.addEventListener("click", () => showAlertOnMap(button.dataset.mapAlert)));
    renderIcons();
  }

  function renderDroneViews() {
    byId("fleet-list").innerHTML = drones.map((drone) => `
      <div class="fleet-unit ${drone.status === "Offline" ? "offline" : ""}"><span class="fleet-icon">${icon("navigation")}</span><span class="fleet-unit-copy"><strong>${escapeHtml(drone.name)}</strong><small><i></i>${escapeHtml(drone.status)} · ${escapeHtml(drone.location)}</small></span></div>`).join("");
    const gallery = [
      ["Reserva florestal, AM", "Arara-07 · 14:32", ""],
      ["Área de preservação, PA", "Guará-03 · 14:18", "photo-two"],
      ["Cerrado, MT", "Tucano-12 · 13:56", "photo-three"],
      ["Borda de floresta, RO", "Uirapuru-02 · 13:41", "photo-four"]
    ];
    byId("drone-gallery").innerHTML = gallery.map(([name, detail, photo]) => `
      <div class="gallery-item"><div class="gallery-photo ${photo}" role="img" aria-label="Imagem aérea demonstrativa de ${escapeHtml(name)}"><span>${icon("image")} DEMO</span></div><strong>${escapeHtml(name)}</strong><small>${escapeHtml(detail)}</small></div>`).join("");
    byId("feed-time").textContent = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "medium" }).format(new Date());
    renderIcons();
  }

  function chartOptions(extra = {}) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: "#17231b", borderColor: "#344b39", borderWidth: 1, titleColor: "#e9f1ea", bodyColor: "#b5c4b8", padding: 10, displayColors: true }
      },
      scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { color: "#849288", font: { family: "DM Sans", size: 9 } } },
        y: { beginAtZero: true, grid: { color: "#26332a" }, border: { display: false }, ticks: { color: "#78867d", font: { family: "DM Sans", size: 8 }, maxTicksLimit: 5 } }
      },
      ...extra
    };
  }

  function makeChart(canvasId, config) {
    const canvas = byId(canvasId);
    if (!canvas || !window.Chart) return;
    if (state.charts[canvasId]) state.charts[canvasId].destroy();
    state.charts[canvasId] = new Chart(canvas, config);
  }

  function buildCharts() {
    const green = "#61d890";
    const orange = "#ff8b62";
    const amber = "#f0c865";
    makeChart("fires-chart", {
      type: "line",
      data: { labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"], datasets: [{ data: [164, 198, 151, 247, 210, 312, 284], borderColor: orange, backgroundColor: "#ff8b6219", borderWidth: 2, fill: true, tension: .36, pointRadius: 2.5, pointHoverRadius: 5, pointBackgroundColor: orange }] },
      options: chartOptions()
    });
    makeChart("risk-region-chart", {
      type: "bar",
      data: { labels: ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"], datasets: [{ data: [482, 176, 368, 121, 74], backgroundColor: [green, amber, orange, "#70a9e9", "#88b8a1"], borderRadius: 4, maxBarThickness: 27 }] },
      options: chartOptions({ plugins: { legend: { display: false }, tooltip: { backgroundColor: "#17231b", borderColor: "#344b39", borderWidth: 1, titleColor: "#e9f1ea", bodyColor: "#b5c4b8", padding: 10 } } })
    });
    makeChart("risk-trend-chart", {
      type: "line",
      data: { labels: ["Abr", "Mai", "Jun", "Jul", "Ago", "Set"], datasets: [{ data: [62, 58, 71, 83, 76, 64], borderColor: amber, backgroundColor: "#f0c86517", borderWidth: 2, fill: true, tension: .35, pointRadius: 2, pointBackgroundColor: amber }] },
      options: chartOptions()
    });
    makeChart("stats-comparison-chart", {
      type: "bar",
      data: { labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"], datasets: [{ label: "Queimadas", data: [2100, 1880, 2470, 2850, 3200, 4340, 5910, 8270, 7540, 4840, 3040, 1952], backgroundColor: "#ff8b62c7", borderRadius: 3, maxBarThickness: 17 }, { label: "Desmatamento", data: [710, 680, 820, 940, 990, 1010, 1280, 1540, 1630, 1420, 1180, 1060], backgroundColor: "#61d890b8", borderRadius: 3, maxBarThickness: 17 }] },
      options: chartOptions({ plugins: { legend: { display: false }, tooltip: { backgroundColor: "#17231b", borderColor: "#344b39", borderWidth: 1, titleColor: "#e9f1ea", bodyColor: "#b5c4b8", padding: 10 } } })
    });
    makeChart("stats-region-chart", {
      type: "doughnut",
      data: { labels: ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"], datasets: [{ data: [56, 12, 21, 7, 4], backgroundColor: [green, amber, orange, "#77a6eb", "#b38de8"], borderColor: "#111b17", borderWidth: 3, hoverOffset: 5 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: "66%", plugins: { legend: { position: "bottom", labels: { color: "#a8b6ab", padding: 12, usePointStyle: true, pointStyle: "circle", font: { family: "DM Sans", size: 8 } } }, tooltip: { backgroundColor: "#17231b", borderColor: "#344b39", borderWidth: 1, titleColor: "#e9f1ea", bodyColor: "#b5c4b8", padding: 10 } } }
    });
  }

  function historyRecords() {
    return alerts.map((alert) => ({ ...alert, date: dateShort(alert.hours) }));
  }

  function renderHistory() {
    const query = byId("history-search").value.trim().toLocaleLowerCase("pt-BR");
    const selectedType = byId("history-type").value;
    const selectedStatus = byId("history-status").value;
    const records = historyRecords().filter((item) => {
      const searchable = [item.id, item.title, item.type, item.location, item.coordinates, item.state].join(" ").toLocaleLowerCase("pt-BR");
      return (!query || searchable.includes(query)) && (!selectedType || item.type === selectedType) && (!selectedStatus || item.status === selectedStatus);
    });
    byId("history-count").textContent = `${records.length} ${records.length === 1 ? "registro encontrado" : "registros encontrados"}`;
    byId("history-table-body").innerHTML = records.length ? records.map((item) => `
      <tr><td class="protocol-code">${escapeHtml(item.id)}</td><td>${escapeHtml(item.type)}</td><td>${escapeHtml(item.location)}</td><td>${escapeHtml(item.date)}</td><td>${riskBadge(item.risk)}</td><td>${statusBadge(item.status)}</td><td><button class="table-action" data-history-map="${item.id}" title="Ver no mapa" aria-label="Ver ${escapeHtml(item.title)} no mapa">${icon("map-pin")}</button></td></tr>`).join("") : `<tr><td colspan="7"><div class="empty-state">Nenhum registro corresponde à busca.</div></td></tr>`;
    byId("history-table-body").querySelectorAll("[data-history-map]").forEach((button) => button.addEventListener("click", () => showAlertOnMap(button.dataset.historyMap)));
    renderIcons();
  }

  function reportRows() {
    const type = byId("report-type").value;
    const region = byId("report-region").value;
    const start = byId("report-start").value || "Não informado";
    const end = byId("report-end").value || "Não informado";
    const title = byId("report-type").selectedOptions[0].textContent;
    let records = alerts.filter((alert) => {
      if (type === "fires" && alert.type !== "Queimada") return false;
      if (type === "deforestation" && alert.type !== "Desmatamento") return false;
      if (type === "risk") return false;
      if (type === "drones") return false;
      if (region !== "Todo o Brasil") {
        const itemState = states.find((item) => item.name === alert.state);
        return itemState && itemState.region === region;
      }
      return true;
    });
    if (type === "risk") {
      records = states.filter((item) => region === "Todo o Brasil" || item.region === region).map((item, index) => ({
        id: `SIMA-RISCO-${String(index + 1).padStart(3, "0")}`,
        type: "Nível de risco",
        title: `Classificação ambiental de ${item.name}`,
        state: item.name,
        location: item.region,
        coordinates: `${item.lat.toFixed(4)}, ${item.lng.toFixed(4)}`,
        risk: item.risk,
        status: "Monitorado",
        hours: 0,
        sensor: "Monitoramento SIMA"
      }));
    }
    if (type === "drones") {
      records = drones.map((drone, index) => ({
        id: `SIMA-DRONE-${String(index + 1).padStart(3, "0")}`,
        type: "Operação de drone",
        title: `Unidade ${drone.name}`,
        state: drone.location.split(", ").pop(),
        location: drone.location,
        coordinates: "—",
        risk: "—",
        status: drone.status,
        hours: 0,
        sensor: "Telemetria da frota"
      })).filter((item) => {
        if (region === "Todo o Brasil") return true;
        const droneState = states.find((stateItem) => stateItem.uf === item.state);
        return droneState && droneState.region === region;
      });
    }
    return { title, region, start, end, records };
  }

  function reportFilename(extension) {
    const { title } = reportRows();
    const slug = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return `sima-${slug}-${new Date().toISOString().slice(0, 10)}.${extension}`;
  }

  function recordReport(format, filename) {
    state.reportHistory.unshift({ format, filename, date: new Date() });
    renderReportHistory();
  }

  function exportExcel() {
    const { title, region, start, end, records } = reportRows();
    if (!window.XLSX) {
      downloadCsv(records, "alertas");
      toast("Biblioteca Excel indisponível; a lista foi exportada como CSV.", "error");
      return;
    }
    const rows = records.map((item) => ({
      "Protocolo": item.id,
      "Tipo": item.type,
      "Ocorrência": item.title,
      "Estado": item.state,
      "Município / localização": item.location,
      "Coordenadas": item.coordinates,
      "Risco": item.risk,
      "Status": item.status,
      "Data": localDate(item.hours),
      "Sensor": item.sensor
    }));
    rows.unshift({ "Protocolo": title, "Tipo": `Período: ${start} a ${end}`, "Ocorrência": `Região: ${region}` });
    const sheet = XLSX.utils.json_to_sheet(rows);
    sheet["!cols"] = [{ wch: 19 }, { wch: 23 }, { wch: 40 }, { wch: 24 }, { wch: 32 }, { wch: 23 }, { wch: 13 }, { wch: 18 }, { wch: 23 }, { wch: 23 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Ocorrências");
    XLSX.writeFile(workbook, reportFilename("xlsx"));
    recordReport("xlsx", reportFilename("xlsx"));
    toast("Planilha Excel gerada com sucesso.");
  }

  function downloadCsv(records = alerts, name = "ocorrencias") {
    const headings = ["Protocolo", "Tipo", "Ocorrência", "Estado", "Localização", "Coordenadas", "Risco", "Status", "Data", "Sensor"];
    const data = records.map((item) => [item.id, item.type, item.title, item.state, item.location, item.coordinates, item.risk, item.status, localDate(item.hours), item.sensor]);
    const csv = [headings, ...data].map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
    link.download = `sima-${name}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function exportAlerts() {
    if (!window.XLSX) {
      downloadCsv(alerts);
      toast("Lista de alertas exportada em CSV. A biblioteca Excel não está disponível.", "error");
      return;
    }
    const rows = alerts.map((item) => ({
      "Protocolo": item.id, "Tipo": item.type, "Ocorrência": item.title, "Estado": item.state, "Localização": item.location,
      "Coordenadas": item.coordinates, "Risco": item.risk, "Status": item.status, "Data": localDate(item.hours), "Sensor": item.sensor
    }));
    const sheet = XLSX.utils.json_to_sheet(rows);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Alertas");
    XLSX.writeFile(book, `sima-alertas-${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast("Lista de alertas exportada em Excel.");
  }

  function exportPdf() {
    const { title, region, start, end, records } = reportRows();
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast("O navegador bloqueou a janela de impressão. Permita pop-ups para exportar o PDF.", "error");
      return;
    }
    const rows = records.map((item) => `<tr><td>${escapeHtml(item.id)}</td><td>${escapeHtml(item.type)} — ${escapeHtml(item.title)}</td><td>${escapeHtml(item.location)}</td><td>${escapeHtml(item.coordinates)}</td><td>${escapeHtml(item.risk)}</td><td>${escapeHtml(item.status)}</td><td>${escapeHtml(localDate(item.hours))}</td></tr>`).join("");
    const reportDocument = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${escapeHtml(title)} · SIMA</title><style>
      *{box-sizing:border-box}body{margin:0;padding:38px;color:#183022;font:12px/1.5 Arial,sans-serif}header{display:flex;justify-content:space-between;align-items:center;padding-bottom:18px;border-bottom:2px solid #287446}.brand{color:#287446;font-size:23px;font-weight:700;letter-spacing:2px}.tag{color:#54665a;font-size:9px;letter-spacing:1px}.meta{margin:23px 0;padding:13px;background:#f1f6f1;border-radius:5px}.meta strong{display:block;margin-bottom:8px;font-size:18px}.meta span{margin-right:18px;color:#526458;font-size:10px}h2{margin:21px 0 10px;font-size:13px}table{width:100%;border-collapse:collapse;font-size:9px}th{text-align:left;color:#fff;background:#24653f;padding:8px 6px}td{padding:8px 6px;border-bottom:1px solid #dce7dd;vertical-align:top}footer{margin-top:25px;padding-top:10px;border-top:1px solid #dce7dd;color:#66776c;font-size:8px}@media print{body{padding:18mm 14mm}@page{size:landscape;margin:0}}</style></head><body><header><div><div class="brand">SIMA</div><div class="tag">SISTEMA INTEGRADO DE MONITORAMENTO AMBIENTAL</div></div><div>BRASIL · ${new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date())}</div></header><div class="meta"><strong>${escapeHtml(title)}</strong><span>Período: ${escapeHtml(start)} a ${escapeHtml(end)}</span><span>Região: ${escapeHtml(region)}</span><span>Registros: ${records.length}</span></div><h2>Ocorrências monitoradas</h2><table><thead><tr><th>Protocolo</th><th>Tipo e ocorrência</th><th>Localização</th><th>Coordenadas</th><th>Risco</th><th>Status</th><th>Data</th></tr></thead><tbody>${rows || "<tr><td colspan='7'>Nenhum registro para os filtros selecionados.</td></tr>"}</tbody></table><footer>Documento gerado pelo SIMA · Dados demonstrativos para apresentação. Este relatório não representa dados oficiais.</footer><script>window.addEventListener("load",()=>window.print())<\/script></body></html>`;
    printWindow.document.open();
    printWindow.document.write(reportDocument);
    printWindow.document.close();
    recordReport("pdf", reportFilename("pdf"));
  }

  function renderReportHistory() {
    const entries = state.reportHistory.length ? state.reportHistory : [
      { format: "xlsx", filename: "Relatório_queimadas_agosto.xlsx", date: new Date(Date.now() - 86400000) },
      { format: "pdf", filename: "Monitoramento_Amazônia.pdf", date: new Date(Date.now() - 172800000) },
      { format: "xlsx", filename: "Resumo_operacional.xlsx", date: new Date(Date.now() - 604800000) }
    ];
    byId("reports-list").innerHTML = entries.map((item) => `
      <div class="report-entry"><span class="report-file-icon ${item.format === "xlsx" ? "xlsx" : ""}">${icon(item.format === "xlsx" ? "file-spreadsheet" : "file-text")}</span><span class="report-entry-copy"><strong>${escapeHtml(item.filename)}</strong><small>${new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(item.date)} · ${item.format.toUpperCase()}</small></span><button class="report-download" data-report-format="${item.format}" title="Gerar ${item.format.toUpperCase()}" aria-label="Gerar ${item.format.toUpperCase()} novamente">${icon("download")}</button></div>`).join("");
    byId("reports-list").querySelectorAll("[data-report-format]").forEach((button) => button.addEventListener("click", () => button.dataset.reportFormat === "xlsx" ? exportExcel() : exportPdf()));
    renderIcons();
  }

  function setRole(role) {
    state.role = role;
    byId("sidebar-role").textContent = role === "Administrador" ? "Administradora" : role;
    byId("settings-role-pill").textContent = role;
    byId("role-select").value = role;
    const allowed = {
      Administrador: ["dashboard", "alerts", "drones", "risk", "statistics", "reports", "history", "settings"],
      Operador: ["dashboard", "alerts", "drones", "risk", "history", "settings"],
      Analista: ["dashboard", "risk", "statistics", "reports", "history", "settings"]
    }[role] || [];
    document.querySelectorAll(".nav-link[data-view]").forEach((link) => {
      const permitted = allowed.includes(link.dataset.view);
      link.hidden = !permitted;
      link.setAttribute("aria-hidden", String(!permitted));
    });
    if (!allowed.includes(document.querySelector(".nav-link.active")?.dataset.view)) navigate("dashboard");
  }

  function setTheme(theme) {
    const resolved = theme === "system" ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : theme;
    document.body.classList.toggle("light-theme", resolved === "light");
    byId("theme-select").value = theme;
    persist("theme", theme);
  }

  function applySettings() {
    state.notificationSettings = {
      critical: byId("notify-critical").checked,
      new: byId("notify-new").checked,
      daily: byId("notify-daily").checked
    };
    persist("notifications", state.notificationSettings);
    toast("Preferências salvas com sucesso.");
  }

  function updateYearCharts() {
    const year = byId("stats-year").value;
    const chart = state.charts["stats-comparison-chart"];
    if (!chart) return;
    const values = {
      "2025": { fires: [2100, 1880, 2470, 2850, 3200, 4340, 5910, 8270, 7540, 4840, 3040, 1952], forest: [710, 680, 820, 940, 990, 1010, 1280, 1540, 1630, 1420, 1180, 1060] },
      "2024": { fires: [2600, 2300, 2900, 3300, 4100, 5800, 7400, 9600, 8800, 6700, 4300, 3318], forest: [870, 810, 940, 1100, 1220, 1400, 1700, 1850, 1780, 1600, 1320, 1238] },
      "2023": { fires: [3200, 3000, 3500, 4200, 5100, 7400, 9100, 12400, 11000, 8700, 5500, 8742], forest: [1200, 1150, 1300, 1480, 1650, 1870, 2100, 2300, 2240, 1950, 1680, 1600] }
    }[year];
    chart.data.datasets[0].data = values.fires;
    chart.data.datasets[1].data = values.forest;
    chart.update();
    toast(`Estatísticas atualizadas para ${year}.`);
  }

  function bindEvents() {
    document.querySelectorAll(".nav-link[data-view]").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.view)));
    document.querySelectorAll("[data-navigate]").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.navigate)));
    byId("menu-toggle").addEventListener("click", () => byId("sidebar").classList.toggle("open"));
    document.addEventListener("click", (event) => {
      if (window.innerWidth <= 700 && byId("sidebar").classList.contains("open") && !byId("sidebar").contains(event.target) && !byId("menu-toggle").contains(event.target)) byId("sidebar").classList.remove("open");
    });
    ["alert-search", "alert-state", "alert-risk", "alert-period"].forEach((id) => byId(id).addEventListener(id === "alert-search" ? "input" : "change", renderAlerts));
    byId("reset-alert-filters").addEventListener("click", () => {
      ["alert-search", "alert-state", "alert-risk", "alert-period"].forEach((id) => { byId(id).value = ""; });
      renderAlerts();
    });
    ["history-search", "history-type", "history-status"].forEach((id) => byId(id).addEventListener(id === "history-search" ? "input" : "change", renderHistory));
    byId("reset-history-filters").addEventListener("click", () => {
      ["history-search", "history-type", "history-status"].forEach((id) => { byId(id).value = ""; });
      renderHistory();
    });
    byId("export-alerts").addEventListener("click", exportAlerts);
    byId("export-history").addEventListener("click", () => {
      if (!window.XLSX) downloadCsv(historyRecords(), "historico");
      else {
        const sheet = XLSX.utils.json_to_sheet(historyRecords().map(({ id, type, title, location, coordinates, risk, status, state: stateName, hours }) => ({ Protocolo: id, Tipo: type, Ocorrência: title, Estado: stateName, Localização: location, Coordenadas: coordinates, Risco: risk, Status: status, Data: localDate(hours) })));
        const book = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(book, sheet, "Histórico");
        XLSX.writeFile(book, `sima-historico-${new Date().toISOString().slice(0, 10)}.xlsx`);
      }
      toast("Histórico exportado com sucesso.");
    });
    byId("generate-pdf").addEventListener("click", exportPdf);
    byId("generate-excel").addEventListener("click", exportExcel);
    byId("role-select").addEventListener("change", (event) => {
      setRole(event.target.value);
      toast(`Perfil alterado para ${event.target.value}.`);
    });
    byId("theme-select").addEventListener("change", (event) => {
      setTheme(event.target.value);
      toast(`Tema ${event.target.value === "light" ? "claro" : event.target.value === "system" ? "do sistema" : "escuro"} aplicado.`);
    });
    byId("save-settings").addEventListener("click", applySettings);
    byId("notification-button").addEventListener("click", () => {
      toast(`${activeAlertCount()} alertas ativos. ${alerts.filter((item) => item.risk === "Crítico" && item.status !== "Resolvido").length} em nível crítico.`);
    });
    byId("profile-button").addEventListener("click", () => navigate("settings"));
    byId("logout-button").addEventListener("click", logout);
    byId("close-login").addEventListener("click", () => { if (state.user) byId("login-modal").hidden = true; });
    byId("login-modal").addEventListener("click", (event) => {
      if (event.target === byId("login-modal") && state.user) byId("login-modal").hidden = true;
    });
    byId("show-register").addEventListener("click", () => {
      const registering = byId("register-form").hidden;
      showAuthMode(registering ? "register" : "login");
    });
    byId("login-form").addEventListener("submit", submitLogin);
    byId("register-form").addEventListener("submit", submitRegistration);
    byId("feed-fullscreen").addEventListener("click", async () => {
      const feed = document.querySelector(".feed-screen");
      if (!document.fullscreenElement && feed.requestFullscreen) await feed.requestFullscreen();
      else if (document.exitFullscreen) await document.exitFullscreen();
    });
    byId("stats-year").addEventListener("change", updateYearCharts);
    byId("dashboard-chart-period").addEventListener("click", () => toast("Exibindo os focos de queimadas dos últimos 7 dias."));
    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (!document.querySelector('.nav-link[data-view="alerts"]').hidden) navigate("alerts");
        byId("alert-search").focus();
      }
      if (event.key === "Escape") {
        if (state.user) byId("login-modal").hidden = true;
        byId("sidebar").classList.remove("open");
      }
    });
  }

  function initialize() {
    byId("current-date").textContent = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(new Date());
    const savedTheme = retrieve("theme");
    const savedNotifications = retrieve("notifications");
    if (savedNotifications) {
      state.notificationSettings = savedNotifications;
      byId("notify-critical").checked = Boolean(savedNotifications.critical);
      byId("notify-new").checked = Boolean(savedNotifications.new);
      byId("notify-daily").checked = Boolean(savedNotifications.daily);
    }
    populateStateFilter();
    renderRecentAlerts();
    renderDashboardDrones();
    renderAlerts();
    renderHistory();
    renderDroneViews();
    renderRiskSummary();
    renderDashboardMap();
    renderRiskMap();
    buildCharts();
    renderReportHistory();
    bindEvents();
    if (savedTheme) setTheme(savedTheme);
    setAlertCount();
    renderIcons();
    initializeAuth();
    window.setInterval(() => {
      const label = byId("current-date");
      if (label && document.querySelector("#view-dashboard").classList.contains("active")) {
        byId("feed-time").textContent = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "medium" }).format(new Date());
      }
    }, 30000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
  else initialize();
})();
