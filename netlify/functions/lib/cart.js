// Pure cart helpers — no Stripe import, no network, so they're easy to unit
// test. The serverless handler uses these to turn a {id: qty} cart into the
// line_items Stripe expects, pricing everything from authoritative server-side
// product data (never trusting prices sent by the browser).

/**
 * Turn a cart map into Stripe Checkout line_items.
 * @param {Object<string, number>} items  - { productId: quantity }
 * @param {Array} products                - the PRODUCTS array (source of truth)
 * @returns {Array} Stripe line_items
 * @throws if items is not an object, a quantity is invalid, or nothing valid remains
 */
function buildLineItems(items, products) {
  if (!items || typeof items !== "object" || Array.isArray(items)) {
    throw new Error("items must be an object mapping product ids to quantities");
  }

  const byId = new Map(products.map((p) => [p.id, p]));
  const lineItems = [];

  for (const [id, qty] of Object.entries(items)) {
    const product = byId.get(id);
    if (!product) continue; // silently drop unknown ids

    if (typeof qty !== "number" || !Number.isInteger(qty) || qty < 1) {
      throw new Error(`Invalid quantity for ${id}: must be a whole number >= 1`);
    }

    lineItems.push({
      quantity: qty,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(product.pricePerDozen * 100), // dollars -> cents
        product_data: {
          name: `${product.brand} ${product.name} (${product.grade})`,
        },
      },
    });
  }

  if (lineItems.length === 0) {
    throw new Error("Cart is empty — no valid items to check out");
  }

  return lineItems;
}

module.exports = { buildLineItems };
