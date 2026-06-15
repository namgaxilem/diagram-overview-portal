# Embed UI

## Repositories

- **Cloud 1:** `https://humana@dev.azure.com/humana/Digital%20Health%20and%20Analytics/_git/dhp-semantic-search-ui`
- **Cloud 3:** `https://humana@dev.azure.com/humana/Digital%20Health%20and%20Analytics/_git/cloud30-dige-nes-intelligent-search-nes-search-embed-ui`

## 1. Tech Stack

- Javascript/Typescript
- ReactJS
- Antd (mainly) and TailwindCSS/CSS for styling

## 2. Internal Flows

Provides the embeddable search/chat experience (the UI behind the Search Portal's **Try Your Bot** and **Try Your Search**). Two parts: rendered **routes** and injectable **scripts**.

Routes:

- `/search` — the search UI.
- `/chatbot` — the chatbot UI.

Scripts (the embeddable entry points):

- `/search.js` — inits and auto-creates the search widget (iframe) in the host page.
- `/chatbot.js` — inits and auto-creates the chatbot bubble (iframe) in the host page.

Host-page embed flow:

```
1. Host page adds: <script src="urlOfTheEmbedUIRepo/chatbot.js" token="embeddedScriptToken" />
2. Script reads the token and boots
3. Script auto-creates an iframe -> loads the /chatbot (or /search) route
4. Chatbot bubble appears in the bottom-right corner of the host page (e.g. https://facebook.com)
```

The Search Portal's _Try Your Bot_ / _Try Your Search_ pages embed these same scripts using each workspace's default embedded script.

## 3. How to run (Local Setup)

### Configure Artifactory auth (jfrog.humana.com)

The npm dependencies are hosted on Humana's Artifactory, so configure auth **once** before `npm install`:

1. Log in to https://jfrog.humana.com.
2. Top-right → your name → **Set Me Up**, pick the **npm** repository, and copy the generated token.
3. Create a `.npmrc` in the repo root (or your home directory) and paste the token. It should look like:

```ini
registry=https://jfrog.humana.com/artifactory/api/npm/<npm-virtual-repo>/
_auth=<paste the base64 token from Set Me Up>
always-auth=true
email=<your-id>@humana.com
```

### Run

```shell
git clone https://humana@dev.azure.com/humana/Digital%20Health%20and%20Analytics/_git/dhp-semantic-search-embed-ui
cd dhp-semantic-search-embed-ui
npm install
npm start
# App will run in http://localhost:4000
```

## 4. Common Failures

N/A

## 5. Troubleshooting Guide

N/A

## 6. Performance & Scaling

N/A

## 7. Known Issues / Limitations

- search-api repo must enable CORS for http://localhost:4000 to call if running in local.
- Tech debt
