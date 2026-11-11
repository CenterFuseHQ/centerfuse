import { afterEach, describe, expect, it, vi } from "vitest";
import { createServer, type Server } from "node:http";
import { resolveProductUrls } from "@centerfuse/config";
import vercelHandler, { createCenterFuseServer } from "./server.js";

const servers: Server[] = [];

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      (server) =>
        new Promise<void>((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()));
        }),
    ),
  );
});

async function startServer(server: Server): Promise<string> {
  servers.push(server);
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Test server did not bind to a TCP port");
  return `http://127.0.0.1:${address.port}`;
}

describe("CenterFuse HTTP product discovery contract", () => {
  it("exports a Vercel-compatible handler for the same HTTP routes", async () => {
    const baseUrl = await startServer(createServer(vercelHandler));

    const response = await fetch(`${baseUrl}/health`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok", service: "centerfuse" });
  });

  it("serves the versioned public directory with caching and CORS", async () => {
    const directory = {
      schemaVersion: 1 as const,
      products: [],
    };
    const discover = vi.fn(async () => directory);
    const baseUrl = await startServer(
      createCenterFuseServer({
        urls: resolveProductUrls({ VERCEL: "1" }),
        discover,
      }),
    );

    const response = await fetch(`${baseUrl}/api/v1/products`);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(response.headers.get("cache-control")).toContain("s-maxage=10");
    expect(await response.json()).toEqual(directory);
    expect(discover).toHaveBeenCalledOnce();
  });

  it("does not accept writes to the read-only directory", async () => {
    const baseUrl = await startServer(
      createCenterFuseServer({
        urls: resolveProductUrls({ VERCEL: "1" }),
        discover: vi.fn(async () => ({ schemaVersion: 1 as const, products: [] })),
      }),
    );

    const response = await fetch(`${baseUrl}/api/v1/products`, { method: "POST" });

    expect(response.status).toBe(405);
  });
});
