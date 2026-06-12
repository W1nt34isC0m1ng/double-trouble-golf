# DoubleTrouble Golf — Stripe Checkout Design Spec

**Date:** 2026-06-12
**Status:** Approved (user chose full Stripe checkout, US shipping, free shipping)
**Builds on:** 2026-06-12-double-trouble-golf-website-design.md

## Purpose

Replace the mailto order flow with real online card payment so customers can
buy used golf balls and have them shipped anywhere in the continental US.

## Decisions (from the user)

- **Payment:** Full online checkout via Stripe (hosted Checkout page).
- **Fulfilment:** Ship within the continental US — collect a US shipping
  address at checkout.
- **Shipping cost:** Free shipping, cost absorbed into per-dozen prices. No
  shipping line item; Stripe still collects the address.
- **Account ownership:** The Stripe account is owned by a parent/adult (18+,
  legally responsible). The twins run the shop; the adult owns the merchant
  relationship.

## Security constraints (non-negotiable)

- The **Stripe secret key never reaches the browser.** It lives only as a
  Netlify environment variable (`STRIPE_SECRET_KEY`), read by a serverless
  function. The assistant never enters or handles this key.
- **Prices are authoritative on the server.** The browser sends only product
  ids and quantities; the serverless function looks up real prices from the
  shared product data. A tampered client price can never be charged.
- **No card data touches our code.** Customers enter card details on Stripe's
  hosted Checkout page, keeping the site PCI-compliant by construction.

## Architecture

```
Browser cart ──POST {items:{id:qty}}──▶ Netlify Function
                                        create-checkout.js
                                          │ validate ids + qty
                                          │ build line_items from
                                          │   server-side prices
                                          │ create Stripe Checkout Session
                                          │   (mode=payment, US shipping,
                                          │    no shipping cost)
                                          ▼
Browser ◀──{ url }────────────────────────┘
   │ redirect
   ▼
Stripe-hosted Checkout (card entry) ──▶ success.html  (paid)
                                    └──▶ cancel.html   (abandoned)
```

## Files

```
data/ (none — see products note)
js/products.js                       — MODIFIED: isomorphic. Still the single
                                       friendly, commented file the twins edit.
                                       Adds a Node `module.exports` guard so the
                                       serverless function can import the SAME
                                       data (one source of truth for prices).
netlify/functions/lib/cart.js        — NEW: pure helpers. buildLineItems(items,
                                       products) → Stripe line_items; throws on
                                       empty/invalid. No Stripe import, no
                                       network → unit-testable.
netlify/functions/lib/cart.test.js   — NEW: node:test unit tests for cart.js.
netlify/functions/create-checkout.js — NEW: the handler. Lazy-requires stripe,
                                       imports products + cart lib, creates the
                                       Checkout Session, returns { url }.
js/app.js                            — MODIFIED: checkout() POSTs the cart to
                                       the function and redirects to Stripe.
                                       Replaces the mailto. Keeps ORDER_EMAIL
                                       for the footer contact link.
success.html                         — NEW: "Thanks! Your order is paid."
cancel.html                          — NEW: "Checkout cancelled."
netlify.toml                         — NEW: functions dir + esbuild bundler.
package.json                         — NEW: declares the `stripe` dependency.
README.md                            — MODIFIED: Stripe + git-deploy setup.
```

### Why products.js becomes isomorphic (not a JSON file)

The serverless function must charge the same prices the shop shows. The
simplest way to guarantee that without a build step is one file used by both
sides. `js/products.js` keeps its comment-rich, kid-editable array and gains:

```js
if (typeof module !== "undefined" && module.exports) module.exports = PRODUCTS;
```

In the browser it is still loaded via `<script>` (global `PRODUCTS`); in Node
the function does `require("../../js/products.js")`. The twins still edit one
file, and prices can never drift between shop and checkout.

## Serverless function contract

`POST /.netlify/functions/create-checkout`

Request body: `{ "items": { "<productId>": <qtyInteger>, ... } }`

- Validate: each id exists in PRODUCTS; qty is an integer ≥ 1. Drop/ignore
  unknown ids. If nothing valid remains → `400 { error }`.
- Build `line_items`: for each, `price_data` with `currency: "usd"`,
  `unit_amount: pricePerDozen * 100`, `product_data.name: "<brand> <name>
  (<grade>)"`, and `quantity`.
- Create session: `mode: "payment"`, `line_items`,
  `shipping_address_collection: { allowed_countries: ["US"] }`,
  `success_url`/`cancel_url` built from the request origin,
  `automatic_tax` left off (out of scope for v1).
- Response: `200 { url }` (the Stripe-hosted Checkout URL).
- Errors: missing `STRIPE_SECRET_KEY` → `500`; Stripe error → `502` with a
  generic message (no internals leaked).

Note: Stripe Checkout restricts to country level. `allowed_countries: ["US"]`
covers the continental US but also technically allows AK/HI; excluding those
specific states is out of scope for v1 and can be handled manually.

## Client changes (`js/app.js`)

`checkout()` becomes async:

1. If cart empty, return.
2. Set button to a "Starting checkout…" disabled state.
3. `POST` `{ items: cart }` to the function.
4. On `{ url }`, `window.location = url`.
5. On any failure, re-enable the button and show an inline error in the cart
   footer ("Sorry — checkout couldn't start. Please try again.").

The `localStorage` cart is intentionally **not** cleared here; it clears when
the customer returns to `success.html` (which removes `dtg-cart`).

## Deployment changes

Serverless functions require a real build (npm install + function bundling),
which Netlify Drop does not do reliably. The site moves to **git-connected
continuous deployment**:

- Connect the Netlify project to a GitHub repo of this codebase.
- Netlify builds on every push and bundles the function (with the `stripe`
  dependency) automatically. Future updates deploy on `git push` — no more
  drag-and-drop.
- The adult sets `STRIPE_SECRET_KEY` in Netlify → Site configuration →
  Environment variables. The publishable key is not needed for hosted
  Checkout (only for embedded card elements, which we are not using).

## Testing / verification

- **Unit (automated):** `node --test netlify/functions/lib/cart.test.js`
  covers buildLineItems: valid cart → correct cents + names + quantities;
  unknown ids dropped; empty/all-invalid throws; non-integer/zero qty rejected.
- **Syntax:** `node --check` on the function and isomorphic products file;
  confirm `require("./js/products.js")` returns the array in Node.
- **Client:** serve locally, confirm the shop + cart still render with zero
  console errors and that `checkout()` posts to the function endpoint (the
  function itself needs `netlify dev` + a Stripe test key to fully exercise —
  documented for the adult, not run by the assistant).
- **Live (adult, post-deploy):** with Stripe in test mode, a card like
  `4242 4242 4242 4242` completes a test order and lands on success.html.
