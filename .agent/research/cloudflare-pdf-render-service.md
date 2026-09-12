# Cloudflare Browser Rendering PDF Service (Puppeteer) + Vercel Blob Upload

Goal: A small external “render service” we control that:

1. loads a URL (your Vercel deployment page),
2. renders it to PDF using a real headless Chromium (Cloudflare Browser Rendering),
3. ensures webfonts are loaded (and optionally injects custom fonts),
4. generates a _tagged_ (accessible) PDF where supported,
5. uploads the bytes to Vercel Blob via a pre-signed upload URL,
6. returns metadata (blob URL, hash, timing).

This avoids trying to install Chrome/OS packages in Vercel. Vercel remains “app + storage”; Cloudflare does “browser rendering”.

---

## High-level architecture

Vercel (deploy pipeline or on-demand endpoint)
├─ creates a Vercel Blob _pre-signed upload URL_ for `pdfs/<buildId>.pdf`
└─ calls Cloudflare Worker: POST /build-pdf
payload: { sourceUrl, upload: { url, headers }, pdfOptions, securityToken }

Cloudflare Worker (Browser Rendering binding)
├─ launches Browser Rendering session (Puppeteer)
├─ navigates to sourceUrl (with signed token / allowlist guard)
├─ waits for fonts + readiness sentinel
├─ page.pdf({ tagged, printBackground, preferCSSPageSize, ... })
├─ PUT upload to Vercel Blob signed URL
└─ returns { ok, bytes, sha256, blobUrl, timingMs }

---

## Why this fits the requirements

- Fonts: use webfonts (WOFF2) hosted by you; ensure they’re loaded before PDF.
- Layout: Chrome-class rendering with print CSS (paged media rules respected).
- A11y: generate tagged PDF (Chromium/Puppeteer option), and validate in CI.
- Security: prevent SSRF by allowlisting domains + requiring signed tokens.

---

## Cloudflare setup

### 1) Create a Worker project

Using Wrangler / create-cloudflare:

- `npm create cloudflare@latest pdf-renderer-worker`
- Choose “Worker” and enable Node.js compatibility if prompted.

### 2) Install Cloudflare Puppeteer client

Cloudflare provides a Puppeteer client package designed to talk to Browser Rendering:

- `npm i @cloudflare/puppeteer`

### 3) Add Browser Rendering binding in `wrangler.toml`

Example:

```toml
name = "pdf-renderer"
main = "src/index.ts"
compatibility_date = "2026-02-06"
compatibility_flags = ["nodejs_compat"]

# Browser Rendering binding (name is your choice)
browser = { binding = "BROWSER" }

# Secrets (set via `wrangler secret put ...`)
# - RENDERER_API_KEY: shared secret for caller authentication
# - ALLOWED_HOSTS: comma-separated allowlist, e.g. "jimcresswell.net,*.vercel.app"
```

> Notes:
>
> - The binding name `BROWSER` is referenced in code as `env.BROWSER`.
> - Use `wrangler secret put RENDERER_API_KEY` etc.

---

## Vercel side (caller) responsibilities

### A) Create a pre-signed Vercel Blob upload URL

Do this in a Vercel route (server-side) so secrets stay on Vercel:

- decide deterministic key: `pdfs/<deploymentId>.pdf` (or `<gitSha>.pdf`)
- request a pre-signed upload URL from Vercel Blob tooling
- call Cloudflare Worker with `{ sourceUrl, uploadUrl, uploadHeaders, ... }`

### B) Provide a signed render token for the source page

To prevent arbitrary rendering / SSRF and to prevent public “render endpoints” being abused:

- Create an HMAC token: `token = HMAC(secret, sourceUrl + expiresAt + purpose)`
- Append to the render URL: `https://<deploy>/cv?render=1&exp=...&sig=...`
- On the Vercel page route, verify sig + exp before returning the page if `render=1`.
  - For public pages, this can be optional, but still recommended.

### C) Add a deterministic “ready” sentinel for rendering

In the page being rendered, add:

- `window.__RENDER_READY__ = true` after critical data + layout settled, OR
- an element like `<div id="render-ready" data-ready="true"></div>`

This makes rendering robust (especially if any hydration or late layout shifts exist).

---

## Cloudflare Worker API contract

### Request

`POST /build-pdf`

```json
{
  "sourceUrl": "https://<your-deploy>/cv?render=1&exp=...&sig=...",
  "upload": {
    "method": "PUT",
    "url": "https://<signed-blob-upload-url>",
    "headers": {
      "content-type": "application/pdf"
    },
    "resultBlobUrl": "https://<public-blob-url>/pdfs/<id>.pdf"
  },
  "pdf": {
    "format": "A4",
    "printBackground": true,
    "preferCSSPageSize": true,
    "tagged": true,
    "waitForFonts": true,
    "margin": { "top": "12mm", "right": "12mm", "bottom": "12mm", "left": "12mm" }
  },
  "browser": {
    "waitUntil": "networkidle0",
    "timeoutMs": 90000
  }
}
```

### Response

```json
{
  "ok": true,
  "bytes": 183742,
  "sha256": "hex...",
  "blobUrl": "https://<public-blob-url>/pdfs/<id>.pdf",
  "timingMs": { "launch": 400, "goto": 2200, "pdf": 800, "upload": 500 }
}
```

---

## Cloudflare Worker implementation (TypeScript)

### `src/index.ts`

```ts
import puppeteer from "@cloudflare/puppeteer";

type Env = {
  BROWSER: Fetcher; // Browser Rendering binding
  RENDERER_API_KEY: string;
  ALLOWED_HOSTS: string; // e.g. "jimcresswell.net,*.vercel.app"
};

type BuildPdfRequest = {
  sourceUrl: string;
  upload: {
    method: "PUT";
    url: string; // pre-signed upload URL
    headers?: Record<string, string>;
    resultBlobUrl?: string; // optional, if caller already knows it
  };
  pdf?: {
    format?: "A4" | "Letter";
    printBackground?: boolean;
    preferCSSPageSize?: boolean;
    tagged?: boolean;
    waitForFonts?: boolean;
    margin?: { top?: string; right?: string; bottom?: string; left?: string };
  };
  browser?: {
    waitUntil?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2";
    timeoutMs?: number;
  };
};

function json(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body, null, 2), {
    ...init,
    headers: { "content-type": "application/json; charset=utf-8", ...(init?.headers ?? {}) },
  });
}

function assertAuth(req: Request, env: Env) {
  const key = req.headers.get("x-renderer-key");
  if (!key || key !== env.RENDERER_API_KEY) {
    throw Object.assign(new Error("Unauthorized"), { status: 401 });
  }
}

function hostAllowed(urlStr: string, allowedHosts: string): boolean {
  const u = new URL(urlStr);
  const host = u.hostname.toLowerCase();
  const patterns = allowedHosts
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  return patterns.some((p) => {
    if (p.startsWith("*.")) {
      const suffix = p.slice(2);
      return host === suffix || host.endsWith("." + suffix);
    }
    return host === p;
  });
}

async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(req.url);

      if (req.method !== "POST" || url.pathname !== "/build-pdf") {
        return json({ ok: false, error: "Not found" }, { status: 404 });
      }

      assertAuth(req, env);

      const payload = (await req.json()) as BuildPdfRequest;

      if (!payload?.sourceUrl || !payload?.upload?.url) {
        return json({ ok: false, error: "Missing sourceUrl or upload.url" }, { status: 400 });
      }

      if (!hostAllowed(payload.sourceUrl, env.ALLOWED_HOSTS)) {
        return json({ ok: false, error: "sourceUrl host not allowlisted" }, { status: 400 });
      }

      const t0 = Date.now();

      // Connect to Browser Rendering
      const browser = await puppeteer.launch(env.BROWSER);
      const tLaunch = Date.now();

      try {
        const page = await browser.newPage();

        // Make rendering more deterministic
        await page.setCacheEnabled(false);
        await page.emulateMediaType("print");
        await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });

        const timeoutMs = payload.browser?.timeoutMs ?? 90_000;
        page.setDefaultTimeout(timeoutMs);
        page.setDefaultNavigationTimeout(timeoutMs);

        // Navigate
        const waitUntil = payload.browser?.waitUntil ?? "networkidle0";
        await page.goto(payload.sourceUrl, { waitUntil });

        // Optional: wait for a readiness sentinel to avoid layout shifts
        // Prefer a deterministic marker set by the app.
        // Example: window.__RENDER_READY__ = true or #render-ready exists.
        await Promise.race([
          page
            .waitForFunction(() => (globalThis as any).__RENDER_READY__ === true, {
              timeout: 10_000,
            })
            .catch(() => null),
          page
            .waitForSelector("#render-ready[data-ready='true']", { timeout: 10_000 })
            .catch(() => null),
        ]);

        // Fonts: ensure webfonts are loaded before PDF
        // `waitForFonts` in pdf options helps, but also explicitly wait on document.fonts.
        await page.evaluate(async () => {
          // @ts-ignore
          if (document?.fonts?.ready) await document.fonts.ready;
        });

        const tGoto = Date.now();

        // Generate PDF
        const pdfBytes = await page.pdf({
          format: payload.pdf?.format ?? "A4",
          printBackground: payload.pdf?.printBackground ?? true,
          preferCSSPageSize: payload.pdf?.preferCSSPageSize ?? true,
          tagged: payload.pdf?.tagged ?? true, // a11y: tagged PDF (Chromium feature; treat as best-effort)
          waitForFonts: payload.pdf?.waitForFonts ?? true, // reduce font race conditions
          margin: payload.pdf?.margin ?? {
            top: "12mm",
            right: "12mm",
            bottom: "12mm",
            left: "12mm",
          },
        });

        const tPdf = Date.now();

        // Upload to Vercel Blob signed URL
        const uploadHeaders: Record<string, string> = {
          "content-type": "application/pdf",
          ...(payload.upload.headers ?? {}),
        };

        const putRes = await fetch(payload.upload.url, {
          method: "PUT",
          headers: uploadHeaders,
          body: pdfBytes,
        });

        if (!putRes.ok) {
          const text = await putRes.text().catch(() => "");
          return json(
            { ok: false, error: "Upload failed", status: putRes.status, body: text.slice(0, 500) },
            { status: 502 }
          );
        }

        const tUpload = Date.now();
        const hash = await sha256Hex(pdfBytes);

        return json({
          ok: true,
          bytes: pdfBytes.byteLength,
          sha256: hash,
          blobUrl: payload.upload.resultBlobUrl ?? null,
          timingMs: {
            launch: tLaunch - t0,
            goto: tGoto - tLaunch,
            pdf: tPdf - tGoto,
            upload: tUpload - tPdf,
            total: tUpload - t0,
          },
        });
      } finally {
        await browser.close();
      }
    } catch (err: any) {
      const status = err?.status ?? 500;
      return json({ ok: false, error: err?.message ?? "Unknown error" }, { status });
    }
  },
};
```

---

## Font strategy (recommended)

### Preferred: self-host webfonts + deterministic loading

- Host WOFF2 fonts under your own domain (or Vercel static assets).
- Use `@font-face` in your CSS.
- Ensure the render page is cache-friendly and does not require third-party font calls.

In the render worker:

- wait on `document.fonts.ready`
- use `pdf({ waitForFonts: true })`

### Optional: inject fonts at render-time (only if needed)

If you cannot guarantee fonts are referenced by the page (or need overrides), add a Worker-side injection:

```ts
await page.addStyleTag({
  content: `
    @font-face {
      font-family: "MyFont";
      src: url("https://your-domain/fonts/myfont.woff2") format("woff2");
      font-weight: 400;
      font-style: normal;
    }
    body { font-family: "MyFont", system-ui, sans-serif; }
  `,
});
await page.evaluate(async () => {
  if (document.fonts?.ready) await document.fonts.ready;
});
```

---

## A11y (tagged PDF) checklist

1. Ensure HTML semantics:
   - correct heading hierarchy
   - landmarks (header/main/footer/nav)
   - alt text for meaningful images
   - form labels if any
2. Set language and title:
   - `<html lang="en">` (or correct lang)
   - `<title>...</title>` and relevant metadata
3. Generate tagged PDF (`tagged: true`)
4. Validate output in CI:
   - Use PAC (PDF Accessibility Checker) or Acrobat accessibility report as a gate
   - Expect iteration: “tagged” is necessary but not always sufficient for strict PDF/UA.

---

## Security envelope (do not skip)

- Require `x-renderer-key` (shared secret between Vercel and Worker).
- Allowlist `sourceUrl` hosts (no arbitrary URLs).
- Require signed render tokens on the page route (HMAC + expiry) if the page is not fully public.
- Block private IP targets (defence-in-depth):
  - At minimum: never allow raw IPs; only allow allowlisted domains.
- Timeouts + max size:
  - navigation timeout
  - PDF timeout
  - refuse very large outputs if needed

---

## Operational notes

- If you need “1 PDF per deployment build”, trigger the Worker from CI after Vercel deploy:
  - CI obtains the deployment URL (or uses a known alias),
  - requests Blob upload URL,
  - calls Worker.
- If you need queueing / retries, add Cloudflare Queues or a Durable Object:
  - DO can keep a browser session warm for multiple jobs (optional).
- Add structured logs with job IDs (deploymentId/gitSha) for traceability.

---

## What your coding agent should deliver

1. Cloudflare Worker repo:
   - `wrangler.toml`
   - `src/index.ts` implementing `/build-pdf`
   - secrets/config + allowlist enforcement
2. Vercel route:
   - creates Blob upload URL + known blob key
   - calls Cloudflare Worker with auth header and payload
3. Render page adjustments:
   - deterministic readiness sentinel
   - self-hosted webfonts
   - semantic HTML for accessibility
4. CI validation:
   - fetch resulting PDF and run PDF accessibility checks
   - fail build if checks fail (optional initially)

That’s the complete Cloudflare-based rendering pipeline.
