const $ = s => document.querySelector(s);
const rm = n => "RM " + Number(n).toFixed(2);
const el = (t, props = {}, ...kids) => { const e = document.createElement(t); Object.assign(e, props); kids.forEach(k => e.append(k)); return e; };
const wa = txt => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(txt)}`;
const TBC = "To be confirmed by the shop. Please ask on WhatsApp.";
let cart = {}; try { cart = JSON.parse(localStorage.getItem("nn_cart") || "{}"); } catch { cart = {}; }
const find = id => PRODUCTS.find(p => p.id === id);
const save = () => { try { localStorage.setItem("nn_cart", JSON.stringify(cart)); } catch {} };
const lines = () => Object.entries(cart).map(([id, q]) => ({ p: find(id), q })).filter(l => l.p && l.p.available && l.q > 0);
let credit = 0, usedPins = []; try { credit = Math.max(0, Number(localStorage.getItem("nn_credit")) || 0); usedPins = JSON.parse(localStorage.getItem("nn_pins") || "[]"); } catch {}
const saveCredit = () => { try { localStorage.setItem("nn_credit", credit); localStorage.setItem("nn_pins", JSON.stringify(usedPins)); } catch {} };
let voucher = null; try { voucher = JSON.parse(localStorage.getItem("nn_voucher") || "null"); } catch {}
const saveVoucher = () => { try { localStorage.setItem("nn_voucher", JSON.stringify(voucher)); } catch {} };
const vDisc = () => { if (!voucher) return 0; const t = total(); if (t < (voucher.min || 0)) return 0;
  let d = voucher.percent ? t * voucher.percent / 100 : (voucher.off || 0); if (voucher.max) d = Math.min(d, voucher.max); return Math.min(+d.toFixed(2), t); };
const applied = () => Math.min(credit, total() - vDisc());
const payable = () => Math.max(0, +(total() - vDisc() - applied()).toFixed(2));
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
  b.append(el("p", {}, "Subtotal: " + rm(total())));
  if (voucher) {
    const rmv = el("button", { type: "button", className: "linkBtn", textContent: "remove" }); rmv.onclick = () => { voucher = null; saveVoucher(); creditView(); render(); };
    b.append(el("p", { className: "credit" }, vDisc() > 0 ? `Voucher ${voucher.code}: −${rm(vDisc())} ` : `Voucher ${voucher.code}: spend ${rm(voucher.min - total())} more to use `, rmv));
  }
  if (applied() > 0) b.append(el("p", { className: "credit" }, "Credit applied: −" + rm(applied())));
  b.append(el("p", {}, el("strong", { textContent: "To pay: " + rm(payable()) })));
}
const boxes = [];
function pinBox() {
  const id = "pin" + boxes.length;
  const input = el("input", { id, maxLength: 24, autocomplete: "off", spellcheck: false, placeholder: "Enter PIN or voucher" }); input.setAttribute("autocapitalize", "characters");
  const go = el("button", { className: "btn", type: "button", textContent: "Redeem" });
  const msg = el("p", { className: "pinMsg" }); msg.setAttribute("role", "status");
  const cr = el("p", { className: "credit", hidden: true }), vi = el("p", { className: "credit", hidden: true });
  const box = { input, go, msg, cr, vi };
  const root = el("div", { className: "pinBox" }, el("label", { htmlFor: id, textContent: "Have a PIN or voucher code?" }), el("div", { className: "pinRow" }, input, go), msg, cr, vi,
    el("small", { className: "muted", textContent: "Credit and vouchers have no cash value, cannot be withdrawn or refunded, and are applied only when the shop confirms your order. One voucher per order." }));
  go.onclick = () => redeem(box);
  input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); redeem(box); } });
  boxes.push(box); return root;
}
function creditView() {
  boxes.forEach(x => {
    x.cr.hidden = credit <= 0; x.cr.textContent = "Your credit: " + rm(credit);
    x.vi.hidden = !voucher; if (voucher) x.vi.textContent = "Voucher " + voucher.code + (voucher.label ? " · " + voucher.label : "") + (voucher.min ? " · min spend " + rm(voucher.min) : "");
  });
  if ($("#cart").open) cartView();
}
async function redeem(x) {
  const m = x.msg, pin = x.input.value.trim().toUpperCase(); m.className = "pinMsg";
  if (!pin) { m.textContent = "Enter a PIN or voucher code."; return; }
  if (usedPins.includes(pin) || (voucher && voucher.code === pin)) { m.textContent = "This PIN or voucher is already in use on this device."; return; }
  x.go.disabled = true; m.textContent = "Checking…";
  const fx = (n, set) => { if (window.burst) { const r = x.go.getBoundingClientRect(); window.burst(r.left + r.width / 2, r.top, n, set); } };
  try {
    const res = await fetch(CONFIG.pinApi, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ pin }) });
    const d = await res.json().catch(() => ({}));
    if (res.ok && d.ok && d.kind === "voucher") { voucher = { code: d.code, percent: d.percent, off: d.off, min: d.min, max: d.max, label: d.label }; saveVoucher(); boxes.forEach(y => y.input.value = ""); m.className = "pinMsg okTxt"; m.textContent = "🎟️ Voucher " + d.code + " added!"; creditView(); render(); fx(14, ["🎟️", "✨", "⭐"]); }
    else if (res.ok && d.ok) { credit = +(credit + d.amount).toFixed(2); usedPins.push(pin); saveCredit(); boxes.forEach(y => y.input.value = ""); m.className = "pinMsg okTxt"; m.textContent = "🎉 " + rm(d.amount) + " credit added!"; creditView(); fx(18, ["🎉", "✨", "⭐", "🧁"]); }
    else m.textContent = res.status === 404 || res.status === 400 ? "That PIN or voucher is not valid." : "Could not check the code. Please try again later.";
  } catch { m.textContent = "Could not check the code. Please try again later."; }
  x.go.disabled = false;
}
$("#pinMountCart").append(pinBox()); $("#pinMountPage").append(pinBox());
$("#promoHint").textContent = CONFIG.promoHint || "";
function openCart() { $("#result").replaceChildren(); cartView(); if (!$("#cart").open) $("#cart").showModal(); }
function summary(o) {
  return `Hi ${CONFIG.shopName}, I'd like to order:\n` + lines().map(l => `- ${l.p.name} x${l.q} (${rm(l.p.price * l.q)})`).join("\n") +
    `\nSubtotal: ${rm(total())}${vDisc() > 0 ? `\nVoucher ${voucher.code}: -${rm(vDisc())}` : ""}${applied() > 0 ? `\nCredit applied: -${rm(applied())}` : ""}${vDisc() > 0 || applied() > 0 ? `\nTo pay: ${rm(payable())}` : ""}\nName: ${o.name}\nPhone: ${o.phone}\n${o.payment ? "\nPayment: " + o.payment : ""}\n${o.method}${o.address ? ": " + o.address : ""}${o.date ? "\nDate: " + o.date : ""}${o.note ? "\nNote: " + o.note : ""}\n(Please confirm availability and payment.)`;
}
$("#form").onsubmit = async e => {
  e.preventDefault(); const r = $("#result"); r.replaceChildren();
  const o = { name: $("#f-name").value.trim(), phone: $("#f-phone").value.trim(), method: $("#f-method").value, payment: $("#f-pay").value, address: $("#f-addr").value.trim(), date: $("#f-date").value, note: $("#f-note").value.trim() };
  if (!o.name || !/^[0-9+\-\s]{8,16}$/.test(o.phone)) { r.append(el("div", { className: "msg", textContent: "Enter your name and a valid phone number (8–16 digits)." })); return; }
  if (o.method === "Delivery" && !o.address) { r.append(el("div", { className: "msg", textContent: "Enter a delivery address." })); return; }
  if (CONFIG.generalCheckoutUrl) { window.open(CONFIG.generalCheckoutUrl, "_blank", "noopener,noreferrer"); }
  const waBtn = el("a", { className: "btn", textContent: "Also send on WhatsApp", target: "_blank", rel: "noopener noreferrer", href: wa(summary(o)) });
  let sent = false; const usedCredit = applied(), usedVoucher = vDisc() > 0; let spent = false;
  const spend = () => { if (spent) return; spent = true; credit = Math.max(0, +(credit - usedCredit).toFixed(2)); saveCredit(); if (usedVoucher) { voucher = null; saveVoucher(); } creditView(); };
  waBtn.addEventListener("click", spend);
  try {
    const res = await fetch(CONFIG.orderApi, { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...o, total: total(), credit: applied(), pins: usedPins, voucher: vDisc() > 0 ? voucher.code : "", discount: vDisc(), items: lines().map(l => ({ name: l.p.name, qty: l.q })) }) });
    sent = res.ok;
  } catch {}
  r.append(el("div", { className: "msg " + (sent ? "ok" : "") },
    sent ? "Order submitted. It is not confirmed yet. The shop will contact you on WhatsApp to confirm and arrange payment."
         : "We could not send the order automatically. Please tap the button below to send it by WhatsApp. It is not confirmed until the shop replies.", el("br"), el("br"), waBtn));
  if (sent) { spend(); cart = {}; save(); render(); $("#cartBody").replaceChildren(); $("#form").hidden = true; }
};
const go = c => { setCat(c); $("#q").value = ""; render(); $("#shop").scrollIntoView({ behavior: "smooth" }); };
["", ...CATEGORIES].forEach(c => { const b = el("button", { type: "button", role: "tab", textContent: c || "All", className: "chip-b" }); b.dataset.c = c; b.onclick = () => setCat(c); $("#chips").append(b); });
CATEGORIES.forEach(c => { const [e, a, b2] = CAT_STYLE[c]; const t = el("button", { type: "button", className: "tile" }, el("i", { textContent: e }), el("span", { textContent: c }), el("small", { textContent: PRODUCTS.filter(p => p.category === c).length + " items" }));
  t.style.background = `linear-gradient(145deg,${a},${b2})`; t.onclick = () => go(c); $("#tiles").append(t); });
$("#promo").onclick = e => { e.preventDefault(); go("Cakes"); };
["#q", "#sort"].forEach(s => $(s).addEventListener("input", render));
$("#cartBar").onclick = openCart;
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
if (!CONFIG.payments.length) payList.append(el("li", {}, el("span", { className: "pi", textContent: "💬" }), el("div", {}, el("span", { className: "tbc", textContent: "Payment details will be shared on WhatsApp after your order is confirmed." }))));
CONFIG.payments.forEach(m => { $("#f-pay").append(el("option", { value: m.name, textContent: m.name })); $("#payRow").hidden = false;
  const li = el("li", {}, el("span", { className: "pi", textContent: m.icon || "💳" }), el("div", {}, el("strong", { textContent: m.name }), el("br"), el("span", { className: m.detail ? "" : "tbc", textContent: m.detail || "Details shared on WhatsApp after your order is confirmed." })));
  if (m.qr) li.append(el("img", { src: m.qr, alt: m.name + " QR code", loading: "lazy", className: "qr" })); payList.append(li); });
$("#yr").textContent = new Date().getFullYear();
creditView();
render();
(() => {
  const i = $("#intro"); if (!i) return;
    const done = () => i.classList.add("out"); setTimeout(done, 2600); i.onclick = done;
})();


