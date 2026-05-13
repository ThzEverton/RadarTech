# Radar de Vagas Tech

Aplicativo mobile feito com React Native e Expo para centralizar vagas brasileiras de tecnologia da API BR Vagas, ranquear oportunidades por match com o perfil do usuario e salvar favoritos localmente.

## Projeto

- Disciplina: Desenvolvimento Mobile
- Integrantes: Everton Thomaz e Jhennifer Lincoln
- Professor: Dione Ferrari

## Funcionalidades

- Cadastro de perfil com nome, e-mail, nivel profissional e tipo de trabalho preferido.
- Avaliacao de interesse por stack tecnologica com estrelas.
- Home com vagas recomendadas e ordenadas por percentual de match.
- Busca manual por stack, nivel e tipo de trabalho.
- Tela de detalhe com informacoes da vaga e botao de candidatura.
- Favoritos persistidos com AsyncStorage.
- Notificacao local quando uma vaga com match acima de 80% e encontrada.

## Tecnologias

- Expo SDK 51
- React Native 0.74
- React Navigation 6
- Axios
- AsyncStorage
- Expo Notifications
- React Native Paper

## Como Rodar

```bash
npm install
npx expo start
```

No Windows, caso o PowerShell bloqueie `npm.ps1`, use:

```bash
npm.cmd install
npx.cmd expo start
```

## Estrutura

```text
App.js
app.json
babel.config.js
package.json
src/
  components/
    ChipSelector.js
    StarRating.js
    VagaCard.js
  hooks/
    useMatch.js
  navigation/
    index.js
  screens/
    BuscaScreen.js
    CadastroInteressesScreen.js
    CadastroPerfilScreen.js
    DetalheVagaScreen.js
    FavoritosScreen.js
    HomeScreen.js
  services/
    notificacoes.js
    vagasApi.js
    storage.js
  theme/
    index.js
```
