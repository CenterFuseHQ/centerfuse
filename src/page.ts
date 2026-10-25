import { PRODUCTS, resolveProductUrls, type ProductUrls } from "@centerfuse/config";
import { escapeHtml, renderDocument, renderFamilyFooter, renderFamilyHeader, renderState } from "@centerfuse/ui";
import { centerFuseStyles } from "./styles.js";

function productAction(url: string, text: string, className: string, unavailable: string): string {
  return url
    ? `<a class="cf-btn ${className}" href="${escapeHtml(url)}">${escapeHtml(text)} <span aria-hidden="true">↗</span></a>`
    : `<span class="cf-btn cf-secondary" aria-disabled="true">${escapeHtml(unavailable)}</span>`;
}

export function renderCenterFuseHome(urls: ProductUrls = resolveProductUrls({})): string {
  const buyAction = productAction(urls.BUYFUSE, "Open BuyFuse", "cf-secondary", "BuyFuse not connected");
  const sellAction = productAction(urls.SELLFUSE, "Open SellFuse", "cf-orange", "SellFuse not connected");

  const body = `<div class="cf-site">
    <style>${centerFuseStyles}</style>
    ${renderFamilyHeader("CENTERFUSE", urls)}
    <main id="main" class="shell">
      <div class="cf-theme-bar"><input id="cf-dark" type="checkbox" aria-label="Enable dark color theme"><label for="cf-dark">Dark theme</label></div>
      <section class="cf-hero" aria-labelledby="welcome-title">
        <div>
          <p class="cf-kicker">One connected family · Two focused products</p>
          <h1 class="cf-headline" id="welcome-title">A clearer way to <span class="cf-gradient">buy and sell.</span></h1>
          <p class="cf-lead">CenterFuse helps you find the right workspace. Save the things you're considering with BuyFuse, or prepare listings with SellFuse. Each product stays focused on your task.</p>
          <div class="cf-actions">
            <a href="#products" class="cf-btn">Explore the products <span aria-hidden="true">↓</span></a>
            <a href="/demo" class="cf-btn cf-secondary">Try guided demo</a>
          </div>
          <p class="cf-caption">Explore without an account. A demo uses example information only.</p>
        </div>
        <div class="cf-visual" role="img" aria-label="CenterFuse connects two independent experiences: BuyFuse for saving items and SellFuse for preparing listings.">
          <div class="cf-orbit">
            <div class="cf-orbit-core"><div><strong>✧ CenterFuse</strong><span>Your product-family home</span></div></div>
            <div class="cf-orbit-branches">
              <div class="cf-orbit-bubble"><div class="cf-buyer-text" aria-hidden="true">◇</div><strong class="cf-buyer-text">BuyFuse</strong><span>Save · Note · Decide</span></div>
              <div class="cf-orbit-bubble"><div class="cf-seller-text" aria-hidden="true">▱</div><strong class="cf-seller-text">SellFuse</strong><span>Capture · Review · Prepare</span></div>
            </div>
          </div>
        </div>
      </section>

      <section class="cf-section" id="products" aria-labelledby="products-title">
        <div class="cf-section-header">
          <p class="cf-kicker">Choose your path</p>
          <h2 id="products-title">The right tool for your next step.</h2>
          <p class="cf-lead">Two purpose-built experiences. No confusing switch between buying and selling tasks.</p>
        </div>
        <div class="cf-grid">
          <article class="cf-card" aria-labelledby="buy-title">
            <span class="cf-icon cf-icon-buyer" aria-hidden="true">◇</span>
            <p class="cf-kicker">For buyers</p>
            <h3 id="buy-title">BuyFuse</h3>
            <p>Keep a personal list of items you are considering, along with source links, notes and purchase status.</p>
            <div class="cf-preview" aria-label="Illustrative buyer workspace layout, not live items">
              <div class="cf-preview-top" aria-hidden="true"><span class="cf-dot"></span><span class="cf-dot"></span><span class="cf-dot"></span></div>
              <strong>My saved items</strong>
              <div class="cf-preview-line long" aria-hidden="true"></div>
              <div class="cf-preview-tags"><span>Considering</span><span>Purchased</span><span>Archived</span></div>
            </div>
            <p class="cf-caption">Illustrative preview · No actual customer data</p>
            ${buyAction}
            ${!urls.BUYFUSE ? '<p class="cf-status" role="status">BuyFuse is not connected to this host. You can still explore the guided demo.</p>' : ""}
          </article>
          <article class="cf-card" aria-labelledby="sell-title">
            <span class="cf-icon cf-icon-seller" aria-hidden="true">▱</span>
            <p class="cf-kicker">For sellers</p>
            <h3 id="sell-title">SellFuse</h3>
            <p>Start from product photos and details, inspect available evidence, review a master listing and choose how to proceed.</p>
            <div class="cf-preview" aria-label="Illustrative seller listing review layout, not a real marketplace listing">
              <div class="cf-preview-top" aria-hidden="true"><span class="cf-dot"></span><span class="cf-dot"></span><span class="cf-dot"></span></div>
              <strong>Review a listing</strong>
              <div class="cf-preview-line" aria-hidden="true"></div>
              <div class="cf-preview-line short" aria-hidden="true"></div>
              <div class="cf-preview-tags"><span>Item details</span><span>Review required</span></div>
            </div>
            <p class="cf-caption">Illustrative preview · No marketplace execution</p>
            ${sellAction}
            ${!urls.SELLFUSE ? '<p class="cf-status" role="status">SellFuse is not connected to this host. You can still explore the guided demo.</p>' : ""}
          </article>
        </div>
      </section>

      <section class="cf-section" id="journeys" aria-labelledby="journeys-title">
        <div class="cf-section-header">
          <p class="cf-kicker">Designed around what you do</p>
          <h2 id="journeys-title">Two simple journeys.</h2>
          <p class="cf-lead">Each product handles its own workflow. CenterFuse makes it easier to discover the right one.</p>
        </div>
        <div class="cf-journeys">
          <article class="cf-card"><h3 class="cf-buyer-text">Your buyer journey</h3><ol class="cf-journey">
            <li>Save an item's name and optional source link.</li>
            <li>Add the details you want to remember.</li>
            <li>Update its status as your decision changes.</li>
          </ol><a href="/demo#buyer-demo" class="cf-btn cf-secondary">Walk through BuyFuse</a></article>
          <article class="cf-card"><h3 class="cf-seller-text">Your seller journey</h3><ol class="cf-journey">
            <li>Capture photos and describe the item.</li>
            <li>Inspect any available analysis and evidence.</li>
            <li>Review and approve a listing before proceeding.</li>
          </ol><a href="/demo#seller-demo" class="cf-btn cf-secondary">Walk through SellFuse</a></article>
        </div>
      </section>

      <section class="cf-section" id="demo" aria-labelledby="demo-title">
        <div class="cf-demo-cta">
          <div><p class="cf-kicker" style="color:#b5c9ff">Interactive guided preview</p>
            <h2 id="demo-title">Explore the idea before signing in.</h2>
            <p>Try an isolated, clearly labeled demonstration with example item details. It creates a preview from your input without saving accounts, touching production data or calling marketplaces.</p>
          </div><a href="/demo" class="cf-btn">Try guided demo <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section class="cf-section" id="about" aria-labelledby="about-title">
        <div class="cf-section-header"><p class="cf-kicker">Straightforward by design</p><h2 id="about-title">Connected in purpose. Separate in practice.</h2></div>
        <div class="cf-grid">
          <article class="cf-card"><h3>Focused experiences</h3><p>BuyFuse and SellFuse have independent applications, authentication boundaries and release cycles.</p></article>
          <article class="cf-card"><h3>No misleading claims</h3><p>This homepage does not display unverified prices, inventory, sales results or customer statistics. Availability depends on configured product connections.</p></article>
        </div>
      </section>
      <section class="cf-section cf-faq" aria-labelledby="questions-title">
        <h2 id="questions-title">Common questions</h2>
        <details><summary>Do I need to create an account to explore?</summary><p>No. The CenterFuse homepage and guided demo are available without signing in. Actual buyer and seller workspaces have their own sign-in requirements.</p></details>
        <details><summary>Does the demo publish listings or save items?</summary><p>No. The demo creates a temporary, on-screen sample result only. Open the relevant product to use its real features.</p></details>
        <details><summary>How does CenterFuse handle payments?</summary><p>CenterFuse is a product-family entry point and does not offer its own purchase or subscription checkout. Product-specific commercial plans are not represented here unless verified.</p></details>
      </section>
    </main>
    ${renderFamilyFooter(urls)}
  </div>`;
  return renderDocument({
    product: PRODUCTS.CENTERFUSE,
    title: "CenterFuse — A clearer way to buy and sell",
    description: "Discover BuyFuse for saved items and SellFuse for preparing listings. Explore both products with a safe guided demo.",
    body,
  });
}

export function renderCenterFuseState(
  kind: "loading" | "error" | "not-found",
  urls: ProductUrls = resolveProductUrls({}),
): string {
  const state = kind === "loading"
    ? renderState("loading", "Loading CenterFuse", "Bringing your products together…")
    : kind === "error"
      ? renderState("error", "Something went wrong", "CenterFuse could not load this page. Try again shortly.")
      : renderState("empty", "Page not found", "The page you requested is not part of CenterFuse.");
  return renderDocument({
    product: PRODUCTS.CENTERFUSE,
    title: `${kind === "not-found" ? "Page not found" : "CenterFuse"} — CenterFuse`,
    description: "CenterFuse application status",
    body: `${renderFamilyHeader("CENTERFUSE", urls)}<main id="main" class="shell hero">${state}<p><a class="button" href="${escapeHtml(urls.CENTERFUSE || "/")}">Return home</a></p></main>${renderFamilyFooter(urls)}`,
  });
}
