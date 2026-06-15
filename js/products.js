// ============================================================
// DoubleTrouble Golf — product list
//
// This is YOUR file to edit! Each item is one { ... } block.
// Fields:
//   id            - unique nickname, lowercase-with-dashes, never repeat one
//   brand         - Titleist, TaylorMade, Mixed, etc. (shows on the card)
//   name          - the product name shown on the card
//   grade         - "Mint", "Near Mint", "Good", or "" (no badge)
//   unit          - what one item is: "box" (a 2-dozen box) or "dozen"
//   pricePerDozen - the price for ONE unit, in dollars
//   blurb         - one fun sentence
//   accent        - card stripe color (any CSS color)
//   image         - OPTIONAL: photo path, e.g. "images/products/prov1-2dz.jpg"
//   slug          - OPTIONAL: SEO URL for the product page (e.g. "used-pro-v1-golf-balls")
//   pageTitle     - OPTIONAL: SEO <title> for the product page
//
// After editing, run `npm run generate` to rebuild the product pages,
// sitemap, and Google feed.
// ============================================================

const PRODUCTS = [
  {
    id: "rescue-box",
    brand: "Best value",
    name: "The Rescue Box",
    grade: "",
    unit: "box",
    pricePerDozen: 29,
    blurb:
      "This week's Rescue Drop: 2 dozen hand-graded premium balls (Pro V1, TP5, Chrome Soft & more), shipped free.",
    accent: "#caa53d",
  },
  {
    id: "prov1-2dz",
    brand: "Titleist",
    name: "Pro V1 — 2 Dozen",
    grade: "",
    unit: "box",
    pricePerDozen: 50,
    blurb:
      "Two dozen hand-graded Titleist Pro V1s — the #1 ball in golf, in Near Mint / Mint shape. Free shipping.",
    accent: "#1b5e3b",
    image: "images/products/prov1-2dz.jpg",
    slug: "used-pro-v1-golf-balls",
    pageTitle: "Used Titleist Pro V1 Golf Balls (2 Dozen) | DoubleTrouble Golf",
  },
  {
    id: "prov1x-2dz",
    brand: "Titleist",
    name: "Pro V1x — 2 Dozen",
    grade: "",
    unit: "box",
    pricePerDozen: 50,
    blurb:
      "Two dozen hand-graded Titleist Pro V1x — higher flight, more spin, in Near Mint / Mint shape. Free shipping.",
    accent: "#0e3d25",
    slug: "used-pro-v1x-golf-balls",
    pageTitle: "Used Titleist Pro V1x Golf Balls (2 Dozen) | DoubleTrouble Golf",
  },
  {
    id: "tp5-2dz",
    brand: "TaylorMade",
    name: "TP5 / TP5x — 2 Dozen",
    grade: "",
    unit: "box",
    pricePerDozen: 50,
    blurb:
      "Two dozen hand-graded TaylorMade TP5 & TP5x tour balls in Near Mint / Mint shape. Free shipping.",
    accent: "#2b5ea7",
    slug: "used-taylormade-tp5-golf-balls",
    pageTitle: "Used TaylorMade TP5 & TP5x Golf Balls (2 Dozen) | DoubleTrouble Golf",
  },
  {
    id: "value-mix-2dz",
    brand: "Mixed",
    name: "Value Mix — 2 Dozen",
    grade: "",
    unit: "box",
    pricePerDozen: 40,
    blurb:
      "Two dozen assorted brands (Chrome Soft, Tour B, Z-Star, Supersoft, Kirkland, Maxfli & more) in great playable shape. No sorting, all value.",
    accent: "#8a5fb0",
    slug: "used-golf-balls-value-mix",
    pageTitle: "Cheap Used Golf Balls — Value Mix, 2 Dozen | DoubleTrouble Golf",
  },
];

// Let the checkout serverless function import this same list in Node, so the
// price a customer is charged always matches the price shown in the shop.
// (Ignored by the browser, which loads this file as a plain <script>.)
if (typeof module !== "undefined" && module.exports) {
  module.exports = PRODUCTS;
}
