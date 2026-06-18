# AppRecife — Frontend (React Native / Expo)

Aplicativo mobile que consulta o **estoque de medicamentos nas farmácias da
rede municipal de saúde do Recife** (API de Dados Abertos), exibe os dados em
telas com navegação, usa a **localização do usuário** (GPS) e salva registros
em um **backend** próprio.

Faz parte do projeto **AppRecife**, composto por dois repositórios:

| Repositório | Descrição |
|-------------|-----------|
| **AppRecife-frontend** (este) | Aplicativo mobile em React Native (Expo) |
| [AppRecife-backend](https://github.com/israelsz7/AppRecife-backend) | API em Node.js + Express |

---

## 🎯 Por que esta API do Dados Recife?

Conjunto escolhido:
[**Estoque dos medicamentos nas farmácias da rede municipal de saúde**](https://dados.recife.pe.gov.br/dataset/estoque-dos-medicamentos-nas-farmacias-da-rede-municipal-de-saude).

**Justificativa:** é um dado de **utilidade pública direta para o cidadão**. Com
ele, qualquer pessoa pode descobrir **em qual unidade de saúde** há um
medicamento disponível e **quanto** há em estoque, antes de se deslocar. Isso se
encaixa perfeitamente em um aplicativo mobile com localização: o usuário consulta
o remédio, vê o estoque e registra onde estava quando o encontrou. Os dados são
**atualizados diariamente** e organizados pelos **8 Distritos Sanitários** da
cidade.

---

## ✨ Funcionalidades

- 📋 **Lista de Distritos Sanitários** (tela inicial).
- 🔎 **Busca de medicamentos** por nome ou unidade, com **paginação** (carrega
  mais ao rolar).
- 💊 **Tela de detalhe** do medicamento (unidade, classe, apresentação, estoque).
- 📍 **Localização do usuário** via GPS (`expo-location`), com opção de abrir no
  mapa.
- 💾 **Salvar registro**: associa a localização atual ao medicamento e envia ao
  backend (POST).
- 🗂️ **Tela de registros**: lista o que foi salvo no backend (GET), com "puxar
  para atualizar" e excluir.
- 🎨 Visual **claro e moderno**, com tema em tons de teal.

---

## 🧰 Tecnologias

- **Expo** (React Native) — SDK 54 (compatível com o app **Expo Go** da loja)
- **React Navigation** — abas inferiores + navegação em pilha
- **expo-location** — geolocalização do dispositivo
- **expo-constants** — usado para descobrir o IP do backend automaticamente
- **@expo/vector-icons** (Ionicons) — ícones

---

## 📂 Estrutura do projeto

```
AppRecife-frontend/
├── App.js                       # componente raiz (SafeAreaProvider + navegação)
├── app.json                     # configuração do Expo (nome, permissões, ícones)
├── src/
│   ├── config.js                # resolve a URL do backend (IP automático)
│   ├── theme/                   # cores, espaçamentos, sombras (design system)
│   ├── navigation/
│   │   └── AppNavigator.js       # abas + pilha de telas
│   ├── services/
│   │   ├── dadosRecifeApi.js     # integração com a API do Recife (CKAN)
│   │   ├── backendApi.js         # integração com o nosso backend
│   │   └── locationService.js    # leitura do GPS (expo-location)
│   ├── components/              # componentes reutilizáveis (cards, botão, selos...)
│   ├── screens/                 # telas do app
│   └── utils/
│       └── formatadores.js       # formatação de números/datas e status de estoque
└── assets/                      # ícones e splash
```

---

## ▶️ Como rodar localmente

Pré-requisitos:

- **Node.js 18+**
- App **Expo Go** instalado no celular (Android/iOS) **ou** um emulador.
- O **backend** rodando (veja o repositório
  [AppRecife-backend](https://github.com/SEU-USUARIO/AppRecife-backend)).

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o Expo
npm start
```

Em seguida:

- **Celular físico:** abra o app **Expo Go** e escaneie o QR Code mostrado no
  terminal. Garanta que o **celular e o PC estejam na mesma rede Wi‑Fi**.
- **Emulador Android:** pressione `a` no terminal.
- **iOS (Mac):** pressione `i`.

> 💡 **Backend e localização:** para que o botão "Salvar com minha localização"
> funcione, o backend precisa estar rodando no PC. O app descobre o IP do PC
> **automaticamente** a partir do Expo (`src/config.js`), então normalmente não é
> preciso configurar nada — apenas estar na mesma rede Wi‑Fi.

### Precisa fixar o endereço do backend manualmente?

Adicione em `app.json`, dentro de `expo`:

```json
"extra": { "backendUrl": "http://192.168.0.10:3000" }
```

---

## 🔌 Como funciona a integração com a API do Recife

A API do Recife usa a plataforma **CKAN**. O app consulta o endpoint
`datastore_search`, informando o `resource_id` do distrito e (opcionalmente) um
termo de busca `q`:

```
https://dados.recife.pe.gov.br/api/3/action/datastore_search?resource_id=<UUID>&q=DIPIRONA&limit=40
```

Os campos retornados incluem: `unidade`, `produto`, `classe`, `apresentacao`,
`quantidade`, `distrito`. Toda essa lógica fica em
[`src/services/dadosRecifeApi.js`](src/services/dadosRecifeApi.js).

---

## 🗺️ Fluxo de telas

```
Medicamentos (aba)
   Distritos  →  Medicamentos (busca)  →  Detalhe  →  [Salvar com localização → POST]
Localização (aba)
   GPS do aparelho → coordenadas → ver no mapa
Registros (aba)
   GET no backend → lista o que foi salvo
```

---

## 📄 Licença

[MIT](LICENSE).
