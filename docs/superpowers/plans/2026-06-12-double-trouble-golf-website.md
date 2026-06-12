# DoubleTrouble Golf Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete DoubleTrouble Golf single-page used-golf-ball sales site per the 2026-06-12 design spec.

**Architecture:** Static single-page site. `index.html` holds all section markup; `js/products.js` exports a global `PRODUCTS` array (the twins' edit surface); `js/app.js` renders the shop grid, filters, and a localStorage cart with mailto checkout; `css/style.css` holds all styling. No build step, no dependencies, no test framework — verification is in a real browser.

**Tech Stack:** HTML5, CSS3, vanilla ES2017 JavaScript, localStorage, mailto checkout.

---

### Task 1: Product data (`js/products.js`)

**Files:**
- Create: `js/products.js`

- [x] **Step 1: Create the PRODUCTS array.** Global `const PRODUCTS` with 12 SKUs covering Titleist (Pro V1, Pro V1x), Callaway (Chrome Soft, Supersoft), TaylorMade (TP5, Tour Response), Bridgestone (Tour B XS), Srixon (Z-Star, Soft Feel), and three Mixed bags. Each item: `id` (kebab-case, unique), `brand`, `name`, `grade` ("Mint" | "Near Mint" | "Good"), `pricePerDozen` (number), `blurb` (one sentence), `accent` (CSS color hint for the card's ball graphic). Prices: Mint premium balls $15–20/dozen, Near Mint $10–14, Good/mixed $6–9 — realistic used-ball market prices.
- [x] **Step 2: Commit** — `git add js/products.js && git commit -m "feat: add product catalog data"`

### Task 2: Markup (`index.html`)

**Files:**
- Create: `index.html`

- [x] **Step 1: Write the full page markup.** Sections in order, each with an `id` for nav anchors: sticky `header` (wordmark "DoubleTrouble Golf" with twin-ball logo, nav links Shop/Grading/Our Story/FAQ, cart button with `#cart-count` badge); `#hero` (h1, tagline "Twice the balls. Half the price.", shop CTA button); `#shop` (filter bar with brand `<select id="brand-filter">` and grade `<select id="grade-filter">`, empty `#product-grid` div populated by JS); `#grading` (3 cards explaining Mint/Near Mint/Good); `#story` (the twins' story); `#how` (3 ordered steps: pick → email order → pay at pickup/delivery); `#faq` (4–5 Q&As using `<details>`); `footer` with contact email link. Cart drawer markup: `<aside id="cart-drawer">` with `#cart-items` list, `#cart-total`, "Place order" `#checkout-btn`, close button, plus `#cart-overlay`. Scripts loaded at end of body: `js/products.js` then `js/app.js`.
- [x] **Step 2: Commit** — `git add index.html && git commit -m "feat: add page markup"`

### Task 3: Styles (`css/style.css`)

**Files:**
- Create: `css/style.css`

- [x] **Step 1: Write all styles.** CSS custom properties for the palette (fairway green `#1b5e3b`, dark green `#0e3d25`, cream `#faf6ec`, sand `#e8c97e`, flag red `#d94f3d`). System font stack. Pure-CSS golf-ball graphic for product cards (radial-gradient sphere + dimple pattern via `radial-gradient` background-image repeat, brand `accent` ring). Card grid `repeat(auto-fill, minmax(240px, 1fr))`. Grade badges color-coded. Cart drawer fixed right, transform-translated off-canvas, `.open` class slides in; overlay dims page. Sticky header. Single column + full-width drawer under 640px. `details` FAQ styling.
- [x] **Step 2: Commit** — `git add css/style.css && git commit -m "feat: add site styles"`

### Task 4: App logic (`js/app.js`)

**Files:**
- Create: `js/app.js`

- [x] **Step 1: Implement rendering and cart.** Constants: `ORDER_EMAIL = "orders@doubletroublegolf.example"` (top of file, commented as the thing to change), `CART_KEY = "dtg-cart"`. Functions:
  - `loadCart()` — parse localStorage, return `{}` on any error, drop ids not in PRODUCTS.
  - `saveCart(cart)` — persist + call `renderCart()` and badge update.
  - `renderProducts()` — filter PRODUCTS by the two selects, build cards (ball graphic div styled with `--accent`, name, brand, grade badge, `$X/dozen`, Add to cart button wired to `addToCart(id)`). Empty result shows a friendly "no balls match" message.
  - `addToCart(id)` / `changeQty(id, delta)` (delta to 0 removes) / cart drawer open/close (button, overlay click, Escape).
  - `renderCart()` — line items with − qty + controls, per-line subtotal, total; disable `#checkout-btn` when empty.
  - `checkout()` — build plain-text order summary (one line per item: qty × dozen brand name (grade) — $subtotal; total line; blank fields for buyer name / pickup or delivery), open `mailto:${ORDER_EMAIL}?subject=...&body=...` via `encodeURIComponent`.
  - Init on `DOMContentLoaded`: wire filters, render, restore cart.
- [x] **Step 2: Commit** — `git add js/app.js && git commit -m "feat: add shop and cart logic"`

### Task 5: README

**Files:**
- Create: `README.md`

- [x] **Step 1: Write README** for the twins/parent: what the site is; how to change products (edit `js/products.js`, field-by-field explanation); how to set the real order email (the `ORDER_EMAIL` constant in `js/app.js`); how to preview locally (`python3 -m http.server`); how to deploy free (GitHub Pages and Netlify drop, step-by-step).
- [x] **Step 2: Commit** — `git add README.md && git commit -m "docs: add maintenance and deploy guide"`

### Task 6: Browser verification

- [x] **Step 1: Serve** — `python3 -m http.server 8765` from repo root (background).
- [x] **Step 2: Verify in browser** at `http://localhost:8765`: zero console errors; product grid renders all 12 SKUs; brand + grade filters narrow the grid; add to cart updates badge; drawer shows items, qty +/- works, total correct; reload preserves cart; checkout button href/mailto contains correctly encoded summary; empty cart disables checkout. Check mobile width (resize ~375px) for single-column layout.
- [x] **Step 3: Fix anything found, re-verify, commit fixes.**

## Self-review notes

- Spec coverage: all spec sections (header/hero/shop/grading/story/how/faq/footer, cart, mailto, data model, README, error handling, verification) map to Tasks 1–6. Optional `image` field: cards render the CSS ball when `image` absent — covered in Task 4 card builder.
- Names used consistently: `PRODUCTS`, `ORDER_EMAIL`, `loadCart/saveCart/renderProducts/renderCart/addToCart/changeQty/checkout`, ids `#product-grid #brand-filter #grade-filter #cart-drawer #cart-items #cart-total #cart-count #checkout-btn #cart-overlay`.
