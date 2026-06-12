// Unit tests for the pure cart helpers. Run: node --test
const { test } = require("node:test");
const assert = require("node:assert");
const { buildLineItems } = require("./cart");

const PRODUCTS = [
  { id: "ball-a", brand: "Titleist", name: "Pro V1", grade: "Mint", pricePerDozen: 20 },
  { id: "ball-b", brand: "Mixed", name: "Practice Pack", grade: "Good", pricePerDozen: 6 },
];

test("builds Stripe line_items from a valid cart", () => {
  const items = buildLineItems({ "ball-a": 2, "ball-b": 1 }, PRODUCTS);
  assert.strictEqual(items.length, 2);

  const a = items.find((i) => i.price_data.product_data.name.includes("Pro V1"));
  assert.strictEqual(a.quantity, 2);
  assert.strictEqual(a.price_data.currency, "usd");
  assert.strictEqual(a.price_data.unit_amount, 2000); // $20 in cents
  assert.strictEqual(a.price_data.product_data.name, "Titleist Pro V1 (Mint)");

  const b = items.find((i) => i.price_data.product_data.name.includes("Practice"));
  assert.strictEqual(b.quantity, 1);
  assert.strictEqual(b.price_data.unit_amount, 600);
});

test("drops unknown product ids but keeps valid ones", () => {
  const items = buildLineItems({ "ball-a": 1, "ghost-ball": 9 }, PRODUCTS);
  assert.strictEqual(items.length, 1);
  assert.strictEqual(items[0].price_data.product_data.name, "Titleist Pro V1 (Mint)");
});

test("throws when the cart is empty", () => {
  assert.throws(() => buildLineItems({}, PRODUCTS), /empty/i);
});

test("throws when every id is unknown", () => {
  assert.throws(() => buildLineItems({ "ghost-ball": 3 }, PRODUCTS), /empty|no valid/i);
});

test("rejects non-integer or non-positive quantities", () => {
  assert.throws(() => buildLineItems({ "ball-a": 0 }, PRODUCTS), /quantity/i);
  assert.throws(() => buildLineItems({ "ball-a": -2 }, PRODUCTS), /quantity/i);
  assert.throws(() => buildLineItems({ "ball-a": 1.5 }, PRODUCTS), /quantity/i);
  assert.throws(() => buildLineItems({ "ball-a": "3" }, PRODUCTS), /quantity/i);
});

test("throws on a missing or non-object items map", () => {
  assert.throws(() => buildLineItems(null, PRODUCTS), /items/i);
  assert.throws(() => buildLineItems(undefined, PRODUCTS), /items/i);
});
