import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { PRODUCTS, resolveProductUrls } from "@centerfuse/config";
import { prepareDemo, renderCenterFuseDemo } from "./demo.js";
import { renderCenterFuseHome, renderCenterFuseState } from "./page.js";

const urls = resolveProductUrls(process.env);
const port = Number(process.env.PORT ?? PRODUCTS.CENTERFUSE.defaultPort);
const host = process.env.HOST ?? "127.0.0.1";
const MAX_DEMO_BODY_BYTES = 8192;

class DemoBodyTooLarge extends Error {}

async function readDemoForm(request: IncomingMessage): Promise<URLSearchParams> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const bytes: Buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += bytes.byteLength;
    if (size > MAX_DEMO_BODY_BYTES) throw new DemoBodyTooLarge("Demo input is too large");
    chunks.push(bytes);
  }
  return new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
}

async function handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
  try {
    const pathname = new URL(request.url ?? "/", urls.CENTERFUSE || "http://localhost").pathname;
    if (request.method === "GET" && pathname === "/health") {
      return send(response, 200, JSON.stringify({ status: "ok", service: "centerfuse" }), "application/json; charset=utf-8");
    }
    if (request.method === "GET" && pathname === "/manifest.webmanifest") {
      return send(response, 200, JSON.stringify({
        name: "CenterFuse",
        short_name: "CenterFuse",
        display: "standalone",
        theme_color: PRODUCTS.CENTERFUSE.themeColor,
        background_color: "#f7f8fd",
        start_url: "/",
      }), "application/manifest+json");
    }
    if (request.method === "GET" && pathname === "/") return send(response, 200, renderCenterFuseHome(urls));
    if (request.method === "GET" && pathname === "/demo") return send(response, 200, renderCenterFuseDemo(urls));
    if (request.method === "POST" && pathname === "/demo") {
      if (!(request.headers["content-type"] ?? "").toLowerCase().startsWith("application/x-www-form-urlencoded")) {
        return send(response, 415, "Unsupported demo content type", "text/plain; charset=utf-8");
      }
      const fields = await readDemoForm(request);
      return send(response, 200, renderCenterFuseDemo(urls, prepareDemo(fields)));
    }
    if (request.method === "GET" && pathname === "/loading") return send(response, 200, renderCenterFuseState("loading", urls));
    if (request.method !== "GET" && pathname !== "/demo") return send(response, 405, "Method not allowed", "text/plain; charset=utf-8");
    return send(response, 404, renderCenterFuseState("not-found", urls));
  } catch (error) {
    if (error instanceof DemoBodyTooLarge) return send(response, 413, "Demo input is too large", "text/plain; charset=utf-8");
    return send(response, 500, renderCenterFuseState("error", urls));
  }
}

createServer((request, response) => {
  void handle(request, response).catch(() => {
    if (!response.headersSent) send(response, 500, renderCenterFuseState("error", urls));
    else response.destroy();
  });
}).listen(port, host, () => console.info(JSON.stringify({ event: "app.started", product: "CENTERFUSE", host, port })));

function send(response: ServerResponse, status: number, body: string, type = "text/html; charset=utf-8"): void {
  response.writeHead(status, {
    "content-type": type,
    "content-security-policy": "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
    "cache-control": "no-store",
  }).end(body);
}
