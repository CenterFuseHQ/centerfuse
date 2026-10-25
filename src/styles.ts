/**
 * CenterFuse parent-site visual system. Intentionally scoped to .cf-site so
 * buyer and seller app styles remain independent.
 */
export const centerFuseStyles = `
.cf-site{--cf-bg:#f7f8fd;--cf-ink:#151d37;--cf-muted:#56627b;--cf-card:#ffffff;--cf-border:#dfe5f2;--cf-blue:#3558e7;--cf-violet:#7956db;--cf-orange:#e86b40;--cf-soft:#edf1ff;--cf-shadow:0 16px 46px rgba(39,56,113,.08);min-height:100vh;color:var(--cf-ink);background:radial-gradient(ellipse at 82% 5%,#e9e8ff 0,transparent 38%),radial-gradient(ellipse at 5% 36%,#fff0e9 0,transparent 36%),var(--cf-bg);transition:background-color .2s,color .2s;color-scheme:light}
.cf-site:has(#cf-dark:checked){--cf-bg:#0b1225;--cf-ink:#f6f8ff;--cf-muted:#b4bfd9;--cf-card:#151f36;--cf-border:#30405e;--cf-blue:#93a9ff;--cf-violet:#c2a9ff;--cf-orange:#ffac89;--cf-soft:#1c2c4b;--cf-shadow:0 16px 46px rgba(0,0,0,.25);background:radial-gradient(ellipse at 82% 5%,#20234d 0,transparent 38%),var(--cf-bg);color-scheme:dark}
.cf-site .shell{width:min(77rem,calc(100% - 2.4rem))}
.cf-site .family-nav{padding:1.4rem 0;gap:1rem}
.cf-site .brand{font-size:1.3rem;color:var(--cf-ink)}
.cf-site .nav-links a{font-size:.92rem;color:var(--cf-muted)}
.cf-site .nav-links a[aria-current=page]{background:var(--cf-card);color:var(--cf-ink)}
.cf-site .family-footer{border-color:var(--cf-border);color:var(--cf-muted);margin-top:4rem}
.cf-site .family-footer a{color:var(--cf-ink)}
.cf-theme-bar{display:flex;justify-content:flex-end;align-items:center;gap:.6rem;font-size:.84rem;font-weight:700;color:var(--cf-muted);padding:0 0 1.1rem}
.cf-theme-bar input{accent-color:#526afa;width:1.15rem;height:1.15rem;cursor:pointer}
.cf-theme-bar label{cursor:pointer}
.cf-hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(20rem,.95fr);align-items:center;gap:clamp(1.5rem,5vw,5rem);padding:clamp(2.5rem,6vw,5.5rem) 0 3.5rem}
.cf-kicker{font-size:.79rem;font-weight:850;letter-spacing:.14em;text-transform:uppercase;color:var(--cf-blue);margin:0 0 1rem}
.cf-headline{font-size:clamp(3.1rem,6vw,6.3rem);letter-spacing:-.069em;line-height:.98;margin:0 0 1.3rem;max-width:12ch}
.cf-gradient{background:linear-gradient(120deg,#3659dc 5%,#875be6 65%,#ed794c);-webkit-background-clip:text;background-clip:text;color:transparent}
.cf-site:has(#cf-dark:checked) .cf-gradient{background-image:linear-gradient(120deg,#91a7ff,#d3b7ff,#ffb28d)}
.cf-lead{font-size:clamp(1.1rem,1.8vw,1.35rem);line-height:1.65;color:var(--cf-muted);max-width:41rem;margin:0 0 1.8rem}
.cf-actions{display:flex;gap:.8rem;flex-wrap:wrap;align-items:center}
.cf-site a.cf-btn,.cf-site button.cf-btn{display:inline-flex;align-items:center;justify-content:center;min-height:3rem;padding:.85rem 1.35rem;border-radius:.9rem;text-decoration:none;font-weight:800;border:1px solid transparent;background:#3558e7;color:#fff;box-shadow:0 7px 21px rgba(53,88,231,.17)}
.cf-site a.cf-btn:hover,.cf-site button.cf-btn:hover{filter:brightness(1.09);transform:translateY(-1px)}
.cf-site a.cf-btn:focus-visible,.cf-site button.cf-btn:focus-visible,.cf-site a:focus-visible,.cf-site input:focus-visible,.cf-site select:focus-visible,.cf-site textarea:focus-visible,.cf-site summary:focus-visible{outline:3px solid #df7629;outline-offset:3px}
.cf-site a.cf-btn.cf-secondary,.cf-site button.cf-btn.cf-secondary{background:var(--cf-card);color:var(--cf-ink);border-color:var(--cf-border);box-shadow:none}
.cf-site .cf-btn.cf-orange{background:#d9582b;color:#fff}
.cf-site .cf-btn[aria-disabled=true]{opacity:.64;cursor:not-allowed;box-shadow:none}
.cf-caption{color:var(--cf-muted);font-size:.92rem;line-height:1.55}
.cf-visual{position:relative;padding:clamp(1.2rem,2vw,2rem);min-height:24rem;border:1px solid var(--cf-border);border-radius:2rem;background:linear-gradient(145deg,var(--cf-card),var(--cf-soft));box-shadow:var(--cf-shadow);overflow:hidden}
.cf-visual:before{content:"";position:absolute;width:21rem;height:21rem;border:1px dashed var(--cf-violet);border-radius:50%;opacity:.3;left:calc(50% - 10.5rem);top:calc(50% - 10.5rem)}
.cf-orbit{display:grid;place-items:center;gap:1rem;position:relative;z-index:1;height:100%}
.cf-orbit-core{display:grid;place-items:center;width:9rem;height:9rem;border:2px solid #7893fb;border-radius:50%;background:var(--cf-card);box-shadow:0 0 0 12px rgba(111,133,236,.09);text-align:center;padding:1rem}
.cf-orbit-core strong{display:block;font-size:1.16rem}
.cf-orbit-core span{font-size:.73rem;color:var(--cf-muted)}
.cf-orbit-branches{display:grid;grid-template-columns:1fr 1fr;gap:1rem;width:100%}
.cf-orbit-bubble{border:1px solid var(--cf-border);border-radius:1.3rem;background:var(--cf-card);padding:1.15rem;text-align:center;box-shadow:var(--cf-shadow)}
.cf-orbit-bubble strong{display:block;font-size:1.2rem;margin:.2rem 0}
.cf-orbit-bubble span{font-size:.83rem;color:var(--cf-muted)}
.cf-buyer-text{color:var(--cf-violet)}.cf-seller-text{color:var(--cf-orange)}
.cf-section{padding:3.4rem 0}
.cf-section-header{max-width:44rem;margin-bottom:1.6rem}
.cf-section h2{font-size:clamp(2rem,3.7vw,3.5rem);line-height:1.09;letter-spacing:-.045em;margin:.2rem 0 .8rem}
.cf-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.3rem}
.cf-card{padding:clamp(1.35rem,3vw,2.2rem);border:1px solid var(--cf-border);border-radius:1.6rem;background:var(--cf-card);box-shadow:var(--cf-shadow)}
.cf-card h3{font-size:1.65rem;letter-spacing:-.03em;margin:.6rem 0}
.cf-card p{color:var(--cf-muted);line-height:1.65}
.cf-icon{display:grid;place-items:center;width:3.3rem;height:3.3rem;border-radius:1rem;background:var(--cf-soft);font-size:1.6rem}
.cf-icon-buyer{background:#efeafe;color:#704aca}.cf-icon-seller{background:#fff0e8;color:#c25127}
.cf-preview{margin:1.4rem 0;min-height:8rem;border:1px solid var(--cf-border);background:var(--cf-soft);border-radius:1rem;padding:1rem}
.cf-preview-top{display:flex;gap:.3rem;padding-bottom:.8rem}
.cf-dot{width:.45rem;height:.45rem;border-radius:50%;background:#aeb9d5}
.cf-preview-line{height:.62rem;margin:.6rem 0;width:65%;border-radius:1rem;background:linear-gradient(90deg,#879fff,#c8d3fd)}
.cf-preview-line.short{width:37%}.cf-preview-line.long{width:86%}
.cf-preview-tags{display:flex;flex-wrap:wrap;gap:.5rem}
.cf-preview-tags span{font-size:.75rem;font-weight:750;padding:.4rem .55rem;border-radius:.6rem;background:var(--cf-card);color:var(--cf-ink)}
.cf-status{border:1px solid var(--cf-border);border-radius:1rem;padding:.8rem 1rem;margin:1rem 0;color:var(--cf-muted);background:var(--cf-soft)}
.cf-journeys{display:grid;grid-template-columns:1fr 1fr;gap:1.3rem}
.cf-journey{display:grid;gap:.85rem;margin:1.1rem 0;padding:0;list-style:none;counter-reset:cf-step}
.cf-journey li{display:flex;align-items:flex-start;gap:.75rem;color:var(--cf-ink);line-height:1.5;counter-increment:cf-step}
.cf-journey li:before{content:counter(cf-step);flex:none;display:grid;place-items:center;width:1.9rem;height:1.9rem;border-radius:50%;background:var(--cf-soft);color:var(--cf-blue);font-weight:900}
.cf-demo-cta{display:grid;grid-template-columns:1fr auto;align-items:center;gap:1.2rem;padding:clamp(1.5rem,3.5vw,3rem);border-radius:1.6rem;background:linear-gradient(125deg,#14214d,#293c86);color:#fff}
.cf-demo-cta h2{color:#fff;margin:.1rem 0 .7rem}
.cf-demo-cta p{color:#dce4ff;margin:0;max-width:42rem}
.cf-demo-cta a.cf-btn{background:#fff;color:#14214d}
.cf-faq{display:grid;gap:.8rem}
.cf-faq details{border:1px solid var(--cf-border);padding:1.1rem 1.3rem;border-radius:1rem;background:var(--cf-card)}
.cf-faq summary{cursor:pointer;font-weight:800}
.cf-faq p{color:var(--cf-muted);line-height:1.65}
.cf-demo-head{padding:3rem 0 1.2rem}
.cf-demo-head h1{font-size:clamp(2.6rem,5vw,4.5rem);letter-spacing:-.06em;line-height:1.05;margin:.3rem 0}
.cf-demo-badge{display:inline-flex;padding:.45rem .7rem;border-radius:999px;border:1px solid #e7aa62;background:#fff4dd;color:#754b0c;font-weight:850;font-size:.75rem;text-transform:uppercase;letter-spacing:.04em}
.cf-demo-columns{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem}
.cf-form{display:grid;gap:1rem;margin-top:1.1rem}
.cf-field{display:grid;gap:.4rem;font-weight:750}
.cf-field input,.cf-field select,.cf-field textarea{width:100%;background:var(--cf-card);color:var(--cf-ink);border:1px solid var(--cf-border);border-radius:.7rem;padding:.8rem;min-height:2.8rem}
.cf-field textarea{min-height:6rem;resize:vertical}
.cf-result{border:2px solid #6f82e8;background:var(--cf-card);border-radius:1.3rem;margin-top:1.3rem;padding:1.35rem}
.cf-result p,.cf-result li{color:var(--cf-muted);line-height:1.65}
.cf-result h2{font-size:1.5rem;margin:.4rem 0}
.cf-result dl{display:grid;grid-template-columns:max-content 1fr;gap:.5rem 1rem}
.cf-result dt{font-weight:800}.cf-result dd{margin:0;overflow-wrap:anywhere}
.cf-demo-return{display:inline-block;margin-top:1rem}
@media(max-width:58rem){.cf-hero{grid-template-columns:1fr}.cf-visual{min-height:21rem}.cf-demo-cta{grid-template-columns:1fr}.cf-site .family-nav{display:grid;justify-content:stretch}.cf-site .nav-links{justify-content:flex-start;overflow-x:auto;flex-wrap:nowrap;width:100%;padding-bottom:.3rem}.cf-site .nav-links a:not([aria-current=page]){display:inline-flex}}
@media(max-width:40rem){.cf-grid,.cf-journeys,.cf-demo-columns{grid-template-columns:1fr}.cf-orbit-branches{gap:.5rem}.cf-orbit-bubble{padding:.8rem}.cf-hero{padding-top:1.2rem}.cf-site .shell{width:min(100% - 1.4rem,77rem)}.cf-section{padding:2.2rem 0}.cf-headline{font-size:clamp(2.7rem,12vw,4.2rem)}.cf-theme-bar{padding-bottom:.5rem}}
@media(prefers-reduced-motion:reduce){.cf-site *{scroll-behavior:auto!important;transition:none!important}}
`;
