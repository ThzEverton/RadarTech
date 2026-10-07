# RadarTech — Radar de Vagas Tech

Aplicativo mobile desenvolvido com **React Native + Expo** para centralizar vagas brasileiras de tecnologia e priorizar oportunidades de acordo com o perfil e os interesses do usuário.

## Principais funcionalidades

- Cadastro de perfil profissional.
- Preferências de stack por nível de interesse.
- Ranking de vagas por percentual de match.
- Busca por stack, nível e modalidade de trabalho.
- Tela de detalhes com acesso à candidatura.
- Favoritos persistidos com AsyncStorage.
- Notificação local para oportunidades com match acima de 80%.

## Como o match funciona

O app combina as preferências cadastradas pelo usuário com os dados das vagas e utiliza esse resultado para ordenar as oportunidades mais relevantes.

## Stack

- Expo SDK 51
- React Native 0.74
- React Navigation
- Axios
- AsyncStorage
- Expo Notifications
- React Native Paper

## Estrutura

```text
src/
├── components/
├── hooks/
├── navigation/
├── screens/
├── services/
└── theme/
```

A separação entre telas, serviços, navegação e hooks mantém a interface desacoplada da lógica de integração e do cálculo de compatibilidade.

## Executando

```bash
npm install
npx expo start
```

## Contexto acadêmico

- Disciplina: Desenvolvimento Mobile
- Integrantes: Everton Thomaz e Jhennifer Lincoln
- Professor: Dione Ferrari
