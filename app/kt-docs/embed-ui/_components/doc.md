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

## 8. End-to-End Flow & Configuration Guide

### 8.1 Big Picture

Three pieces work together:

| Piece                             | Role                                                                                                                                                             |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Search Portal** (admin console) | Manages **Embeddable Scripts** (menu: _Embeddable Script_). Each script's configuration is stored in the database.                                                |
| **Embed UI** (this repo)          | Hosts the loader scripts (`/search.js`, `/chatbot.js`) and the iframe routes (`/search`, `/chatbot`) that render the actual search/chat experience.               |
| **Host page** (consumer website)  | Any site that pastes the generated `<script>` tag. The script injects an iframe pointing back to Embed UI.                                                        |

```
Search Portal (create/update script + config)  ──stores──>  Database
        │
        │ generates <script> snippet (with token)
        ▼
Host page  ──loads──>  Embed UI /search.js or /chatbot.js
        │
        │ script reads token + attributes, creates iframe
        ▼
Embed UI /search?token=... or /chatbot?token=...
        │
        │ fetches script config by token, merges with attributes
        ▼
Search / Chatbot UI rendered inside iframe
```

### 8.2 Script Lifecycle (managed in Search Portal)

1. **Create / update script** — In Search Portal → **Embeddable Script**, each script is tied to a **search index** and holds config such as:
   - **Host names** (allow-list; semicolon-separated, e.g. `my-site.humana.com;localhost`) — only these hosts may embed the script.
   - **Description**, **Search input id** (attach search to an existing input on the host page).
   - **Search mode**: Hybrid / Vector / Text search, plus score thresholds (e.g. Hybrid Search score).
   - **Feature toggles**: AutoComplete, Suggest, Reranker, Summary, Dev mode, Filter, Fuzzy search.
   - **Default filter** and **Facets**.
   - **Chat info**: Custom Instructions on/off, floating mode/layout selection.
2. **Save** — Config persists to the database, keyed by the script's **token** (Script Id).
3. **Copy snippet** — The script detail view shows the ready-to-paste tags:

```html
<script src="https://<embed-ui-host>/search.js" inputId="..." token="<scriptId>"></script>
<script src="https://<embed-ui-host>/chatbot.js" token="<scriptId>"></script>
```

The `token` attribute is **required** — it is how Embed UI finds the script's config in the database.

### 8.3 What Happens at Runtime (Embed UI)

1. Host page loads `/search.js` or `/chatbot.js` from the Embed UI host.
2. The loader script reads its own `<script>` tag attributes (`token` + any override attributes).
3. It creates an **iframe** pointing to the Embed UI route:
   - Search: `https://<embed-ui-host>/search?token=<scriptId>&hostname=<hostPageOrigin>&...`
   - Chatbot: `https://<embed-ui-host>/chatbot?token=<scriptId>&...`
   - The `token` query param is **mandatory** — the route uses it to fetch the stored config.
4. The route validates the host page against the script's **Host names** allow-list, then renders the search box / chatbot bubble inside the iframe.

### 8.4 Configuration Precedence (3 layers)

Config is resolved in this order — first match wins:

1. **Script tag attributes** (highest) — attributes set directly on the embed `<script>` tag override everything, e.g. `<script src=".../search.js" token="..." inputId="my-input">`.
2. **Database config** — values saved for that token via Search Portal's Embeddable Script form.
3. **Embed UI defaults** (lowest) — hard-coded fallback values in this repo, used when neither of the above provides a value.

Practical guidance:

- Manage shared/long-lived settings in Search Portal (database) so all consumers pick them up without touching their pages.
- Use script-tag attributes only for per-page overrides (e.g. a specific `inputId` on one page).
- If a value looks wrong at runtime, check in this order: script tag attributes → Search Portal config → repo defaults.

### 8.5 How Consumers Use It

1. Ask the portal admin to create an embeddable script for the desired search index (or create it yourself in Search Portal → Embeddable Script).
2. Make sure your site's hostname is in the script's **Host names** allow-list (add `localhost` for local testing).
3. Copy the generated `<script>` tag(s) from the script detail view into your page's HTML.
4. (Optional) Add attributes on the tag to override defaults for that page.
5. Verify: the search widget attaches (or the chatbot bubble appears bottom-right) and the iframe URL contains your `token`.

The Search Portal's own **Try Your Search** / **Try Your Bot** pages consume the exact same scripts using each workspace's default embedded script — useful for validating config changes before rolling out to real host pages.
