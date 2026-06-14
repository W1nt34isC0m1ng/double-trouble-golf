// Netlify serverless function: return the paid amount for a Checkout Session.
//
// The success page calls this with ?session_id=... to get the real order total
// so it can fire an accurate Meta "Purchase" conversion. It exposes only the
// amount, currency, and payment status — no customer details.

exports.handler = async (event) => {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return json(500, { error: "Not configured" });
  }

  const sessionId =
    event.queryStringParameters && event.queryStringParameters.session_id;
  if (!sessionId) {
    return json(400, { error: "Missing session_id" });
  }

  try {
    const stripe = require("stripe")(secret);
    const s = await stripe.checkout.sessions.retrieve(sessionId);
    return json(200, {
      amount_total: s.amount_total,
      currency: s.currency,
      payment_status: s.payment_status,
    });
  } catch (err) {
    console.error("order-summary error:", err.message);
    return json(502, { error: "Could not look up order" });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
