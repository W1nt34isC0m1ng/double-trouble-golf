// ============================================================
// DoubleTrouble Golf — shop & cart logic
//
// >>> CHANGE THIS to the real business email before going live! <<<
const ORDER_EMAIL = "orders@doubletroublegolf.example";
// ============================================================

const CART_KEY = "dtg-cart";

// cart shape: { [productId]: quantity }
let cart = {};

function productById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY));
    if (!raw || typeof raw !== "object") return {};
    const clean = {};
    for (const [id, qty] of Object.entries(raw)) {
      if (productById(id) && Number.isInteger(qty) && qty > 0) clean[id] = qty;
    }
    return clean;
  } catch {
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    // private browsing or full storage — cart still works for this visit
  }
  renderCart();
}

function cartCount() {
  return Object.values(cart).reduce((sum, q) => sum + q, 0);
}

function cartTotal() {
  return Object.entries(cart).reduce(
    (sum, [id, qty]) => sum + productById(id).pricePerDozen * qty,
    0
  );
}

// ---------- Shop grid ----------

function gradeClass(grade) {
  return "grade-" + grade.toLowerCase().replace(/\s+/g, "-");
}

function renderProducts() {
  const brand = document.getElementById("brand-filter").value;
  const grade = document.getElementById("grade-filter").value;
  const grid = document.getElementById("product-grid");

  const matches = PRODUCTS.filter(
    (p) =>
      (brand === "All" || p.brand === brand) &&
      (grade === "All" || p.grade === grade)
  );

  grid.innerHTML = "";

  if (matches.length === 0) {
    const msg = document.createElement("p");
    msg.className = "empty-msg";
    msg.textContent = "No balls match those filters — try widening your search!";
    grid.appendChild(msg);
    return;
  }

  for (const p of matches) {
    const card = document.createElement("article");
    card.className = "product-card";

    const art = document.createElement("div");
    art.className = "card-art";
    art.style.setProperty("--accent", p.accent || "");
    if (p.image) {
      const img = document.createElement("img");
      img.src = p.image;
      img.alt = `${p.brand} ${p.name}`;
      art.appendChild(img);
    } else {
      const ball = document.createElement("div");
      ball.className = "card-ball";
      art.appendChild(ball);
    }

    const body = document.createElement("div");
    body.className = "card-body";

    const brandEl = document.createElement("span");
    brandEl.className = "card-brand";
    brandEl.textContent = p.brand;

    const name = document.createElement("h3");
    name.className = "card-name";
    name.textContent = p.name;

    const badge = document.createElement("span");
    badge.className = "grade-badge " + gradeClass(p.grade);
    badge.textContent = p.grade;

    const blurb = document.createElement("p");
    blurb.className = "card-blurb";
    blurb.textContent = p.blurb;

    const priceRow = document.createElement("div");
    priceRow.className = "card-price-row";

    const price = document.createElement("span");
    price.className = "card-price";
    price.innerHTML = `$${p.pricePerDozen}<small>/dozen</small>`;

    const addBtn = document.createElement("button");
    addBtn.className = "add-btn";
    addBtn.textContent = "Add to cart";
    addBtn.addEventListener("click", () => addToCart(p.id));

    priceRow.append(price, addBtn);
    body.append(brandEl, name, badge, blurb, priceRow);
    card.append(art, body);
    grid.appendChild(card);
  }
}

// ---------- Cart ----------

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  openCart();
}

function changeQty(id, delta) {
  const next = (cart[id] || 0) + delta;
  if (next <= 0) delete cart[id];
  else cart[id] = next;
  saveCart();
}

function renderCart() {
  document.getElementById("cart-count").textContent = cartCount();

  const itemsEl = document.getElementById("cart-items");
  itemsEl.innerHTML = "";

  const entries = Object.entries(cart);
  if (entries.length === 0) {
    const empty = document.createElement("p");
    empty.className = "cart-empty";
    empty.textContent = "Your cart is empty. Go grab some balls!";
    itemsEl.appendChild(empty);
  }

  for (const [id, qty] of entries) {
    const p = productById(id);
    const line = document.createElement("div");
    line.className = "cart-line";

    const info = document.createElement("div");
    info.className = "cart-line-info";
    const nameEl = document.createElement("div");
    nameEl.className = "cart-line-name";
    nameEl.textContent = `${p.brand} ${p.name}`;
    const meta = document.createElement("div");
    meta.className = "cart-line-meta";
    meta.textContent = `${p.grade} • $${p.pricePerDozen}/dozen`;
    info.append(nameEl, meta);

    const controls = document.createElement("div");
    controls.className = "qty-controls";
    const minus = document.createElement("button");
    minus.className = "qty-btn";
    minus.textContent = "−";
    minus.setAttribute("aria-label", `Remove one dozen ${p.name}`);
    minus.addEventListener("click", () => changeQty(id, -1));
    const qtyEl = document.createElement("span");
    qtyEl.textContent = qty;
    const plus = document.createElement("button");
    plus.className = "qty-btn";
    plus.textContent = "+";
    plus.setAttribute("aria-label", `Add one dozen ${p.name}`);
    plus.addEventListener("click", () => changeQty(id, 1));
    controls.append(minus, qtyEl, plus);

    const subtotal = document.createElement("div");
    subtotal.className = "cart-line-subtotal";
    subtotal.textContent = `$${p.pricePerDozen * qty}`;

    line.append(info, controls, subtotal);
    itemsEl.appendChild(line);
  }

  document.getElementById("cart-total").textContent = `$${cartTotal()}`;
  document.getElementById("checkout-btn").disabled = entries.length === 0;
}

// ---------- Drawer open/close ----------

function openCart() {
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("cart-overlay").hidden = false;
}

function closeCart() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("cart-overlay").hidden = true;
}

// ---------- Checkout ----------

function buildOrderBody() {
  const lines = ["Hi DoubleTrouble Golf! I'd like to order:", ""];
  for (const [id, qty] of Object.entries(cart)) {
    const p = productById(id);
    lines.push(
      `- ${qty} dozen ${p.brand} ${p.name} (${p.grade}) — $${p.pricePerDozen * qty}`
    );
  }
  lines.push("", `Total: $${cartTotal()}`, "");
  lines.push("My name: ");
  lines.push("Pickup or delivery? ");
  lines.push("", "Thanks!");
  return lines.join("\n");
}

function checkout() {
  if (cartCount() === 0) return;
  const subject = "Golf ball order — DoubleTrouble Golf";
  const url =
    `mailto:${ORDER_EMAIL}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(buildOrderBody())}`;
  window.location.href = url;
}

// ---------- Init ----------

document.addEventListener("DOMContentLoaded", () => {
  cart = loadCart();

  document.getElementById("brand-filter").addEventListener("change", renderProducts);
  document.getElementById("grade-filter").addEventListener("change", renderProducts);
  document.getElementById("cart-btn").addEventListener("click", openCart);
  document.getElementById("cart-close").addEventListener("click", closeCart);
  document.getElementById("cart-overlay").addEventListener("click", closeCart);
  document.getElementById("checkout-btn").addEventListener("click", checkout);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });

  const footerEmail = document.getElementById("footer-email");
  footerEmail.href = `mailto:${ORDER_EMAIL}`;
  footerEmail.textContent = ORDER_EMAIL;

  renderProducts();
  renderCart();
});
