# Search Portal

## Repositories

- **Cloud 1:** `https://humana@dev.azure.com/humana/Digital%20Health%20and%20Analytics/_git/dhp-semantic-search-portal`
- **Cloud 3:** `https://humana@dev.azure.com/humana/Digital%20Health%20and%20Analytics/_git/cloud30-dige-nes-intelligent-search-nes-search-portal`

## 1. Tech Stack

- Javascript/Typescript
- ReactJS
- Antd (mainly) and TailwindCSS/CSS for styling

## 2. Internal Flows

Main entry point for end users. The whole app is driven by the **left menu**:

- **Onboarding** — create a new workspace, a new Azure Search index, and a new Kafka topic.
- **Workspaces**
  - **Manage Workspaces** — manage the indexes here.
  - **Audit Search** — user audits the search results.
  - **Audit Logs** — BE system logging: which method was triggered, who triggered it, and the log output.
  - **Replication Events** — replication event tracking.
- **Data Collectors**
  - **Crawler** — embeds the Crawl Portal (crawl-ui) URL in an iframe.
  - **File Upload** — upload files for processing and ingest into the index.
  - **Manage Streaming** — manage the Kafka consumer groups.
- **Search API** — renders the Swagger of the `search-api` repo (used to search/chat with indexed data).
- **Analyzer** — loads a Power BI report page to show custom report data.
- **Embeddable Script** — create an embeddable script, e.g. `<script src="urlOfTheEmbedUIRepo" token="embeddedScriptToken" />`.
- **Try Your Bot** — loads the Embed UI `/chatbot.js` in an iframe.
- **Try Your Search** — loads the Embed UI `/search.js` in an iframe.

Each workspace has its own **default embedded script**. _Try Your Bot_ and _Try Your Search_ only load the default created script for the selected workspace.

Embeddable / try-it flow:

```
1. Onboarding creates a workspace (+ Azure Search index + Kafka topic)
2. Embeddable Script page generates <script ... token="embeddedScriptToken">
3. Each workspace gets a default embedded script
4. Try Your Bot    -> loads Embed UI /chatbot.js (default script) in an iframe
5. Try Your Search -> loads Embed UI /search.js  (default script) in an iframe
```

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
git clone https://humana@dev.azure.com/humana/Digital%20Health%20and%20Analytics/_git/dhp-semantic-search-portal
cd dhp-semantic-search-portal
npm install
npm start
# App will run in http://localhost:5000
```

## 4. Common Failures

N/A

## 5. Troubleshooting Guide

N/A

## 6. Performance & Scaling

N/A

## 7. Known Issues / Limitations

- **Local BE controller required.** The UI cannot point directly at the BE dev server. Auth uses Spring Boot Security `JSESSIONID` with Azure AAD, and the BE currently has only **one** redirect URL, so the Spring Boot controller must be run locally at `http://localhost:8080`. _Future improvement:_ register an extra redirect URL so the local UI can connect to the BE dev server directly.
- Tech debt
