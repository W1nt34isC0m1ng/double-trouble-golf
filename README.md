# DoubleTrouble Golf 🏌️🏌️

The website for DoubleTrouble Golf — quality used golf balls, recovered and
graded by twins. Twice the balls, half the price.

It's a plain HTML/CSS/JavaScript site: no installs, no build step, free to
host. Customers fill a cart and place their order by email; payment happens
in person at pickup or delivery, so no online payment setup is needed.

## Try it locally

From this folder, run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

## How to update the products (the fun part)

Everything for sale lives in **`js/products.js`**. Each ball pack looks like
this:

```js
{
  id: "titleist-prov1-mint",   // unique nickname, lowercase-with-dashes
  brand: "Titleist",           // Titleist, Callaway, TaylorMade, Bridgestone, Srixon, or Mixed
  name: "Pro V1",              // shown big on the card
  grade: "Mint",               // "Mint", "Near Mint", or "Good"
  pricePerDozen: 20,           // dollars for 12 balls
  blurb: "The #1 ball in golf...", // one fun sentence
  accent: "#1b5e3b",           // the card's color stripe
},
```

- **To change a price:** edit `pricePerDozen` and save. Done.
- **To add a product:** copy a whole `{ ... },` block, paste it below, and
  change the fields. Make sure the `id` is new.
- **To remove a product:** delete its `{ ... },` block.
- **To add a photo:** put the picture in an `images/` folder and add a line
  like `image: "images/my-ball.jpg",` to that product. Without a photo the
  card shows the drawn golf ball, which also looks great.

Refresh the page in your browser to see the changes.

## The contact email

The footer contact link uses the address at the top of **`js/app.js`**:

```js
const ORDER_EMAIL = "orders@doubletroublegolf.com";
```

This is just the "email us" link in the footer — orders themselves are paid by
card through Stripe (see below), not by email.

## Card checkout with Stripe

Customers add golf balls to the cart and pay by card. Card details are entered
on Stripe's own secure page — they never touch this website — and shipping is
free anywhere in the continental US (the cost is built into the per-dozen
prices). When someone checks out:

1. The browser sends the cart (product ids + quantities) to a small serverless
   function, `netlify/functions/create-checkout.js`.
2. That function prices the order from `js/products.js` on the server (so the
   price charged always matches the shop) and asks Stripe to create a checkout
   page.
3. The customer is sent to Stripe to pay, then back to `success.html`.

### One-time Stripe setup (a parent must do this)

Stripe requires an account holder who is 18+, so **a parent owns the Stripe
account**; the twins run the shop.

1. Create a free account at <https://stripe.com>.
2. In the Stripe Dashboard, go to **Developers → API keys** and copy the
   **Secret key** (starts with `sk_`). Keep it private — it can move money.
3. Add it to Netlify (see deploy step below) as an environment variable named
   `STRIPE_SECRET_KEY`. **Never put this key in the website files or commit it
   to git.**
4. Test with Stripe in **test mode** first using card `4242 4242 4242 4242`,
   any future expiry, any CVC. Flip Stripe to live mode when you're ready for
   real orders.

## Put it on the internet

Because of the Stripe checkout function, the site needs Netlify's
**git-connected deploys** (drag-and-drop can't run the function). One-time
setup:

1. Create a free account at <https://github.com> (a parent should do this) and
   push this project to a new repository called `double-trouble-golf`.
2. At <https://app.netlify.com>, **Add new project → Import an existing
   project**, pick the GitHub repo, and deploy (no build command needed — the
   `netlify.toml` already tells Netlify what to do).
3. In Netlify, go to **Site configuration → Environment variables** and add
   `STRIPE_SECRET_KEY` with the secret key from Stripe.
4. Trigger a redeploy so the key takes effect.

After this, **updating the site = `git push`** — Netlify rebuilds and
redeploys automatically. (The custom domain `doubletroublegolf.com` is already
pointed at this Netlify project.)

## Traffic counter & Facebook/Instagram ad tracking

Analytics are **off until you add your IDs** — the site runs the same with them
blank. Both IDs live at the top of **`js/tracking.js`**:

```js
const META_PIXEL_ID = "";       // Facebook/Meta Pixel ID
const CLOUDFLARE_TOKEN = "";     // Cloudflare Web Analytics token
```

**Free traffic counter (Cloudflare Web Analytics):**
1. Create a free account at <https://dash.cloudflare.com>, go to **Analytics &
   Logs → Web Analytics → Add a site**, enter `doubletroublegolf.com`.
2. It shows a snippet containing a `token`. Copy just that token into
   `CLOUDFLARE_TOKEN`, then `git push`.
3. You'll see visits, page views, top pages, and where traffic comes from — no
   cookie banner needed.

**Facebook/Instagram ad tracking (Meta Pixel):**
1. In **Meta Events Manager** (<https://business.facebook.com/events_manager>),
   create a pixel and copy its numeric **Pixel ID** into `META_PIXEL_ID`, then
   `git push`.
2. Every page now reports a **PageView**, and the thank-you page fires a
   **Purchase** event with the real order amount (looked up securely from
   Stripe). That lets Meta optimize your ad for actual sales and show you
   return on ad spend.
3. In your ad, set the conversion goal to **Purchase** to use it.

## Running and testing locally

- Preview the pages: `python3 -m http.server 8000`, then open
  <http://localhost:8000>. (The checkout button needs the function, so it won't
  complete a payment from this simple preview.)
- Test the full checkout locally: install the Netlify CLI (`npm i -g
  netlify-cli`), then `STRIPE_SECRET_KEY=sk_test_... netlify dev`.
- Run the automated tests: `npm test`.

## What's where

| File | What it does |
| --- | --- |
| `index.html` | All the words and page sections |
| `css/style.css` | All the colors and layout |
| `js/products.js` | **The product list — the file you'll edit most** |
| `js/app.js` | Shop grid, filters, cart, and the checkout button |
| `js/tracking.js` | **Traffic counter + Meta Pixel IDs go here** |
| `netlify/functions/create-checkout.js` | Creates the Stripe payment page |
| `netlify/functions/lib/cart.js` | Prices the cart (shared, tested logic) |
| `netlify/functions/order-summary.js` | Order total for the Purchase event |
| `success.html` / `cancel.html` | Shown after paying / cancelling |
| `netlify.toml`, `package.json` | Tell Netlify how to build the function |
