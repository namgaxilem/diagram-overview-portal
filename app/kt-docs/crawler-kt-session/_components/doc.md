# Knowledge Transfer — Semantic Search Crawler

**Audience:** the team taking over the crawler
**Duration:** ~15 minutes
**Format:** speaker script. Text in normal type is what I say out loud. Lines in `[brackets]` are cues — what to show on screen.

---

## 0. Opening (≈1.5 min)

[Show the repo tree in VS Code]

"Hi everyone. This is the handover for the **semantic search crawler**. In one sentence: this service takes a URL, opens it like a real browser, pulls the readable content out of the page, and stores that content so it can be indexed for search.

The work arrives as messages on **Kafka** — each message is one 'item' to crawl. The service picks the message up, runs a crawler for that one URL, and writes the result out. That's the whole loop.

There are two libraries that do the heavy lifting, and almost everything in this codebase is built around them: **Scrapy** and **Playwright**. So I'll start from `requirements.txt`, explain what those two do and how they fit together, then show you the one big gotcha — you can't run it on Windows — and finally what the output looks like when a crawl finishes."

---

## 1. requirements.txt — the two packages that matter (≈2 min)

[Open `requirements.txt`]

"If you open `requirements.txt`, there's a list of pins, but really only two of them define this project:

- **`scrapy`** — the crawling *framework*. It manages the whole crawl lifecycle: the request queue, retries, concurrency, the spider, and the output pipeline.
- **`playwright`** — a *browser automation* library. It drives a real Chromium browser so we can load pages that need JavaScript and, when needed, log in.

The rest of the file supports those two:

- **`Twisted`** is Scrapy's async engine — Scrapy is built on it, so the version is pinned to stay compatible.
- **`pymupdf`** (imported as `fitz`) — some of the URLs we crawl are PDFs, not HTML. PyMuPDF extracts text from those.
- **`confluent-kafka`** — reads the item messages from Kafka.
- **`redis`**, **`azure-storage-blob`** — supporting services: Redis for state/dedup, Azure Blob for storing crawled output in the cloud.
- **`itemadapter`**, **`service-identity`**, **`psutil`** — small helpers (item handling, TLS, process checks for the health check).
- Everything after that — `flake8*`, `pytest*`, `mypy`, `coverage` — is just lint and test tooling, not runtime.

So when you read this codebase, keep two boxes in your head: **Scrapy = the crawl machinery, Playwright = the browser.** Let me show how they connect."

---

## 2. How Scrapy works in this project (≈3.5 min)

[Show `search_crawler_main/__main__.py`, then `run_spider/__main__.py`, then `spiders/base_spider.py`]

"There are three layers. Follow the path of one item through them.

**Layer 1 — the orchestrator.** `search_crawler_main/__main__.py`. This is the long-running process in the pod. It:
1. waits for the Istio sidecar to be ready,
2. starts a small health-check process,
3. opens a **Kafka consumer**, and
4. runs a **multiprocessing Pool**.

In a loop it pulls a message off Kafka, reads the item info (the URL and its config), and hands it to the pool. Each item is run in its **own subprocess** — that's the `run_spider` call. Why a separate process per item? Isolation. A browser can hang or leak memory; if one crawl dies, it doesn't take the whole service down. When the subprocess finishes, the orchestrator commits the Kafka offset.

**Layer 2 — one crawl run.** `run_spider/__main__.py`. This is what runs inside each subprocess. It takes the item JSON, validates the URL, works out the domain, and then starts Scrapy:

[Point at `CrawlerProcess(get_project_settings())` and `process.crawl(...)`]

It creates a Scrapy `CrawlerProcess`, loads our settings, and calls `process.crawl(SPIDER_NAME, start_urls=..., item_info=...)`. That boots the Scrapy engine for this single URL and runs our spider. One important detail: the spider is selected **by name** from `main_config.SPIDER_NAME`, and Scrapy finds it through `SPIDER_MODULES` in `settings.py`. If settings don't load, you get a 'Spider not found' error — remember that, it bites people.

**Layer 3 — the spider.** `spiders/base_spider.py`. This is where the actual crawling logic lives. It's a Scrapy `CrawlSpider`. The flow:
- `start()` yields the first `Request` for the start URL, with `playwright_parse` as the callback.
- Scrapy downloads the page and calls `playwright_parse(response)`.
- `playwright_parse` looks at the `Content-Type`: if it's a **PDF**, we extract text with PyMuPDF; if it's **HTML/text**, we hand off to Playwright (next section); anything else is skipped with a 415.
- At the end it `yield`s a dictionary — the **item** — with the extracted content and metadata.

Then Scrapy's **item pipeline** takes over. In production that's the **Azure upload pipeline** — it pushes the crawled content to Azure Blob storage. The child spiders — `centerwell_crawl`, `myh_crawl`, `nucleusstats_crawl` — are just subclasses of `BaseSpider` for specific sources; they reuse all of this.

So Scrapy gives us: the request/response engine, the spider abstraction, and the pipeline that ships the result. It does *not* render JavaScript — and that's exactly where Playwright comes in."

---

## 3. The role of Playwright (≈1.5 min)

[Show `spiders/utils/crawler_process.py` and the `_handle_text_content` part of `base_spider.py`]

"Scrapy on its own only fetches raw HTML. Many of our target pages are JavaScript-heavy — the content isn't in the initial HTML, it's rendered in the browser. Some pages also need a **login** before you can see anything. Scrapy can't do either. Playwright can.

One thing to be clear about: we use **Playwright standalone**, *not* the `scrapy-playwright` plugin. We drive the browser ourselves inside the spider. The wrapper is `utils/crawler_process.py` — note this is **our** class, not Scrapy's `CrawlerProcess`, same name unfortunately.

So the division of labour is: **Scrapy decides *what* to crawl and *where the result goes*; Playwright decides *how to actually load and read* an HTML page.** PDFs don't need a browser at all.

Now let me walk the **two production paths**, because that's the heart of this service."

---

## 4. How HTML and PDF content is produced (≈3 min)

[Show `base_spider.playwright_parse`, then `_handle_pdf_content` / `_handle_text_content`, then `crawler_process.py`]

"Every response lands in one method: `playwright_parse` in `base_spider.py`. The first thing it does is read the **Content-Type** and branch:

```python
if self._is_pdf_content(content_type, response):   # application/pdf, or octet-stream that sniffs as PDF
    await self._handle_pdf_content(response)
elif "text" in content_type:
    await self._handle_text_content(...)
else:
    skip with status 415                            # unsupported type
```

**PDF path — no browser.** `_handle_pdf_content` → `crawler_process.extract_page_pdf_context(response)`:
- Scrapy already downloaded the bytes, so we wrap `response.body` in a `BytesIO` and open it with **PyMuPDF** (`pymupdf.open`).
- We pull the **title** from the PDF metadata (or fall back to the last path segment of the URL).
- It returns a dict: `{ url, title, pdf_content }` — `pdf_content` being the raw PDF bytes.
- Back in the handler we compute a **SHA-512** hash of those bytes.

**HTML path — Playwright renders.** `_handle_text_content`:
- launch Chromium, open a context/page,
- if the item has `auth`, **log in** (`crawler_process.login` — fill the form, submit), otherwise just `goto` the URL and wait for load,
- then the spider's `custom_text_parse` runs (see `main_crawl.py`): it calls `crawler_process.urls_extractor(page)` to collect same-domain links into `subUrl`, and `crawler_process.extract_page_context(page)` to pull the rendered text into `page_context`,
- then SHA-512 over the extracted content.

**Both paths share the dedup step.** Before we accept the content we ask **Redis**: 'have we already stored this exact hash for this crawl history?' — `redis_service.get_existed_item_id_with_content_hash`. If yes, we **skip with 409** (duplicate, nothing new). If no, we `cache_content_hash` and mark the crawl successful.

So: **PDF → bytes → PyMuPDF → hash; HTML → browser render → text + links → hash. Then Redis dedup. Then yield the item.**"

---

## 5. The big gotcha — you can't run it on Windows (≈2.5 min)

[Show the `NotImplementedError` traceback if you have it; otherwise the diagram]

"This is the most important practical thing to remember, and it will waste your day if you don't know it.

**You cannot run this end-to-end on a Windows machine.** Here's why, briefly:
- Scrapy runs on an asyncio event loop. On Windows, that loop is a `SelectorEventLoop`.
- A `SelectorEventLoop` on Windows **cannot start a subprocess**.
- Playwright **needs** a subprocess — its browser driver runs as a separate process.
- So the moment the spider tries to launch the browser, you get `NotImplementedError`.

On **Linux this problem doesn't exist** — the Linux event loop supports subprocesses. And our pods are Linux. So the code is correct; it just can't run on a Windows laptop as-is.

**How we test, then:** we copy the code into a running **Kubernetes pod** and run it there. The workflow:

[Show terminal]

```bash
# 1. find a running crawler pod
kubectl get pods -n <namespace>

# 2. copy your local code into the pod
kubectl cp ./src <namespace>/<pod-name>:/app/src

# 3. shell into the pod
kubectl exec -it <pod-name> -n <namespace> -- bash

# 4. run a single crawl inside the pod (Linux -> Playwright works)
cd /app
PYTHONPATH=src python -u -m run_spider '<item-json>'
```

So your dev loop is: edit on Windows → `kubectl cp` into the pod → run inside the pod → read the logs. Annoying, but reliable.

[Optional — mention if the team will dev on Windows often]
There *is* a code-level fix if you want local Windows runs: run Playwright on its own thread with a `ProactorEventLoop` instead of Scrapy's loop. It's a no-op on Linux, so it's safe. I've left notes on it in the repo, but for day-to-day, testing in the pod is what the team has been doing."

---

## 6. What you get when a crawl finishes (≈2 min)

[Show a sample output item / the Azure container / the logs]

"When a crawl succeeds, the spider `yield`s one **item** — a dictionary with three keys:
- **`context`** — the produced content. For HTML it's `{ url, title, content }`; for PDF it's `{ url, title, pdf_content }` (the raw bytes). This is the payload that gets indexed for search.
- **`info`** — the item metadata: `id`, the final `action`/`state` (`crawled` / `re_crawled` / `skipped` / `crawl_failed`), `statusCode`, the **`sha512Hash`**, the discovered **`subUrl`** list, and `filePath` once stored.
- **`extractedMetaTagsInfo`** — configured meta tags, merged into the JSON output.

Then the **pipeline** persists it, and here's the key split that mirrors the two production paths:
- if `context` has **`pdf_content`** → write a **`.pdf`** blob,
- otherwise → serialize `context` to JSON (merging the meta tags) and write a **`.json`** blob.

The path is laid out by date and host: `yyyy/mm/dd/<host>/<timestamp>.<ext>`. In **production** that blob goes to **Azure Blob Storage** (`azure_upload_pipeline.py` → `azure_service.upload_blob`), the item's **state is reported back** through `crawler_service`, and the Kafka offset is committed. *(In the trimmed local build it's written under `OUTPUT_DIR` instead, and state is logged.)*

Status codes tell the story: **200** crawled · **409** duplicate content (Redis dedup, skipped) · **415** unsupported type (skipped) · **401** login failed · **400/500** failed.

So end to end: **Kafka message in → PDF bytes or browser-rendered HTML → hash → Redis dedup → stored as .pdf/.json → state reported → offset committed.**"

---

## 7. Wrap-up (≈0.5 min)

"To recap the five things to hold onto:
1. **Scrapy is the crawl engine; Playwright is the browser** — Playwright standalone, not the plugin.
2. One item = one Kafka message = one subprocess = one Scrapy run.
3. **Two production paths:** PDF → PyMuPDF on the bytes; HTML → Playwright render → text + links. Both hash + Redis-dedup.
4. **Can't run on Windows** — copy to a pod and run there.
5. Output = `.pdf` or `.json` blob (date/host path) to Azure, state reported, Kafka committed.

Where to look first when something breaks: `search_crawler_main/__main__.py` for the Kafka loop, `base_spider.py` for the branch + handlers, `crawler_process.py` for the actual PDF/HTML extraction, and `settings.py` if the spider 'isn't found'.

I'll leave this doc and the README in the repo. Happy to take questions."

---

### Appendix — quick reference

| Concern | File |
|---|---|
| Kafka loop, multiprocessing, startup | `search_crawler_main/__main__.py` |
| One crawl run (Scrapy boot) | `run_spider/__main__.py` |
| Content-type branch + PDF/HTML handlers + dedup | `spiders/base_spider.py` |
| Default spider, `custom_text_parse` | `spiders/main_crawl.py` |
| PDF/HTML extraction (`extract_page_pdf_context`, `urls_extractor`, `extract_page_context`), launch/login | `spiders/utils/crawler_process.py` |
| Content-hash dedup | `services/redis_service.py` |
| Spider discovery / pipelines / reactor | `spiders/settings.py` |
| Output (blob: `.pdf` / `.json`) | `pipelines/azure_upload_pipeline.py` (prod) · `pipelines/local_storage_pipeline.py` (local) |
| State callbacks | `services/crawler_service.py` |
| Config (env vars, `DEFAULT_SPIDER_NAME`) | `configures/main_config.py` |

---

## Phụ lục (Tiếng Việt) — Vì sao Scrapy + Playwright không chạy được trên Windows?

### Tóm tắt 1 câu
Trên Windows, vòng lặp sự kiện (event loop) mà Scrapy bắt buộc dùng **không tạo được tiến trình con (subprocess)**, mà Playwright thì **bắt buộc cần một subprocess** để chạy — nên hai cái không thể chạy chung trên cùng một loop ở Windows.

### Giải thích chi tiết theo từng bước

1. **Scrapy chạy trên Twisted, và ta cấu hình dùng asyncio.**
   Trong `settings.py` có dòng:
   ```python
   TWISTED_REACTOR = "twisted.internet.asyncioreactor.AsyncioSelectorReactor"
   ```
   Dòng này bật chế độ cho phép spider dùng `async def` / `await` (cần để gọi Playwright). Nhưng cái tên đã nói rõ: nó là **AsyncioSelector**Reactor — tức là nó chạy trên một **`SelectorEventLoop`**.

2. **`SelectorEventLoop` trên Windows không hỗ trợ subprocess.**
   Đây là giới hạn của chính Python trên Windows (không phải lỗi của mình):
   - Windows có 2 loại event loop: `SelectorEventLoop` và `ProactorEventLoop`.
   - **Chỉ `ProactorEventLoop`** mới tạo được subprocess trên Windows.
   - `SelectorEventLoop` khi bị gọi tạo subprocess sẽ ném ra lỗi:
     ```
     File "...asyncio/base_events.py", line 523, in _make_subprocess_transport
         raise NotImplementedError
     NotImplementedError
     ```

3. **Playwright bắt buộc cần một subprocess.**
   Playwright (Python) không tự điều khiển trình duyệt. Nó khởi động một **tiến trình driver riêng** (Node.js) rồi giao tiếp qua tiến trình đó. Khi mình gọi:
   ```python
   await async_playwright().start()
   ```
   bên trong nó chạy `asyncio.create_subprocess_exec(...)` để bật driver.

4. **Kết quả: xung đột.**
   - Scrapy ép loop = `SelectorEventLoop`.
   - Playwright cần tạo subprocess trên loop đó.
   - `SelectorEventLoop` (Windows) không cho tạo subprocess → **`NotImplementedError`** ngay khi spider gọi `launch_browser()`.

   Mâu thuẫn nằm ở chỗ: muốn Playwright chạy được trên Windows thì phải dùng `ProactorEventLoop`, nhưng Twisted asyncio reactor lại **chỉ chạy được trên `SelectorEventLoop`**. Hai yêu cầu loại trừ nhau trên cùng một loop.

### Vì sao trên Linux (pod) lại chạy bình thường?
Trên **Linux/Unix**, `SelectorEventLoop` **có** hỗ trợ tạo subprocess (thông qua cơ chế "child watcher" của asyncio). Vì vậy Scrapy và Playwright dùng chung một loop hoàn toàn ổn. Container của mình chạy Linux, nên **production không gặp vấn đề này** — đây thuần tuý là vấn đề khi dev trên máy Windows.

### Cách xử lý
1. **Khuyến nghị: chạy trong môi trường Linux** — copy code vào pod K8s (`kubectl cp`) rồi chạy trong pod, hoặc dùng **WSL2 / Docker** trên máy. Khớp với production, không phải sửa code.
2. **Nếu muốn chạy trực tiếp trên Windows:** đẩy phần Playwright sang **một thread riêng có `ProactorEventLoop`** (tách khỏi loop của Scrapy). Vì là loop riêng nên không đụng tới `SelectorEventLoop` của Scrapy. Cách này là **no-op trên Linux** (chỉ kích hoạt khi `sys.platform == "win32"`) nên an toàn để commit. Lưu ý: bản code hiện tại đã **bỏ** cách này để giống hệt repo gốc — repo gốc vốn chỉ chạy trên Linux.

### Một câu để nhớ
> **Scrapy giữ loop kiểu Selector; Playwright cần subprocess; trên Windows loop Selector không tạo được subprocess → vỡ. Trên Linux thì được. Nên test trong pod.**

**Status codes:** 200 crawled · 409 duplicate (Redis dedup) · 415 unsupported type · 401 login failed · 400/500 failed.
