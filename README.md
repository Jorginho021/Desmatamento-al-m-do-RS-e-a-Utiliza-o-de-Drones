# SIMA

## Sistema Integrado de Monitoramento Ambiental

Aplicação web demonstrativa para visualização e análise de informações ambientais, com foco em desmatamento, queimadas, monitoramento territorial e uso de drones na recuperação da flora nativa.

O projeto reúne um painel interativo e uma API local com cadastro e autenticação de usuários. **Os dados ambientais apresentados são simulados:** não há integração com fontes oficiais, telemetria de drones ou monitoramento em tempo real.

## Visão geral

O SIMA foi desenvolvido como protótipo de uma central de operações ambientais. A interface organiza indicadores e registros demonstrativos em módulos que podem ser explorados pelo menu lateral.

| Módulo | Descrição |
| --- | --- |
| **Visão geral** | Indicadores, mapa nacional com os pontos das ocorrências demonstrativas, alertas recentes, focos de queimadas e situação da frota. Selecione um ponto para ver sua localização e nível de risco. |
| **Alertas** | Pesquisa e filtros de ocorrências por estado, risco e período, com opção de exportação. |
| **Operação de drones** | Apresentação ilustrativa de transmissão, telemetria, frota e capturas aéreas. |
| **Nível de risco** | Mapa de todo o Brasil com pontos de referência nas 27 unidades federativas e gráficos com classificação demonstrativa por estado e região. Selecione um ponto para consultar o estado, a região e o risco. O botão de centralização volta a enquadrar o Brasil inteiro. |
| **Estatísticas ambientais** | Indicadores e gráficos de queimadas, desmatamento, alertas e ocorrências regionais. |
| **Relatórios** | Configuração de relatórios por tipo, período e região; exportação para PDF, Excel ou CSV, conforme disponibilidade. |
| **Histórico** | Consulta e filtragem de registros de ocorrências de exemplo, com exportação. |
| **Configurações** | Preferências de tema e notificações, além dos dados da conta autenticada. |

## Tecnologias

- **Interface:** HTML, CSS e JavaScript.
- **Servidor e API:** Node.js com módulos nativos.
- **Persistência:** SQLite, por meio do módulo `node:sqlite`.
- **Visualização:** Leaflet para mapas com base cartográfica do OpenStreetMap, Chart.js para gráficos e Lucide para ícones.
- **Exportações:** SheetJS para planilhas; impressão do navegador para PDF.

As bibliotecas visuais são carregadas de CDNs e o mapa usa blocos cartográficos do OpenStreetMap com atribuição exibida na própria interface. É necessária conexão à internet para carregar esses recursos. Os pontos representam ocorrências e localizações de referência simuladas; não são limites oficiais dos estados nem dados geográficos oficiais.

## Requisitos

- Node.js **22.13 ou superior**.
- Navegador moderno.
- Conexão à internet para bibliotecas, mapas e recursos externos.

O projeto não requer dependências npm de terceiros para iniciar.

## Instalação e execução

No PowerShell, abra a pasta do projeto e execute:

```powershell
npm.cmd start
```

Alternativamente:

```powershell
node server.js
```

Quando o terminal indicar que o SIMA está disponível, abra [http://127.0.0.1:8000](http://127.0.0.1:8000). Mantenha o processo em execução durante o uso. Para pará-lo, pressione `Ctrl+C`.

> O cadastro e o login dependem do servidor e da API. Não abra `index.html` diretamente nem sirva o projeto com um servidor estático.

### Configuração opcional

Por padrão, o servidor usa o endereço local `127.0.0.1`, a porta `8000` e cria o arquivo SQLite em `data/sima.sqlite`. É possível configurar esses valores antes de iniciar:

```powershell
$env:SIMA_PORT = "8001"
$env:SIMA_DB_PATH = "C:\caminho\para\sima.sqlite"
npm.cmd start
```

O endereço de escuta também pode ser configurado com `SIMA_HOST`. Para manter o serviço acessível somente na própria máquina, deixe-o no valor padrão `127.0.0.1`.

## Contas e autenticação

1. Na tela inicial, selecione **Cadastre-se** para criar uma conta.
2. Informe nome, e-mail, senha e confirmação da senha.
3. A senha deve ter entre 12 e 128 caracteres; cada e-mail pode ser usado em uma única conta.
4. Após o cadastro, a sessão é iniciada automaticamente. Também é possível entrar novamente usando e-mail e senha.
5. Use o ícone de saída na barra lateral para encerrar a sessão.

As novas contas recebem o perfil **Analista**. A sessão é mantida em cookie `HttpOnly` e expira após sete dias. Os dados da conta são persistidos no banco; as preferências de aparência e notificações são armazenadas localmente no navegador.

### API de autenticação

As rotas são servidas pelo mesmo endereço e origem da aplicação:

| Método | Rota | Finalidade |
| --- | --- | --- |
| `POST` | `/api/register` | Criar conta e iniciar uma sessão. |
| `POST` | `/api/login` | Validar as credenciais e iniciar uma sessão. |
| `GET` | `/api/session` | Consultar a sessão atual. |
| `POST` | `/api/logout` | Encerrar a sessão atual. |

As rotas que recebem dados esperam JSON. O servidor valida os campos, normaliza os endereços de e-mail e usa consultas parametrizadas no SQLite.

## Persistência e segurança

O banco local contém as contas e as sessões. As senhas são armazenadas como hashes derivados com `scrypt` e salt aleatório; não são gravadas em texto puro. Os tokens das sessões também são armazenados no banco como hashes. A pasta `data/` e os arquivos SQLite são excluídos do controle de versão pelo `.gitignore`.

Este projeto é destinado a desenvolvimento e demonstração local, **não à publicação direta na internet**. Uma implantação real exige, entre outras medidas, HTTPS, proteção contra abuso e tentativas automatizadas, gestão e recuperação de contas, backups, monitoramento e revisão de segurança.

## Testes

Execute:

```powershell
npm.cmd test
```

O teste automatizado cria um banco temporário e verifica cadastro, duplicidade de e-mail, autenticação, consulta de sessão e logout. Os dados de teste são removidos ao final.

## Estrutura do projeto

```text
.
├── index.html          # Estrutura das páginas e formulários
├── styles.css          # Estilos, temas e layout responsivo
├── app.js              # Interface, navegação e integração com a API
├── server.js           # Servidor HTTP, rotas e banco SQLite
├── package.json        # Comandos start e test
├── test/
│   └── auth.test.js     # Testes de autenticação
└── data/                # Banco local, criado durante a execução
```

## Limitações dos dados

Alertas, ocorrências, estatísticas, mapas, imagens e telemetria de drones exibidos neste protótipo são **dados demonstrativos**. Não devem ser interpretados como informação oficial, evidência de operação real ou orientação para decisões ambientais. A integração com bases oficiais e equipamentos de campo não faz parte do projeto atual.
