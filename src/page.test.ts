import { describe, expect, it } from "vitest";
import { resolveProductUrls } from "@centerfuse/config";
import { renderCenterFuseHome, renderCenterFuseState } from "./page.js";

describe("CenterFuse redesigned parent site", () => {
  it("renders accessible product discovery, journeys, a safe demo entry and responsive theme controls", () => {
    const html = renderCenterFuseHome();
    expect(html).toContain('<main id="main"');
    expect(html).toContain('id="welcome-title"');
    expect(html).toContain('id="products"');
    expect(html).toContain('id="journeys"');
    expect(html).toContain('href="/demo"');
    expect(html).toContain('id="cf-dark"');
    expect(html).toContain("prefers-reduced-motion");
    expect(html).toContain("BuyFuse");
    expect(html).toContain("SellFuse");
    expect(html).toContain("Try guided demo");
  });

  it("handles unconfigured product links without inventing live connections", () => {
    const html = renderCenterFuseHome(resolveProductUrls({ VERCEL: "1" }));
    expect(html).toContain("BuyFuse not connected");
    expect(html).toContain("SellFuse not connected");
    expect(html).not.toContain('href=""');
  });

  it("escapes externally configured product URLs", () => {
    const urls = resolveProductUrls({ SELLFUSE_URL: "https://example.com/?a=one&b=two" });
    const html = renderCenterFuseHome(urls);
    expect(html).toContain("a=one&amp;b=two");
  });

  it("preserves loading, error and not-found states", () => {
    expect(renderCenterFuseState("loading")).toContain("Loading CenterFuse");
    expect(renderCenterFuseState("error")).toContain('role="alert"');
    expect(renderCenterFuseState("not-found")).toContain("Page not found");
  });
});
