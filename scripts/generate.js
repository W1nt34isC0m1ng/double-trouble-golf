// Static-site generator for DoubleTrouble Golf.
//
// Reads js/products.js and writes, from that single source of truth:
//   • a crawlable SEO page per product at /<slug>/index.html
//   • sitemap.xml (homepage + every product page)
//   • feed.xml (Google Merchant Center product feed)
//   • the "Shop by ball" internal links inside index.html
//
// Run it after editing products.js:  npm run generate
//
// No build tooling, no dependencies — just Node.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PRODUCTS = require(path.join(ROOT, "js", "products.js"));
const SITE = "https://doubletroublegolf.com";

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// A "bundle" is anything not sold by the dozen — the Rescue Box, bulk bags, etc.
function isBundle(p) {
  return p.unit && p.unit !== "dozen";
}

function slugFor(p) {
  if (p.slug) return p.slug;
  return isBundle(p) ? slugify(p.name) : slugify(`used ${p.brand} ${p.name} ${p.grade}`);
}

// Use a real single brand for schema/feed; fall back to the store name for
// multi-brand bundles (Value Mix, Rescue Box).
function feedBrand(p) {
  return p.brand && !["Mixed", "Best value"].includes(p.brand) ? p.brand : "DoubleTrouble Golf";
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function gradeClass(grade) {
  return "grade-" + grade.toLowerCase().replace(/\s+/g, "-");
}

function productPage(p) {
  const slug = slugFor(p);
  const url = `${SITE}/${slug}/`;
  const unit = p.unit || "dozen";
  const displayName = isBundle(p) ? p.name : `Used ${p.brand} ${p.name} Golf Balls`;
  const title = p.pageTitle || `${displayName}${p.grade ? " – " + p.grade : ""} | DoubleTrouble Golf`;
  const price = p.pricePerDozen.toFixed(2);
  const image = `${SITE}/${p.image || `images/products/${p.id}.jpg`}`;
  const brandName = feedBrand(p);

  const ld = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: `${p.brand} ${p.name}`.trim(),
    description: p.blurb,
    image: image,
    brand: { "@type": "Brand", name: brandName },
    offers: {
      "@type": "Offer",
      url: url,
      priceCurrency: "USD",
      price: price,
      itemCondition: "https://schema.org/UsedCondition",
      availability: "https://schema.org/InStock",
    },
  };

  const art = p.image
    ? `<img src="/${esc(p.image)}" alt="${esc(p.brand + " " + p.name)}">`
    : `<div class="card-ball"></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(p.blurb)}">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(p.blurb)}">
  <meta property="og:image" content="${image}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="product">
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
  <link rel="stylesheet" href="/css/style.css">
  <script src="/js/tracking.js"></script>
</head>
<body>
  <header class="site-header">
    <a class="wordmark" href="/">
      <span class="logo-balls" aria-hidden="true"><span class="logo-ball"></span><span class="logo-ball"></span></span>
      DoubleTrouble<span class="wordmark-accent">Golf</span>
    </a>
  </header>

  <main class="section">
    <p class="product-crumb"><a href="/#shop">← All golf balls</a></p>
    <div class="product-page">
      <div class="card-art" style="--accent: ${esc(p.accent || "")}">${art}</div>
      <div>
        <p class="card-brand">${esc(p.brand)}</p>
        <h1>${esc(displayName)}${p.grade ? ` <span class="grade-badge ${gradeClass(p.grade)}">${esc(p.grade)}</span>` : ""}</h1>
        <p class="product-price">$${price}<small>/${esc(unit)}</small> · free U.S. shipping</p>
        <p>${esc(p.blurb)}</p>
        <button class="btn btn-primary" onclick="buy()">Add to cart</button>
        <p class="product-seo">${esc(
          isBundle(p)
            ? `${p.blurb} Every ball is recovered from local courses, washed, and hand-graded by the DoubleTrouble Golf twins, then shipped free anywhere in the continental US.`
            : `Every dozen of these ${p.brand} ${p.name} balls is recovered from local courses, washed, and hand-graded by the DoubleTrouble Golf twins, then shipped free anywhere in the continental US. ${p.grade} condition means ${gradeBlurb(p.grade)}`
        )}</p>
        <p><a href="/#grading">See how we grade →</a></p>
      </div>
    </div>
  </main>

  <footer class="site-footer">
    <p><strong>DoubleTrouble Golf</strong> — twice the balls, half the price.</p>
  </footer>

  <script>
    function buy() {
      try {
        var c = JSON.parse(localStorage.getItem("dtg-cart") || "{}");
        if (!c || typeof c !== "object") c = {};
        c[${JSON.stringify(p.id)}] = (c[${JSON.stringify(p.id)}] || 0) + 1;
        localStorage.setItem("dtg-cart", JSON.stringify(c));
        if (window.dtgTrack) window.dtgTrack("AddToCart", { value: ${p.pricePerDozen}, currency: "USD", content_name: ${JSON.stringify(p.brand + " " + p.name)} });
      } catch (e) {}
      location.href = "/#cart";
    }
  </script>
</body>
</html>
`;
}

function gradeBlurb(grade) {
  if (grade === "Mint") return "the ball looks brand new, with no visible wear.";
  if (grade === "Near Mint") return "the ball plays like new with only the faintest scuff.";
  if (grade === "Good") return "the ball has some cosmetic marks but flies straight and true.";
  return "a great-value used ball.";
}

// --- write product pages ---
const entries = PRODUCTS.map((p) => ({ p, slug: slugFor(p) }));
let written = 0;
for (const { p, slug } of entries) {
  const dir = path.join(ROOT, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), productPage(p));
  written++;
}

// --- sitemap.xml ---
// Hand-built static pages (not generated from products) that should be indexed.
const STATIC_PAGES = [
  "rescue-drop",
  "guides",
  "guides/are-used-golf-balls-as-good-as-new",
  "guides/pro-v1-vs-pro-v1x",
];
const urls = [
  `${SITE}/`,
  ...STATIC_PAGES.map((s) => `${SITE}/${s}/`),
  ...entries.map((e) => `${SITE}/${e.slug}/`),
];
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url>\n    <loc>${u}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`).join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);

// --- feed.xml (Google Merchant Center) ---
const items = entries
  .map(({ p, slug }) => {
    const brand = feedBrand(p);
    const titleName = isBundle(p) ? p.name : `Used ${p.brand} ${p.name} Golf Balls${p.grade ? " - " + p.grade : ""}`;
    return `    <item>
      <g:id>${esc(p.id)}</g:id>
      <g:title>${esc(titleName)}</g:title>
      <g:description>${esc(p.blurb)}</g:description>
      <g:link>${SITE}/${slug}/</g:link>
      <g:image_link>${SITE}/${esc(p.image || `images/products/${p.id}.jpg`)}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:condition>used</g:condition>
      <g:price>${p.pricePerDozen.toFixed(2)} USD</g:price>
      <g:brand>${esc(brand)}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
  })
  .join("\n");
const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>DoubleTrouble Golf</title>
    <link>${SITE}/</link>
    <description>Hand-graded used golf balls, shipped free.</description>
${items}
  </channel>
</rss>
`;
fs.writeFileSync(path.join(ROOT, "feed.xml"), feed);

// --- inject internal links into index.html ---
const linksHtml = entries
  .map(({ p, slug }) => {
    const label = isBundle(p) ? p.name : `Used ${p.brand} ${p.name}`;
    return `      <li><a href="/${slug}/">${esc(label)}</a></li>`;
  })
  .join("\n");
const indexPath = path.join(ROOT, "index.html");
let index = fs.readFileSync(indexPath, "utf8");
index = index.replace(
  /<!--PRODUCT_LINKS_START-->[\s\S]*?<!--PRODUCT_LINKS_END-->/,
  `<!--PRODUCT_LINKS_START-->\n${linksHtml}\n      <!--PRODUCT_LINKS_END-->`
);
fs.writeFileSync(indexPath, index);

console.log(`Generated ${written} product pages, sitemap.xml (${urls.length} urls), feed.xml, and homepage links.`);
