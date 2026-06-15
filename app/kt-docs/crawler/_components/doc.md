# Crawler

## Repositories

- **Cloud 1:** `https://humana@dev.azure.com/humana/Digital%20Health%20and%20Analytics/_git/dhp-semantic-search-crawler`
- **Cloud 3:** `https://humana@dev.azure.com/humana/Digital%20Health%20and%20Analytics/_git/cloud30-dige-nes-intelligent-search-nes-search-crawler`

## 1. Tech Stack

- Python
- Scrapy + Playwright (crawling logic)
- Kafka + Redis (listen for / fetch info of items to crawl)

## 2. Internal Flows

Event-driven. The Crawl Portal triggers runs; the controller dispatches items; the crawler consumes and reports back.

```
1. User triggers a run from the Crawl UI
2. Controller takes action and pushes items to Redis / Kafka
3. Crawler listens to Kafka for item info, then starts crawling (Scrapy + Playwright)
4. On finish/failed, crawler pushes a message to the controller
5. Controller updates the crawl item state -> SUCCESS or FAILED
6. If an item is stuck in PENDING or CRAWLING for too long (~1 hour),
   the controller marks it as TIMEOUT
```

## 3. How to run (Local Setup)

```shell
git clone https://humana@dev.azure.com/humana/Digital%20Health%20and%20Analytics/_git/dhp-semantic-search-crawler
cd dhp-semantic-search-crawler
# Artifactory authentication setup...
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
playwright install
python main.py
# Requires Kafka + Redis reachable (item dispatch + listening)
```

> **Windows cannot run Scrapy + Playwright — Linux only.** To test, copy the code into the remote crawler pod, then `kubectl exec` into the pod and run the file there:

```shell
# Copy local code into the running crawler pod
kubectl cp ./src <namespace>/<crawler-pod>:/app/src

# Exec into the pod and run
kubectl exec -it <crawler-pod> -n <namespace> -- /bin/bash
python main.py
```

## 4. Common Failures

N/A

## 5. Troubleshooting Guide

N/A

## 6. Performance & Scaling

N/A

## 7. Known Issues / Limitations

- **Stuck items → TIMEOUT.** If a crawl item stays in PENDING or CRAWLING for ~1 hour, the controller marks it as TIMEOUT (indicates a crawl that never reported back).
- Edge cases
- Tech debt
