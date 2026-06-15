# Crawl Portal

## Repositories

- **Cloud 1:** `https://humana@dev.azure.com/humana/Digital%20Health%20and%20Analytics/_git/dhp-semantic-search-admin-portal`
- **Cloud 3:** `https://humana@dev.azure.com/humana/Digital%20Health%20and%20Analytics/_git/cloud30-dige-nes-intelligent-search-nes-search-crawl-ui`

## 1. Tech Stack

- Javascript/Typescript
- ReactJS
- Antd (mainly) and TailwindCSS/CSS for styling

## 2. Internal Flows

Admin UI to configure crawls and monitor their progress. Also embedded inside the Search Portal (Data Collectors → Crawler) via iframe. Main screens:

- **Crawler config** — set up crawler configuration.
- **Crawl histories** — list of crawl runs.
- **Crawl history items** — per-item detail within a crawl run (status: PENDING / CRAWLING / SUCCESS / FAILED / TIMEOUT).
- **Crawl workers** — monitor the crawl workers.

Trigger/monitor flow:

```
1. Configure the crawler
2. Trigger a crawl run (controller pushes items to Redis/Kafka)
3. Watch Crawl histories -> drill into Crawl history items for per-item state
4. Monitor Crawl workers
```

See the **Crawler** KT doc for the backend crawling flow and item state machine.

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
git clone https://humana@dev.azure.com/humana/Digital%20Health%20and%20Analytics/_git/dhp-semantic-search-admin-portal
cd dhp-semantic-search-crawl-portal
npm install
npm start
# App will run in http://localhost:7000
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
