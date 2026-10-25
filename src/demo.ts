import { PRODUCTS, resolveProductUrls, type ProductUrls } from "@centerfuse/config";
import { escapeHtml, renderDocument, renderFamilyFooter, renderFamilyHeader } from "@centerfuse/ui";
import { centerFuseStyles } from "./styles.js";

export type DemoTrack = "buyer" | "seller";
export type BuyerStatus = "CONSIDERING" | "PURCHASED" | "ARCHIVED";
export type DemoResult = {
  track: DemoTrack;
  title: string;
  notes: string;
  buyerStatus?: BuyerStatus;
  condition?: string;
  error?: string;
};

function bounded(value: string | null, max: number): string {
  return (value ?? "").trim().slice(0, max);
}

/** Deterministic, isolated preview: no database, model, identity or marketplace requests. */
export function prepareDemo(form: URLSearchParams): DemoResult {
  const track: DemoTrack = form.get("track") === "seller" ? "seller" : "buyer";
  const title = bounded(form.get("title"), 100);
  const notes = bounded(form.get("notes"), 500);
  if (!title) return { track, title, notes, error: "Enter an item name to create the example preview." };

  if (track === "buyer") {
    const candidate = form.get("status");
    const buyerStatus: BuyerStatus = candidate === "PURCHASED" || candidate === "ARCHIVED" ? candidate : "CONSIDERING";
    return { track, title, notes, buyerStatus };
  }

  const allowed = ["New", "Used - good", "Used - fair", "Unknown"];
  const candidate = form.get("condition");
  const condition = candidate && allowed.includes(candidate) ? candidate : "Unknown";
  return { track, title, notes, condition };
}

function option(value: string, current: string, label: string): string {
  return `<option value="${escapeHtml(value)}"${value === current ? " selected" : ""}>${escapeHtml(label)}</option>`;
}

function exampleResult(result: DemoResult): string {
  if (result.error) {
    return `<section class="cf-result" role="alert"><strong>Check your example input</strong><p>${escapeHtml(result.error)}</p></section>`;
  }
  const details = result.track === "buyer"
    ? `<dl><dt>Item</dt><dd>${escapeHtml(result.title)}</dd><dt>Status</dt><dd>${escapeHtml(result.buyerStatus)}</dd><dt>Notes</dt><dd>${escapeHtml(result.notes || "No notes added")}</dd></dl>
       <p>A BuyFuse workspace lets signed-in users save items and update purchase status. This sample is not saved.</p>`
    : `<dl><dt>Draft item</dt><dd>${escapeHtml(result.title)}</dd><dt>Condition provided</dt><dd>${escapeHtml(result.condition)}</dd><dt>Seller notes</dt><dd>${escapeHtml(result.notes || "No details added")}</dd><dt>Next step</dt><dd>Review all details before preparing a real listing.</dd></dl>
       <p>This is a text-only draft assembled from your input. It does not identify photos, estimate prices, consult marketplace evidence or publish anything.</p>`;
  return `<section class="cf-result" role="status" aria-live="polite" aria-labelledby="demo-result-title">
    <span class="cf-demo-badge">Simulated result · Not saved</span>
    <h2 id="demo-result-title">${result.track === "buyer" ? "Your sample saved-item preview" : "Your sample listing outline"}</h2>
    ${details}
    <a href="/demo" class="cf-btn cf-secondary">Reset demo</a>
  </section>`;
}

export function renderCenterFuseDemo(
  urls: ProductUrls = resolveProductUrls({}),
  result?: DemoResult,
): string {
  const buyerTitle = result?.track === "buyer" ? result.title : "Desk lamp";
  const buyerNotes = result?.track === "buyer" ? result.notes : "Check dimensions before deciding.";
  const buyerStatus = result?.track === "buyer" ? result.buyerStatus ?? "CONSIDERING" : "CONSIDERING";
  const sellerTitle = result?.track === "seller" ? result.title : "Running shoes";
  const sellerNotes = result?.track === "seller" ? result.notes : "Original box included; inspect wear before listing.";
  const sellerCondition = result?.track === "seller" ? result.condition ?? "Unknown" : "Used - good";
  const realBuyerLink = urls.BUYFUSE
    ? `<a class="cf-btn cf-secondary" href="${escapeHtml(urls.BUYFUSE)}">Continue to real BuyFuse ↗</a>`
    : `<p class="cf-status" role="status">Real BuyFuse is not connected on this host.</p>`;
  const realSellerLink = urls.SELLFUSE
    ? `<a class="cf-btn cf-secondary" href="${escapeHtml(urls.SELLFUSE)}">Continue to real SellFuse ↗</a>`
    : `<p class="cf-status" role="status">Real SellFuse is not connected on this host.</p>`;

  const body = `<div class="cf-site">
    <style>${centerFuseStyles}</style>
    ${renderFamilyHeader("CENTERFUSE", urls)}
    <main id="main" class="shell">
      <div class="cf-theme-bar"><input type="checkbox" id="cf-dark" aria-label="Enable dark color theme"><label for="cf-dark">Dark theme</label></div>
      <div class="cf-demo-head">
        <a href="/" class="cf-caption">← Back to CenterFuse</a>
        <p class="cf-kicker">CenterFuse guided product preview</p>
        <span class="cf-demo-badge">Isolated demo · Simulated processing · No saved data</span>
        <h1>Try both journeys with example details.</h1>
        <p class="cf-lead">Choose a sample below. Change its details, submit the form and inspect the result. Nothing is saved or sent to a marketplace. Real product features live in separate applications.</p>
      </div>
      ${result ? exampleResult(result) : ""}
      <div class="cf-demo-columns">
        <section id="buyer-demo" class="cf-card" aria-labelledby="buyer-demo-title">
          <p class="cf-kicker">Sample experience 01</p>
          <h2 id="buyer-demo-title" class="cf-buyer-text">BuyFuse · Organize an item</h2>
          <p>Enter an item, add context and choose its current purchase status.</p>
          <form action="/demo" method="post" class="cf-form">
            <input type="hidden" name="track" value="buyer">
            <label class="cf-field" for="buyer-title">Item name
              <input id="buyer-title" name="title" maxlength="100" required value="${escapeHtml(buyerTitle)}">
            </label>
            <label class="cf-field" for="buyer-notes">Personal notes
              <textarea id="buyer-notes" name="notes" maxlength="500">${escapeHtml(buyerNotes)}</textarea>
            </label>
            <label class="cf-field" for="buyer-status">Purchase status
              <select id="buyer-status" name="status">
                ${option("CONSIDERING", buyerStatus, "Considering")}
                ${option("PURCHASED", buyerStatus, "Purchased")}
                ${option("ARCHIVED", buyerStatus, "Archived")}
              </select>
            </label>
            <button class="cf-btn" type="submit">Preview saved-item card</button>
          </form>
          <p class="cf-caption">Preview only: the signed-in BuyFuse application handles actual saved items.</p>
          ${realBuyerLink}
        </section>
        <section id="seller-demo" class="cf-card" aria-labelledby="seller-demo-title">
          <p class="cf-kicker">Sample experience 02</p>
          <h2 id="seller-demo-title" class="cf-seller-text">SellFuse · Outline a listing</h2>
          <p>Enter seller-provided details and produce a review-only sample outline.</p>
          <form action="/demo" method="post" class="cf-form">
            <input type="hidden" name="track" value="seller">
            <label class="cf-field" for="seller-title">Item name
              <input id="seller-title" name="title" maxlength="100" required value="${escapeHtml(sellerTitle)}">
            </label>
            <label class="cf-field" for="seller-notes">Known item details
              <textarea id="seller-notes" name="notes" maxlength="500">${escapeHtml(sellerNotes)}</textarea>
            </label>
            <label class="cf-field" for="seller-condition">Condition (as reported)
              <select id="seller-condition" name="condition">
                ${option("New", sellerCondition, "New")}
                ${option("Used - good", sellerCondition, "Used — good")}
                ${option("Used - fair", sellerCondition, "Used — fair")}
                ${option("Unknown", sellerCondition, "Unknown")}
              </select>
            </label>
            <button class="cf-btn cf-orange" type="submit">Preview listing outline</button>
          </form>
          <p class="cf-caption">No photo analysis, pricing, marketplace integrations or publication occurs in this demo.</p>
          ${realSellerLink}
        </section>
      </div>
      <section class="cf-section" aria-labelledby="demo-steps-title">
        <div class="cf-section-header"><h2 id="demo-steps-title">What this demonstration proves</h2>
        <p class="cf-lead">Real form submission, controlled sample input handling and a deterministic result — without access to production customer accounts, buyer records or seller systems.</p></div>
        <div class="cf-grid">
          <div class="cf-card"><h3>Buyer path</h3><ol class="cf-journey"><li>Enter an item.</li><li>Set its sample purchase status.</li><li>Review the on-screen preview.</li></ol></div>
          <div class="cf-card"><h3>Seller path</h3><ol class="cf-journey"><li>Describe an item.</li><li>Supply its condition and notes.</li><li>Review a draft outline before entering SellFuse.</li></ol></div>
        </div>
      </section>
    </main>
    ${renderFamilyFooter(urls)}
  </div>`;
  return renderDocument({
    product: PRODUCTS.CENTERFUSE,
    title: "CenterFuse guided demo — BuyFuse and SellFuse",
    description: "Safely preview the BuyFuse and SellFuse journeys with sample item details. No account or live marketplace connection required.",
    body,
  });
}
