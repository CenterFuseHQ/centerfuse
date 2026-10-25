import { describe, expect, it } from "vitest";
import { resolveProductUrls } from "@centerfuse/config";
import { prepareDemo, renderCenterFuseDemo } from "./demo.js";

describe("CenterFuse isolated guided demonstration", () => {
  it("renders two keyboard-operable POST forms without inline scripts or live integrations", () => {
    const html = renderCenterFuseDemo();
    expect(html).toContain('method="post"');
    expect(html).toContain('action="/demo"');
    expect(html).toContain('id="buyer-demo"');
    expect(html).toContain('id="seller-demo"');
    expect(html).toContain('for="buyer-title"');
    expect(html).toContain('for="seller-title"');
    expect(html).toContain("No saved data");
    expect(html).not.toContain("<script>");
  });

  it("previews a buyer item with validated purchase status", () => {
    const result = prepareDemo(new URLSearchParams({
      track: "buyer", title: "  Desk lamp  ", notes: "Measure width", status: "PURCHASED",
    }));
    expect(result).toEqual({
      track: "buyer", title: "Desk lamp", notes: "Measure width", buyerStatus: "PURCHASED",
    });
    const html = renderCenterFuseDemo(resolveProductUrls({ VERCEL: "1" }), result);
    expect(html).toContain("Sample saved-item preview".toLowerCase().slice(7, 12)); // stable preview content
    expect(html).toContain("Measure width");
    expect(html).toContain("Real BuyFuse is not connected");
    expect(html).not.toContain("Continue to real BuyFuse ↗");
  });

  it("defaults unrecognized status and condition instead of trusting unexpected inputs", () => {
    expect(prepareDemo(new URLSearchParams({ track: "buyer", title: "Chair", status: "SOLD" })).buyerStatus).toBe("CONSIDERING");
    expect(prepareDemo(new URLSearchParams({ track: "seller", title: "Chair", condition: "PERFECT" })).condition).toBe("Unknown");
  });

  it("prepares a seller review outline without fabricated pricing or publishing claims", () => {
    const result = prepareDemo(new URLSearchParams({
      track: "seller", title: "Shoes", notes: "Used for walks", condition: "Used - fair",
    }));
    const html = renderCenterFuseDemo(undefined, result);
    expect(html).toContain("Your sample listing outline");
    expect(html).toContain("Review all details");
    expect(html).toContain("Used - fair");
    expect(html).toContain("No photo analysis, pricing, marketplace integrations or publication");
  });

  it("returns an accessible error for missing item names", () => {
    const result = prepareDemo(new URLSearchParams({ track: "buyer", title: "   " }));
    expect(result.error).toMatch(/item name/);
    const html = renderCenterFuseDemo(undefined, result);
    expect(html).toContain('role="alert"');
  });

  it("escapes HTML and script-like input in both fields and rendered results", () => {
    const result = prepareDemo(new URLSearchParams({
      track: "seller", title: '<script>alert("x")</script>', notes: '<img src=x onerror=alert(1)>',
    }));
    const html = renderCenterFuseDemo(undefined, result);
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&lt;img");
  });

  it("bounds submitted text lengths", () => {
    const result = prepareDemo(new URLSearchParams({
      track: "buyer", title: "X".repeat(500), notes: "N".repeat(1200),
    }));
    expect(result.title).toHaveLength(100);
    expect(result.notes).toHaveLength(500);
  });
});
