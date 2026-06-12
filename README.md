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

## Set the real order email (important!)

Orders are sent to the address at the top of **`js/app.js`**:

```js
const ORDER_EMAIL = "orders@doubletroublegolf.example";
```

Change it to the real business email (a parent-supervised inbox is a good
idea) before sharing the site.

## Put it on the internet for free

### Option A: Netlify Drop (easiest, ~2 minutes)

1. Go to <https://app.netlify.com/drop>
2. Drag this whole folder onto the page.
3. That's it — Netlify gives you a link like `something.netlify.app`.
   Create a free account to keep the site and rename the link.

### Option B: GitHub Pages

1. Create a free account at <https://github.com> (a parent should do this).
2. Create a new repository called `double-trouble-golf` and upload these
   files (or `git push` if you're comfortable with git).
3. In the repo: **Settings → Pages → Source: Deploy from a branch**, pick
   `main` and `/ (root)`, save.
4. After a minute the site is live at
   `https://<your-username>.github.io/double-trouble-golf/`.

Either way, updating the site later = edit `js/products.js` and re-upload
(or re-drag, or re-push).

## What's where

| File | What it does |
| --- | --- |
| `index.html` | All the words and page sections |
| `css/style.css` | All the colors and layout |
| `js/products.js` | **The product list — the file you'll edit most** |
| `js/app.js` | Shop grid, filters, cart, and the order email button |
