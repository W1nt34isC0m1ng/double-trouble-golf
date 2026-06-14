// ============================================================
// DoubleTrouble Golf — product list
//
// This is YOUR file to edit! Each ball pack is one { ... } block.
// Fields:
//   id            - unique nickname, lowercase-with-dashes, never repeat one
//   brand         - must match a brand in the shop filter (Titleist, Callaway,
//                   TaylorMade, Bridgestone, Srixon, Mixed)
//   name          - the ball model shown on the card
//   grade         - "Mint", "Near Mint", or "Good" (see grading guide)
//   pricePerDozen - price in dollars for 12 balls
//   blurb         - one fun sentence about the ball
//   accent        - card stripe color (any CSS color)
//   image         - OPTIONAL: path to a photo, e.g. "images/prov1.jpg".
//                   Leave it out and the card shows our golf-ball drawing.
// ============================================================

const PRODUCTS = [
  {
    id: "titleist-prov1-mint",
    brand: "Titleist",
    name: "Pro V1",
    grade: "Mint",
    pricePerDozen: 23,
    blurb: "The #1 ball in golf, fished out looking brand new.",
    accent: "#1b5e3b",
  },
  {
    id: "titleist-prov1x-near-mint",
    brand: "Titleist",
    name: "Pro V1x",
    grade: "Near Mint",
    pricePerDozen: 19,
    blurb: "Tour-level spin with maybe one tiny scuff. Maybe.",
    accent: "#0e3d25",
  },
  {
    id: "callaway-chromesoft-mint",
    brand: "Callaway",
    name: "Chrome Soft",
    grade: "Mint",
    pricePerDozen: 22,
    blurb: "Soft feel, big distance, zero excuses.",
    accent: "#d94f3d",
  },
  {
    id: "callaway-supersoft-near-mint",
    brand: "Callaway",
    name: "Supersoft",
    grade: "Near Mint",
    pricePerDozen: 13,
    blurb: "Easy to hit, easy on your wallet.",
    accent: "#e8884f",
  },
  {
    id: "taylormade-tp5-mint",
    brand: "TaylorMade",
    name: "TP5",
    grade: "Mint",
    pricePerDozen: 22,
    blurb: "Five layers of fancy. Played once, lost once, found by us.",
    accent: "#2b5ea7",
  },
  {
    id: "taylormade-tourresponse-near-mint",
    brand: "TaylorMade",
    name: "Tour Response",
    grade: "Near Mint",
    pricePerDozen: 15,
    blurb: "Tour ball feel without the tour ball price.",
    accent: "#5a8fd4",
  },
  {
    id: "bridgestone-tourbxs-near-mint",
    brand: "Bridgestone",
    name: "Tour B XS",
    grade: "Near Mint",
    pricePerDozen: 17,
    blurb: "Tiger plays this one. Now you can too, for way less.",
    accent: "#b03030",
  },
  {
    id: "srixon-zstar-mint",
    brand: "Srixon",
    name: "Z-Star",
    grade: "Mint",
    pricePerDozen: 21,
    blurb: "A spin machine that looks fresh out of the sleeve.",
    accent: "#caa53d",
  },
  {
    id: "srixon-softfeel-good",
    brand: "Srixon",
    name: "Soft Feel",
    grade: "Good",
    pricePerDozen: 11,
    blurb: "A few battle scars, still flies straight and true.",
    accent: "#7a9c5e",
  },
  {
    id: "mixed-premium-good",
    brand: "Mixed",
    name: "Premium Grab Bag",
    grade: "Good",
    pricePerDozen: 13,
    blurb: "A dozen surprise tour balls — Pro V1s, TP5s, who knows!",
    accent: "#8a5fb0",
  },
  {
    id: "mixed-practice-good",
    brand: "Mixed",
    name: "Practice Pack",
    grade: "Good",
    pricePerDozen: 10,
    blurb: "Perfect for the range, the backyard, or that water hole.",
    accent: "#6b7280",
  },
  {
    id: "mixed-shag-near-mint",
    brand: "Mixed",
    name: "Mystery Dozen",
    grade: "Near Mint",
    pricePerDozen: 14,
    blurb: "Twelve nice balls, twelve brands of luck. Double the fun.",
    accent: "#3aa6a0",
  },
];

// Let the checkout serverless function import this same list in Node, so the
// price a customer is charged always matches the price shown in the shop.
// (Ignored by the browser, which loads this file as a plain <script>.)
if (typeof module !== "undefined" && module.exports) {
  module.exports = PRODUCTS;
}
