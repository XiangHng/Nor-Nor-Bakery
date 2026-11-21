// 新手引导：每次进入都会出现。小提示卡 + 目标发光边框，不遮暗页面、不挡操作，可随时跳过。
(() => {
  const STEPS = [
    { t: "Browse by category", d: "Tap a category to jump straight to that part of the menu.", sel: "#tiles" },
    { t: "Mystery Blind Box 🎁", d: "Collect cute figurines. One of them is a hidden limited edition!", sel: "#bbGrid" },
    { t: "Find your favourite", d: "Search, filter and sort the menu here.", sel: "#q" },
    { t: "Add to cart", d: "Tap “Add to cart” on anything you like.", sel: "#grid .card .btn" },
    { t: "Got a PIN or voucher?", d: "Enter a code here for free credit or a discount.", sel: "#pinMountPage" },
    { t: "Send your order", d: "Open your cart, fill in your details and send. The shop confirms on WhatsApp.", sel: "#cartBar:not([hidden]), #cartBtn" }
  ];
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const find = sel => [...document.querySelectorAll(sel)].find(vis);
  let card, hl, idx = 0, open = false;

  const help = el("button", { className: "helpBtn", type: "button", textContent: "?", title: "Show quick tour" });
  help.setAttribute("aria-label", "Show quick tour"); document.body.append(help);

  function clear() { if (hl) hl.classList.remove("tour-hl"); hl = null; }
  function close() { open = false; clear(); if (card) { card.remove(); card = null; } }
  function show(i, dir = 1) {
    while (i >= 0 && i < STEPS.length && !find(STEPS[i].sel)) i += dir;       // 跳过当前看不到的步骤
    if (i < 0 || i >= STEPS.length) return i < 0 ? show(0, 1) : close();
    idx = i; clear(); const s = STEPS[i], t = find(s.sel);
    const tall = t.getBoundingClientRect().height > innerHeight * 0.45;
    t.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion:reduce)").matches ? "auto" : "smooth", block: tall ? "start" : "center" });
    t.classList.add("tour-hl"); hl = t;
    const last = STEPS.slice(i + 1).every(x => !find(x.sel));
    const back = el("button", { type: "button", className: "tbtn", textContent: "Back", disabled: i === 0 }); back.onclick = () => show(idx - 1, -1);
    const next = el("button", { type: "button", className: "tbtn pri", textContent: last ? "Done" : "Next" }); next.onclick = () => show(idx + 1, 1);
    const skip = el("button", { type: "button", className: "tskip", textContent: "Skip" }); skip.onclick = close;
    const nc = el("div", { className: "tour", role: "dialog" }, el("div", { className: "tcount", textContent: `${i + 1} / ${STEPS.length}` }), el("strong", { textContent: s.t }), el("p", { textContent: s.d }),
      el("div", { className: "tact" }, skip, el("span", { className: "grow" }), back, next));
    nc.setAttribute("aria-label", "Quick tour"); nc.setAttribute("aria-live", "polite");
    if (card) card.replaceWith(nc); else document.body.append(nc);
    card = nc; open = true;
  }
  const start = () => { if (!open) show(0, 1); };
  help.onclick = () => { close(); start(); };
  document.addEventListener("keydown", e => { if (e.key === "Escape" && open && !document.querySelector("dialog[open]")) close(); });

  // 等开机动画结束再开始
  let waited = 0;
  const timer = setInterval(() => {
    const intro = document.getElementById("intro"), gone = !intro || getComputedStyle(intro).visibility === "hidden" || getComputedStyle(intro).display === "none";
    waited += 300;
    if ((gone && waited > 600) || waited > 7000) { clearInterval(timer); start(); }
  }, 300);
})();
