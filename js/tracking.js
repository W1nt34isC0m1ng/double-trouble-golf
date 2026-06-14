// ============================================================
// DoubleTrouble Golf — analytics & ad tracking
//
// Fill in the two IDs below to switch tracking on. Leave them
// blank ("") and nothing loads — the site works exactly the same.
//
//   META_PIXEL_ID    - from Facebook/Meta Events Manager → Data Sources →
//                      your pixel → the numeric Pixel ID.
//   CLOUDFLARE_TOKEN - from Cloudflare → Web Analytics → add your site →
//                      the token in the snippet it gives you.
// ============================================================

const META_PIXEL_ID = "";       // e.g. "1234567890123456"
const CLOUDFLARE_TOKEN = "";     // e.g. "a1b2c3d4e5f6..."

// ---- Meta Pixel (page views on every page) ----
if (META_PIXEL_ID) {
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  fbq("init", META_PIXEL_ID);
  fbq("track", "PageView");
}

// ---- Cloudflare Web Analytics (free traffic counter) ----
if (CLOUDFLARE_TOKEN) {
  var cf = document.createElement("script");
  cf.defer = true;
  cf.src = "https://static.cloudflareinsights.com/beacon.min.js";
  cf.setAttribute("data-cf-beacon", JSON.stringify({ token: CLOUDFLARE_TOKEN }));
  document.head.appendChild(cf);
}

// ---- Helper: fire a Purchase conversion (used by success.html) ----
// Safe to call even if the pixel is off — it just no-ops.
window.dtgTrackPurchase = function (value, currency) {
  if (META_PIXEL_ID && window.fbq) {
    fbq("track", "Purchase", { value: value, currency: currency || "USD" });
  }
};
