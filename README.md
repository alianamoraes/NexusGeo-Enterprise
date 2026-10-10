# NexusGeo Enterprise

Plataforma SaaS de front-end de alto desempenho para analytics geoespacial agrícola, CRM multi-tenant e diagnósticos de solo orientados por IA. Construída com React, TypeScript, Tailwind CSS e ícones Lucide — projetada como um dashboard empresarial de nível de produção com controle de acesso baseado em papéis (RBAC) rigoroso, suporte bilíngue (EN / PT-BR) e um motor dinâmico de injeção de pontos no mapa.

---

## Sumário

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Funcionalidades Principais](#funcionalidades-principais)
3. [Guia de Instalação e Execução Local](#guia-de-instalação-e-execução-local)
4. [Limitações Conhecidas e Possíveis Bugs sob Estresse](#limitações-conhecidas-e-possíveis-bugs-sob-estresse)
5. [Roadmap e Escalabilidade Futura](#roadmap-e-escalabilidade-futura)

---

## Visão Geral do Projeto

O **NexusGeo Enterprise** é uma aplicação de página única (SPA) projetada como um estudo de caso robusto de Front-End UI/UX para o setor de tecnologia agrícola brasileiro. A plataforma simula a superfície operacional de um sistema completo de CRO (Customer Relationship & Operations) — abrangendo gestão de registro de clientes/fazendas/talhões, visualização de dados geoespaciais, diagnósticos automatizados de solo via IA, registro de auditoria de segurança e configuração de faturamento da plataforma.

### Stack Tecnológica

| Camada              | Tecnologia                              |
|---------------------|-----------------------------------------|
| Framework           | React 18 com TypeScript                 |
| Build Tool          | Vite 5                                  |
| Estilização         | Tailwind CSS 3 com variáveis CSS        |
| Ícones              | Lucide React                            |
| Gráficos            | Recharts 3                              |
| Gestão de Estado    | React Context API (em memória)          |
| Sistema de Fontes   | Stack de fontes do sistema com fallback Inter |

### Arquitetura Conceitual

```
┌─────────────────────────────────────────────────────────────────┐
│                        AppProvider (Context)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │ Estado Tema  │  │ Locale (i18n)│  │  Estado de Dados       │  │
│  │ (dark/light) │  │ (EN / PT-BR) │  │ (audit log, arquivos,  │  │
│  │              │  │              │  │  pontos, papel)        │  │
│  └─────────────┘  └──────────────┘  └────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         │                │                    │
         ▼                ▼                    ▼
┌──────────────┐  ┌──────────────┐  ┌───────────────────────────┐
│   Sidebar    │  │   Header     │  │   Área de Conteúdo        │
│  Navegação   │  │  Controles   │  │  (Troca dinâmica de views)│
└──────────────┘  └──────────────┘  └───────────────────────────┘
                                            │
                    ┌───────────┬───────────┼───────────┐
                    ▼           ▼           ▼           ▼
              Dashboard    CRM View    GIS View    Audit View
                                                    Settings
```

### Sistema de Design

A aplicação utiliza um motor de theming baseado em variáveis CSS que controla ambos os modos dark e light sem lógica condicional em nível de componente. Variáveis como `--c-primary`, `--c-secondary`, `--c-muted`, `--c-border`, `--c-surface-hover` e `--c-glass-bg` são definidas por tema e consumidas em todos os componentes, permitindo troca instantânea de tema sem flicker de re-renderização.

O sistema de espaçamento segue uma grade de 8px. A tipografia utiliza no máximo 3 pesos de fonte. As animações são alimentadas por classes keyframe customizadas (`animate-fade-in`, `animate-slide-up`, `animate-scale-in`, `animate-slide-down`) definidas na folha de estilos global.

---

## Funcionalidades Principais

### 1. Dashboard & Analytics CRO

A view principal de aterrissagem fornece uma visão operacional em tempo real:

- **Cartões de KPI** — Quatro métricas-chave (Taxa de Conversão, Clientes Gerenciados, Uptime do Servidor, Valor do Pipeline) com indicadores de tendência e mini sparklines.
- **Funil de Conversão** — Um gráfico de funil alimentado por Recharts visualizando as taxas de pass-through do pipeline de tráfego para vendas.
- **Histograma de Densidade de Dados** — Um gráfico de barras com linha de tendência cumulativa mostrando a distribuição de leituras de métricas do solo.
- **Kanban de Operações Pendentes** — Um quadro de workflow de quatro colunas (Ingestão de Dados, Revisão de Limites, Aprovação de Contratos, Sincronizações Concluídas) com indicadores de prioridade baseados em volume.

### 2. CRM & Ingestão

Um registro hierárquico multi-tenant e sistema de gestão de documentos:

- **Registro Hierárquico de Clientes** — Uma tabela em árvore expansível navegando Clientes → Fazendas → Talhões, com badges de tipo, região, área, cultura e colunas de status.
- **Ingestão de Arquivos via Drag & Drop** — Uma zona de descarga premium suportando formatos CSV, TXT, PDF, GeoJSON e KML. O pipeline de ingestão simula um processo de três fases: Upload → Parse de Geo-Coordenadas → Concluído, com uma barra de progresso ao vivo e contagem de coordenadas injetadas.
- **Injeção Dinâmica no Mapa** — Quando arquivos de dados espaciais (CSV, TXT, GeoJSON, KML) são ingeridos, o sistema gera automaticamente 10 pontos geográficos aleatórios dentro do limite do polígono do campo e os injeta diretamente na view do mapa do Motor GIS — sem atualização de página necessária.
- **Grade do Gerenciador de Documentos** — Uma grade responsiva de cartões exibindo todos os arquivos enviados com ícones específicos por tipo, categorias codificadas por cor, tamanho do arquivo, timestamp de upload e ações de download/exclusão (exclusão restrita ao papel Admin).

### 3. Motor Geoespacial GIS

Um workspace interativo de visualização de limites de campo:

- **Renderização de Mapa SVG Customizada** — Um mapa poligonal desenhado proceduralmente com grade de fundo, rótulos de vértices (V1–V5) e pontos de dispersão dinâmicos coloridos por um preset de escala selecionável (Viridis, Inferno, Ocean, Thermal, Monochrome).
- **Controles em Tempo Real** — Seletor de escala de cores, sliders de faixa de valores (mín/máx) e ajuste de tamanho de ponto — todos atualizando o mapa instantaneamente.
- **Diagnóstico de Solo via Luna AI** — Um fluxo de análise IA simulado que gera um relatório estruturado de diagnóstico do solo incluindo preset de escala, nós analisados, faixa de valores, média, desvio padrão, texto de análise gerado por IA e recomendações acionáveis. O relatório é renderizado no painel lateral do Luna AI Copilot.
- **Contador de Amostras ao Vivo** — Exibe o número atual de pontos de amostragem renderizados no mapa, atualizando em tempo real conforme novos dados são injetados do módulo de CRM.

### 4. Logs de Auditoria do Sistema

Um ledger de auditoria focado em segurança com filtragem abrangente:

- **Painel de Postura de Segurança** — Três cartões de resumo mostrando o papel atual, postura de segurança (contagens de crítico/aviso) e divisão de atividade (ações de admin vs. operador com barras proporcionais).
- **Ledger de Auditoria Pesquisável** — Uma tabela paginada (8 registros por página) com busca de texto completo across ações, componentes e endereços IP. Abas de filtro de severidade (Todos, Info, Aviso, Crítico) com badges codificados por cor.
- **Metadados de Entrada de Auditoria** — Cada registro captura timestamp, papel (Admin/Operador com badges de ícone), componente, descrição da ação, endereço IP e nível de severidade.
- **Trilha de Auditoria Dinâmica** — Cada ação do usuário across a plataforma (uploads de arquivos, exclusões, trocas de tema, trocas de idioma, tentativas de acesso admin, salvamento de configurações, downloads de backup) é automaticamente registrada na trilha de auditoria em tempo real.

### 5. Configurações & Receita

Um módulo de configuração de plataforma e gestão de faturamento:

- **Toggles de Configuração da Plataforma** — Seis toggles de segurança e operação (Backup Diário Automatizado, Sincronização de Dados em Tempo Real, Notificações por Email, Autenticação de Dois Fatores, Retenção Estendida de Dados, Limitação de Taxa da API).
- **Backup & Exportação de Dados** — Seletor de frequência de backup (diário/semanal/mensal) com exibição do próximo backup agendado e download funcional de backup de estado JSON que exporta o estado completo da aplicação.
- **Variáveis de Faturamento** — Um slider interativo de valor por cliente que calcula dinamicamente o MRR mensal com base em 247 clientes ativos, com exibição de taxa de retenção.
- **Planos de Assinatura** — Cartões de plano de faturamento de três níveis (Starter, Professional, Enterprise) com listas de funcionalidades e capacidade de troca de plano.
- **Resumo de Receita** — Breakdown de receita trimestral (Q1–Q4) com indicadores de crescimento QoQ.

### Luna AI Copilot

Um painel lateral flutuante acessível de qualquer view via botão de ação fixo:

- Exibe o identificador do modelo de IA (GPT-4o-mini / Motor de Analytics do Solo).
- Mostra um prompt de estado pronto quando nenhum diagnóstico foi executado.
- Renderiza o relatório completo de diagnóstico do solo após a ação "Executar Diagnóstico IA do Solo" no Motor GIS.
- Inclui um campo de entrada "Pergunte à Luna" para interação conversacional (pronto na UI).

### Controle de Acesso Baseado em Papéis (RBAC)

A plataforma impõe um sistema rigoroso de dois níveis de papéis com proteção por senha:

- **Papel Admin** — Acesso completo a todos os módulos, incluindo exclusão de documentos, modificação de configurações, configuração de faturamento e gestão de backup.
- **Papel Operador** — Acesso somente leitura across a plataforma. Operadores:
  - Não podem excluir arquivos no Gerenciador de Documentos do CRM (botões de exclusão são ocultados).
  - São bloqueados de todo o painel de Configurações por um overlay glassmórfico com tela de bloqueio.
  - Podem visualizar os Logs de Auditoria mas não têm acesso a nenhuma operação administrativa de banco de dados.
- **Verificação de Senha** — A troca de Operador para Admin aciona um modal exigindo o código de acesso (`nexus2026`). Tentativas incorretas exibem um erro vermelho e registram uma entrada de acesso negado na trilha de auditoria. Tentativas bem-sucedidas registram uma entrada de acesso concedido e trocam o papel.
- **Banner de Operador** — Um banner âmbar persistente no topo da tela quando o modo Operador está ativo, comunicando claramente o status de somente leitura.

### Suporte Bilíngue (i18n)

Localização completa em Inglês e Português (PT-BR):

- Um seletor de idioma no cabeçalho alterna entre EN e PT-BR instantaneamente.
- Cada string da UI — navegação, cabeçalhos, KPIs, colunas de tabelas, rótulos de gráficos, mensagens da zona de descarga, cabeçalhos de logs de auditoria, rótulos de configurações, descrições de toggles, funcionalidades de planos de faturamento, texto de notificações, texto do modal de admin e conteúdo do relatório Luna AI — é totalmente traduzido.
- Trocas de idioma são registradas na trilha de auditoria.

### Sistema de Temas

- Um toggle de modo dark/light no cabeçalho alterna toda a paleta de cores instantaneamente via variáveis CSS.
- Trocas de tema são registradas na trilha de auditoria.
- Ambos os temas mantêm taxas de contraste completas e legibilidade em todos os componentes.

### Dropdown de Notificações

- O ícone de sino no cabeçalho abre um popover flutuante premium.
- Exibe as 3 atividades mais recentes do sistema obtidas ao vivo do array de Logs de Auditoria.
- Cada notificação inclui um ícone colorido por severidade, descrição da ação, componente e timestamp.
- Inclui um botão "Marcar todas como lidas".

### Rodapé Global

Um rodapé minimalista e elegante visível em todas as views: "Desenvolvido por Aliana Moraes" — estilizado com tipografia muted que se adapta a ambos os modos dark e light.

---

## Guia de Instalação e Execução Local

### Pré-requisitos

- Node.js 18+ (recomendado: 20 LTS)
- npm 9+ (incluído com Node 18+)

### Instalação

```bash
# 1. Clonar o repositório
git clone <url-do-repositorio>
cd nexusgeo-enterprise

# 2. Instalar dependências
npm install

# 3. Iniciar o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Scripts Disponíveis

| Comando              | Descrição                                        |
|----------------------|--------------------------------------------------|
| `npm run dev`        | Inicia o servidor de desenvolvimento Vite com HMR |
| `npm run build`      | Compila com tsc e gera o bundle de produção em `dist/` |
| `npm run preview`    | Pré-visualiza o build de produção localmente      |
| `npm run typecheck`  | Executa verificação de tipos TypeScript (sem output) |
| `npm run lint`       | Executa ESLint across o projeto                   |

### Acesso de Administrador

O código de acesso admin padrão é `nexus2026`. Troque para o modo Admin clicando no botão "Admin" no alternador de papéis do cabeçalho e digitando o código no modal.

---

## Limitações Conhecidas e Possíveis Bugs sob Estresse

### 1. Volatilidade do Estado em Memória Local (Sem Persistência)

Todo o estado da aplicação — logs de auditoria, arquivos enviados, pontos no mapa, configurações de toggles, variáveis de faturamento — é armazenado no estado em memória do React Context. **Atualizar a página reinicia toda a aplicação para seu estado inicial de dados mock.** Não há camada de persistência em localStorage ou conexão com banco de dados. Esta é uma escolha arquitetural deliberada para a fase de protótipo de front-end; a camada de gestão de estado está estruturada para aceitar uma integração com backend Supabase com refatoração mínima (ver [Roadmap](#roadmap-e-escalabilidade-futura)).

**Impacto sob carga:** Abas concorrentes do navegador não compartilham estado. Acúmulos grandes de logs de auditoria (1.000+ registros) são mantidos inteiramente em memória e podem aumentar o tempo de renderização inicial da view de Logs de Auditoria.

### 2. Limitações de Processamento de PDF no Lado do Cliente

O pipeline de ingestão do CRM processa metadados de arquivos no lado do cliente. Para datasets massivos de PDF (50+ arquivos ou arquivos excedendo 100MB), a thread principal do navegador pode apresentar latência perceptível durante a fase de parsing simulada. A arquitetura atual não transfere o processamento de arquivos para um Web Worker ou endpoint server-side.

**Impacto sob carga:** Enviar 20+ arquivos simultaneamente aciona uma cadeia sequencial de setTimeout para cada arquivo, o que pode criar um backlog de renders deferidos. PDFs grandes são armazenados apenas como entradas de metadados — nenhum conteúdo binário é processado.

### 3. Atrasos no Parsing de GeoJSON Massivo em Hardware Móvel

Arquivos GeoJSON e KML com geometrias de polígono complexas (1.000+ vértices) são processados na thread principal. Em dispositivos móveis com recursos de CPU limitados, isso pode causar jank de UI ou falta de responsividade temporária durante a fase de parsing e injeção de coordenadas. A renderização é feita de forma procedural na thread principal sem offloading para uma thread secundária (Web Worker).

**Impacto sob carga:** O renderizador de mapa baseado em SVG redesenha todos os pontos a cada mudança de estado. Com 500+ pontos de amostragem injetados (alcançável através de ingestões repetidas de arquivos), dispositivos móveis podem apresentar desempenho de animação degradado e custos de reflow aumentados. Navegadores desktop lidam com este volume sem problemas.

### 4. Motor de Mapa Procedural (Sem Tile Server)

O Motor GIS utiliza um renderizador SVG procedural customizado — não uma biblioteca de mapeamento de produção. Ele não suporta projeção de coordenadas do mundo real, imagens baseadas em tiles, ou pan/zoom além do viewport predefinido. Os vértices do polígono são fixados em um limite de campo representativo.

### 5. Diagnósticos de IA Simulados

Os relatórios de diagnóstico do solo do Luna AI Copilot são gerados via lógica de template determinística, não chamadas reais de API LLM. O rótulo "via GPT-4o-mini" é uma representação de UI da arquitetura de produção pretendida.

---

## Roadmap e Escalabilidade Futura

### Fase 1: Camada de Dados Persistente (PostgreSQL via Supabase)

**Objetivo:** Substituir o estado volátil em memória do Context por um banco de dados de produção ativo.

- Migrar o log de auditoria, registro de arquivos, pontos no mapa e configurações para tabelas PostgreSQL gerenciadas via Supabase.
- Implementar políticas de Row-Level Security (RLS) impondo o RBAC existente de Admin/Operador em nível de banco de dados — Operadores recebem políticas apenas de SELECT; Admins recebem CRUD completo.
- Substituir o dispatch de `addAuditEntry` do Context por um insert Supabase, habilitando trilhas de auditoria persistentes que sobrevivem a atualizações de página.
- Habilitar subscrições Supabase Realtime para streaming ao vivo de logs de auditoria e atualizações colaborativas de pontos no mapa across sessões concorrentes.

### Fase 2: Autenticação OAuth2 Real

**Objetivo:** Substituir o mecanismo hardcoded de troca de papéis por provedores de identidade de nível de produção.

- Integrar Supabase Auth com provedores OAuth2 (Google, GitHub) para SSO empresarial.
- Substituir o modal de senha hardcoded `nexus2026` por gestão de sessão Supabase e claims de papel baseadas em JWT.
- Implementar atribuição de papel via banco de dados (tabela `user_profiles` com coluna `role`) em vez de estado no lado do cliente.
- Adicionar autenticação email/senha como fallback para ambientes sem acesso a provedores OAuth.
- Implementar persistência de sessão com cookies HTTP-only seguros e refresh automático de token.

### Fase 3: Motor de Mapeamento de Produção (Mapbox GL / WebGL)

**Objetivo:** Migrar o mapa SVG procedural para um motor de renderização WebGL compatível com padrões.

- Integrar Mapbox GL JS (ou uma alternativa open-source como MapLibre GL) para imagens de satélite baseadas em tiles, projeções de coordenadas do mundo real (WGS84) e renderização acelerada por hardware.
- Substituir os vértices de polígono fixados por limites de campo carregados de GeoJSON a partir do banco de dados.
- Implementar controles de pan, zoom e toggle de camadas (satélite, terreno, overlay de heatmap do solo).
- Transferir o parsing de GeoJSON para Web Workers para evitar bloqueio da thread principal em dispositivos móveis.
- Suportar 10.000+ pontos de amostragem com clustering de pontos WebGL e renderização de heatmap de densidade.

### Fase 4: Notificações Automatizadas e Distribuição de Relatórios

**Objetivo:** Adicionar automação server-driven de e-mail e relatórios PDF para eventos críticos do sistema.

- Implementar Supabase Edge Functions para monitorar a tabela de log de auditoria e disparar alertas de e-mail automatizados quando entradas de severidade crítica são criadas.
- Gerar relatórios PDF com branding (diagnósticos de solo, resumos mensais de receita, exports de log de auditoria) via um pipeline de renderização server-side.
- Adicionar uma função cron agendada (Supabase pg_cron) para distribuição automatizada de backup semanal por e-mail para administradores.
- Integrar um provedor de e-mail transacional (Resend, SendGrid ou AWS SES) para entrega de notificações baseada em templates.
- Implementar preferências de notificação em nível de usuário (e-mail, in-app, SMS) armazenadas no banco de dados.

### Fase 5: Arquitetura Multi-Tenant

**Objetivo:** Suportar múltiplas organizações com limites de dados isolados.

- Introduzir uma coluna `tenant_id` em todas as tabelas de dados com políticas RLS impondo isolamento de tenant.
- Adicionar uma interface de gestão de tenants em Configurações para usuários super-admin.
- Implementar rastreamento de faturamento por tenant com integração Stripe para gestão de assinaturas e faturamento automatizado.
- Adicionar rate limiting por tenant e gestão de chaves de API para integrações externas.

---

## Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados.

---

<div align="center">

**Desenvolvido por Aliana Moraes**

</div>
