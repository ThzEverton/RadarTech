# 📡 Radar de Vagas Tech

Aplicativo mobile desenvolvido em **React Native com Expo** para centralizar e filtrar vagas de emprego na área de tecnologia em tempo real.

**Disciplina:** Desenvolvimento Mobile  
**Integrantes:** Everton Thomaz e Jhennifer Lincoln  
**Professor:** Dione Ferrari

---

## 🗂 Estrutura do Projeto

```
RadarVagasTech/
├── App.js                          # Ponto de entrada
├── app.json                        # Configuração do Expo
├── package.json                    # Dependências
├── babel.config.js
└── src/
    ├── theme/
    │   └── index.js                # Cores, espaçamento, tipografia
    ├── services/
    │   ├── remotiveApi.js          # Integração com API Remotive (Axios)
    │   ├── storage.js              # AsyncStorage (perfil e favoritos)
    │   └── notificacoes.js         # Expo Notifications
    ├── hooks/
    │   └── useMatch.js             # Algoritmo de cálculo de match
    ├── components/
    │   ├── VagaCard.js             # Card reutilizável de vaga
    │   ├── ChipSelector.js         # Chips de seleção (single/multi)
    │   └── StarRating.js           # Avaliação por estrelas
    ├── screens/
    │   ├── CadastroPerfilScreen.js     # Tela 1a - Cadastro
    │   ├── CadastroInteressesScreen.js # Tela 1b - Interesses
    │   ├── HomeScreen.js               # Tela 2 - Recomendadas
    │   ├── BuscaScreen.js              # Tela 3 - Busca Manual
    │   ├── DetalheVagaScreen.js        # Tela 5 - Detalhe da Vaga
    │   └── FavoritosScreen.js          # Tela 6 - Favoritos
    └── navigation/
        └── index.js                # Stack + Tab Navigator
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+ instalado
- Expo CLI instalado globalmente:
  ```bash
  npm install -g expo-cli
  ```
- App **Expo Go** instalado no celular (iOS ou Android)

### Instalação

```bash
# 1. Entre na pasta do projeto
cd RadarVagasTech

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npx expo start
```

### Executando

- **No celular:** Escaneie o QR Code com o app Expo Go
- **No Android Emulator:** Pressione `a` no terminal
- **No iOS Simulator:** Pressione `i` no terminal

---

## 📱 Telas do Aplicativo

| Tela | Arquivo | Descrição |
|------|---------|-----------|
| 1a - Cadastro de Perfil | `CadastroPerfilScreen.js` | Nome, e-mail, nível e tipo de trabalho |
| 1b - Níveis de Interesse | `CadastroInteressesScreen.js` | Avaliação de stacks com estrelas (1-5) |
| 2 - Home / Recomendadas | `HomeScreen.js` | Vagas ranqueadas por match com o perfil |
| 3 - Busca Manual | `BuscaScreen.js` | Filtros por stack, nível e tipo |
| 5 - Detalhe da Vaga | `DetalheVagaScreen.js` | Informações completas + botão candidatar |
| 6 - Favoritos | `FavoritosScreen.js` | Vagas salvas com AsyncStorage |

---

## ⚙️ Tecnologias e Bibliotecas

| Tecnologia | Finalidade |
|------------|------------|
| React Native (Expo) | Base do aplicativo mobile |
| React Navigation (Stack + Tab) | Navegação entre telas |
| Axios | Requisições à API Remotive |
| AsyncStorage | Persistência do perfil e favoritos |
| Expo Notifications | Notificações nativas de match |
| React Native Paper | Componentes de UI e design responsivo |

---

## 🧮 Algoritmo de Match

O percentual de match é calculado com base em 3 critérios:

| Critério | Peso | Lógica |
|----------|------|--------|
| Stack tecnológica | 50 pts | Ponderado pelo nível de interesse (1-5 estrelas) |
| Nível profissional | 30 pts | Correspondência com título/descrição da vaga |
| Tipo de trabalho | 20 pts | Remoto/Presencial |

- **≥ 80%** → Badge verde "Ótimo match" + **notificação nativa**
- **55% – 79%** → Badge amarelo "Match médio"
- **< 55%** → Badge cinza "Match baixo"

---

## 🔔 Notificações

As notificações são disparadas automaticamente quando uma vaga com match **≥ 80%** é encontrada ao carregar a tela Home. O sistema usa `expo-notifications` com permissão solicitada durante o onboarding.

> **Atenção:** Notificações só funcionam em dispositivos físicos, não em emuladores.

---

## 🌐 API Remotive

- **Endpoint:** `https://remotive.com/api/remote-jobs`
- **Documentação:** https://remotive.com/api
- **Tipo:** Pública, sem autenticação necessária

---

## 💾 Persistência (AsyncStorage)

Dois tipos de dados são persistidos localmente:

- **Perfil do usuário** (`@radar_vagas:perfil`) — nome, e-mail, nível, tipo e interesses por stack
- **Vagas favoritas** (`@radar_vagas:favoritos`) — lista de vagas salvas com seu percentual de match
