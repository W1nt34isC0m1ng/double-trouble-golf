# DoubleTrouble Golf — Website Design Spec

**Date:** 2026-06-12
**Status:** Approved by default (autonomous build under /goal directive)

## Purpose

A sales website for DoubleTrouble Golf, a used golf ball resale business run by
12-year-old twins. Customers browse recovered/cleaned golf balls, add them to a
cart, and place an order. The site must be free to host and simple enough for
the twins (with parent help) to maintain.

## Constraints

- **Owners are minors.** No real payment processing: checkout composes an order
  email (mailto) the customer sends. Payment is settled person-to-person
  (cash, or a parent-managed option later). This avoids any merchant-account,
  legal, or PCI requirements.
- **Zero build step, zero dependencies.** Plain HTML/CSS/JS so it deploys to
  GitHub Pages or Netlify as-is, and a kid can edit it.
- **Product data lives in one file** (`products.js`) the twins can edit without
  touching layout code.

## Approaches considered

1. **Static HTML/CSS/vanilla JS + data file (chosen).** Free hosting, no
   accounts/dependencies, trivially maintainable.
2. React/Vite SPA — rejected: build tooling and npm churn for no benefit at
   this scale.
3. Shopify/Big Cartel template — rejected: monthly cost, requires adult
   merchant setup, can't be built/version-controlled here.

## Site structure (single page, `index.html`)

1. **Header / nav** — logo wordmark, links that scroll to sections, cart button
   with item count.
2. **Hero** — business name, tagline ("Twice the balls, half the price"),
   call-to-action to shop.
3. **Shop** — product card grid rendered by JS from `products.js`. Filters:
   brand (All/Titleist/Callaway/TaylorMade/Bridgestone/Srixon/Mixed) and
   condition grade. Each card: ball name, grade badge, price per dozen,
   "Add to cart".
4. **Grading guide** — explains Mint (5A), Near Mint (4A), Good (3A) grades.
5. **Our story** — the twins, how they recover/clean balls.
6. **How ordering works** — 3 steps: pick balls → send order email → arrange
   pickup/delivery and pay.
7. **FAQ + contact** — footer with email link.

## Cart & checkout

- Client-side cart stored in `localStorage` (survives reload).
- Cart drawer: line items with quantity +/- controls, remove, running total.
- "Place order" opens a `mailto:` link to the business email with a prefilled
  subject and plain-text order summary (items, quantities, total, buyer fills
  in name/pickup preference). Business email is a single constant in
  `app.js` (placeholder `orders@doubletroublegolf.example` until the parent
  supplies a real address).

## Data model (`products.js`)

```js
const PRODUCTS = [
  { id: "titleist-prov1-mint", brand: "Titleist", name: "Pro V1",
    grade: "Mint", pricePerDozen: 18, blurb: "...", emoji/colorway },
  ...
];
```

Grades: `Mint`, `Near Mint`, `Good`. Prices are per dozen. ~10–12 SKUs at
launch covering the major brands plus budget mixed bags. No photos at launch —
cards use a styled golf-ball graphic (pure CSS) so the site looks finished
without requiring photography; an optional `image` field is supported for when
the twins add real photos.

## Visual design

- Golf-course palette: deep fairway green, cream/off-white, sand bunker accent,
  flag-red highlights. Rounded, friendly, slightly playful (kid-run business is
  part of the brand) but clean enough to look trustworthy.
- "Double" branding motif: twin golf balls in the logo, doubles deals copy.
- Responsive: grid collapses to one column on phones; cart drawer becomes
  full-width sheet.
- System font stack + one Google-fonts-free fallback approach (no external
  requests required for the site to work offline).

## Files

```
index.html      — all markup/sections
css/style.css   — all styles
js/products.js  — PRODUCTS array (the file the twins edit)
js/app.js       — render shop grid, filters, cart, mailto checkout
README.md       — how to edit products, change the email, deploy free
```

## Error handling

- Cart code defensively handles corrupt/absent localStorage (falls back to
  empty cart).
- Unknown product ids in a saved cart are dropped on load.
- Empty cart disables "Place order".

## Testing / verification

- No test framework (static site). Verification: serve locally, load in a
  real browser, confirm zero console errors, exercise filters, add/remove
  cart items across reload, and confirm the mailto link encodes a correct
  order summary.
