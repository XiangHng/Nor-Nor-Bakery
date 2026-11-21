const $ = s => document.querySelector(s);
const rm = n => "RM " + Number(n).toFixed(2);
const el = (t, props = {}, ...kids) => { const e = document.createElement(t); Object.assign(e, props); kids.forEach(k => e.append(k)); return e; };
const wa = txt => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(txt)}`;
const TBC = "To be confirmed by the shop. Please ask on WhatsApp.";
let cart = {}; try { cart = JSON.parse(localStorage.getItem("nn_cart") || "{}"); } catch { cart = {}; }
const find = id => PRODUCTS.find(p => p.id === id);
const save = () => { try { localStorage.setItem("nn_cart", JSON.stringify(cart)); } catch {} };
const lines = () => Object.entries(cart).map(([id, q]) => ({ p: find(id), q })).filter(l => l.p && l.p.available && l.q > 0);
const total = () => lines().reduce((s, l) => s + l.p.price * l.q, 0);

const CAT_STYLE = { Cakes: ["🍰", "#f2d9d2", "#e9b9ad"], Cookies: ["🍪", "#f1e2c4", "#dcc08a"], Brownies: ["🍫", "#d9c0b0", "#a67a62"],
  Pastries: ["🥐", "#f6e3b8", "#e3c06f"], "Blind Box": ["🎁", "#f6e3e8", "#d98ca3"], "Premium Drinks": ["☕", "#e5d3c2", "#b88f6c"], "Fruit Juices": ["🍹", "#fde0c2", "#f7a96b"] };
function art(p) {
  const [e, a, b] = CAT_STYLE[p.category] || ["🧁", "#f2d9d2", "#e9b9ad"];
  const d = el("span", { className: "art" }, el("i", { textContent: p.emoji || e }), el("small", { textContent: p.name }));
  d.style.background = `linear-gradient(145deg,${a},${b})`; return d;
}
function photo(p, lazy = true) {
  if (!p.image) return art(p);
  const i = el("img", { src: p.image, alt: p.name, loading: lazy ? "lazy" : "eager" });
  i.onerror = () => i.replaceWith(art(p)); return i;
}
let toastT;
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2000); }
let curCat = "";
const setCat = c => { curCat = c; render(); };
function add(id, open) {
  const p = find(id); if (!p || !p.available) return;
  if (p.checkoutUrl && open === "buy") { window.open(p.checkoutUrl, "_blank", "noopener,noreferrer"); return; }
  cart[id] = Math.min(20, (cart[id] || 0) + 1); save(); render(); toast("Added: " + p.name);
  if (open) { $("#detail").close(); openCart(); }
}
function render() {
  const q = $("#q").value.trim().toLowerCase(), c = curCat, s = $("#sort").value;
  let list = PRODUCTS.filter(p => (!c || p.category === c) && (!q || (p.name + p.desc + p.category).toLowerCase().includes(q)));
  list.sort((a, b) => s === "lo" ? a.price - b.price : s === "hi" ? b.price - a.price : b.popularity - a.popularity);
  const g = $("#grid"); g.replaceChildren(); $("#none").hidden = list.length > 0;
  $("#resultCount").textContent = list.length + " item" + (list.length === 1 ? "" : "s") + (c ? " in " + c : "");
  document.querySelectorAll("#chips button").forEach(b => { const on = b.dataset.c === c; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
  list.forEach(p => {
    const ph = el("button", { className: "ph", type: "button", ariaLabel: "View " + p.name }, photo(p));
    p.labels.forEach(l => ph.append(el("span", { className: "tag", textContent: l })));
    ph.onclick = () => detail(p);
    const btn = el("button", { className: "btn", textContent: p.available ? "Add to cart" : "Sold out", disabled: !p.available });
    btn.onclick = () => add(p.id);
    g.append(el("article", { className: "card" }, ph, el("div", { className: "b" },
      el("span", { className: "cat", textContent: p.category }), el("h3", { textContent: p.name }),
      el("span", { className: "price", textContent: rm(p.price) }),
      p.available ? "" : el("span", { className: "sold", textContent: "Currently unavailable" }), btn)));
  });
  const n = lines().reduce((s, l) => s + l.q, 0);
  $("#count").textContent = n; $("#barCount").textContent = n; $("#barTotal").textContent = rm(total()); $("#cartBar").hidden = n === 0;
  if ($("#cart").open) cartView();
}
function detail(p) {
  const b = $("#detailBody"); b.replaceChildren();
  const ph = el("div", { className: "dph" }, photo(p, false));
  const buy = el("button", { className: "btn", textContent: p.available ? (p.checkoutUrl ? "Buy now" : "Add to cart") : "Sold out", disabled: !p.available });
  buy.onclick = () => add(p.id, p.checkoutUrl ? "buy" : true);
  const ask = el("a", { className: "btn alt", textContent: "Ask about this", target: "_blank", rel: "noopener noreferrer", href: wa(`Hi ${CONFIG.shopName}, I'd like to ask about: ${p.name}`) });
  b.append(el("button", { className: "x", textContent: "×", ariaLabel: "Close", onclick: () => $("#detail").close() }), ph,
    el("h2", { textContent: p.name }), el("p", { textContent: p.desc }), el("p", { className: "price", textContent: rm(p.price) + (p.available ? "" : " – sold out") }), buy, " ", ask);
  $("#detail").showModal();
}
function cartView() {
  const b = $("#cartBody"), ls = lines(); b.replaceChildren(); $("#form").hidden = !ls.length;
  if (!ls.length) { b.append(el("p", { textContent: "Your cart is empty. Pick something from the shop." })); return; }
  ls.forEach(({ p, q }) => {
    const m = el("button", { textContent: "−", ariaLabel: "Less " + p.name }), pl = el("button", { textContent: "+", ariaLabel: "More " + p.name });
    m.onclick = () => { cart[p.id] = q - 1; if (cart[p.id] <= 0) delete cart[p.id]; save(); render(); };
    pl.onclick = () => { cart[p.id] = Math.min(20, q + 1); save(); render(); };
    const rem = el("button", { textContent: "Remove", className: "cartBtn" }); rem.onclick = () => { delete cart[p.id]; save(); render(); };
    b.append(el("div", { className: "row" }, el("div", {}, el("strong", { textContent: p.name }), el("br"), rm(p.price * q)),
      el("div", { className: "qty" }, m, el("span", { textContent: q }), pl), rem));
  });
  b.append(el("p", {}, el("strong", { textContent: "Subtotal: " + rm(total()) })));
}
function openCart() { $("#result").replaceChildren(); cartView(); if (!$("#cart").open) $("#cart").showModal(); }
function summary(o) {
  return `Hi ${CONFIG.shopName}, I'd like to order:\n` + lines().map(l => `- ${l.p.name} x${l.q} (${rm(l.p.price * l.q)})`).join("\n") +
    `\nSubtotal: ${rm(total())}\nName: ${o.name}\nPhone: ${o.phone}\nPayment: ${o.payment}\n${o.method}${o.address ? ": " + o.address : ""}${o.date ? "\nDate: " + o.date : ""}${o.note ? "\nNote: " + o.note : ""}\n(Please confirm availability and payment.)`;
}
$("#form").onsubmit = async e => {
  e.preventDefault(); const r = $("#result"); r.replaceChildren();
  const o = { name: $("#f-name").value.trim(), phone: $("#f-phone").value.trim(), method: $("#f-method").value, payment: $("#f-pay").value, address: $("#f-addr").value.trim(), date: $("#f-date").value, note: $("#f-note").value.trim() };
  if (!o.name || !/^[0-9+\-\s]{8,16}$/.test(o.phone)) { r.append(el("div", { className: "msg", textContent: "Enter your name and a valid phone number (8–16 digits)." })); return; }
  if (o.method === "Delivery" && !o.address) { r.append(el("div", { className: "msg", textContent: "Enter a delivery address." })); return; }
  if (CONFIG.generalCheckoutUrl) { window.open(CONFIG.generalCheckoutUrl, "_blank", "noopener,noreferrer"); }
  const waBtn = el("a", { className: "btn", textContent: "Also send on WhatsApp", target: "_blank", rel: "noopener noreferrer", href: wa(summary(o)) });
  let sent = false;
  try {
    const res = await fetch(CONFIG.orderApi, { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...o, total: total(), items: lines().map(l => ({ name: l.p.name, qty: l.q })) }) });
    sent = res.ok;
  } catch {}
  r.append(el("div", { className: "msg " + (sent ? "ok" : "") },
    sent ? "Order submitted. It is not confirmed yet. The shop will contact you on WhatsApp to confirm and arrange payment."
         : "We could not send the order automatically. Please tap the button below to send it by WhatsApp. It is not confirmed until the shop replies.", el("br"), el("br"), waBtn));
  if (sent) { cart = {}; save(); render(); $("#cartBody").replaceChildren(); $("#form").hidden = true; }
};
const go = c => { setCat(c); $("#q").value = ""; render(); $("#shop").scrollIntoView({ behavior: "smooth" }); };
["", ...CATEGORIES].forEach(c => { const b = el("button", { type: "button", role: "tab", textContent: c || "All", className: "chip-b" }); b.dataset.c = c; b.onclick = () => setCat(c); $("#chips").append(b); });
CATEGORIES.forEach(c => { const [e, a, b2] = CAT_STYLE[c]; const t = el("button", { type: "button", className: "tile" }, el("i", { textContent: e }), el("span", { textContent: c }), el("small", { textContent: PRODUCTS.filter(p => p.category === c).length + " items" }));
  t.style.background = `linear-gradient(145deg,${a},${b2})`; t.onclick = () => go(c); $("#tiles").append(t); });
$("#promo").onclick = e => { e.preventDefault(); go("Cakes"); };
["#q", "#sort"].forEach(s => $(s).addEventListener("input", render));
$("#cartBar").onclick = openCart;
CONFIG.payments.forEach(m => $("#f-pay").append(el("option", { value: m.name, textContent: m.name })));
$("#f-date").min = new Date().toISOString().slice(0, 10);
$("#cartBtn").onclick = openCart;
document.querySelectorAll("[data-close]").forEach(b => b.onclick = () => b.closest("dialog").close());
document.querySelectorAll("dialog").forEach(d => d.addEventListener("click", e => { if (e.target === d) d.close(); }));
$("#menuBtn").onclick = () => { const o = $("#nav").classList.toggle("open"); $("#menuBtn").setAttribute("aria-expanded", o); };
$("#nav").addEventListener("click", e => { if (e.target.tagName === "A") $("#nav").classList.remove("open"); });
const fill = (id, v) => { const n = $(id); n.textContent = v || TBC; if (!v) n.className = "tbc"; };
fill("#deliv", CONFIG.deliveryInfo); fill("#pick", CONFIG.pickupInfo); fill("#refund", CONFIG.refundPolicy); fill("#addr", CONFIG.address); fill("#hours", CONFIG.hours);
$("#waLink").textContent = "+" + CONFIG.whatsapp; $("#waLink").href = wa(`Hi ${CONFIG.shopName}!`);
$("#askBtn").href = wa(`Hi ${CONFIG.shopName}, I'd like to ask about your products and availability.`);
[["Instagram", CONFIG.instagram], ["TikTok", CONFIG.tiktok]].forEach(([n, u]) => { if (/^https:\/\//.test(u)) $("#soc").append(" ", el("a", { href: u, textContent: n, target: "_blank", rel: "noopener noreferrer" })); });
$("#customBtn").href = wa(`Hi ${CONFIG.shopName}, I'd like to ask about a custom order.`);
const payList = $("#payList");
CONFIG.payments.forEach(m => { const li = el("li", {}, el("span", { className: "pi", textContent: m.icon || "💳" }), el("div", {}, el("strong", { textContent: m.name }), el("br"), el("span", { className: m.detail ? "" : "tbc", textContent: m.detail || "Details shared on WhatsApp after your order is confirmed." })));
  if (m.qr) li.append(el("img", { src: m.qr, alt: m.name + " QR code", loading: "lazy", className: "qr" })); payList.append(li); });
$("#yr").textContent = new Date().getFullYear();
render();
(() => {
  const i = $("#intro"); if (!i) return;
    const done = () => i.classList.add("out"); setTimeout(done, 2600); i.onclick = done;
})();


