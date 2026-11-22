// 新手引导：每次进入都会出现。小提示卡会滑到目标旁边（带箭头、轻轻浮动），目标有发光边框。
// 不遮暗页面、不挡操作，可随时跳过。
(() => {
  const STEPS = [
    { t: "Browse by category", d: "Tap a category to jump straight to that part of the menu.", sel: "#tiles" },
    { t: "Mystery Blind Box 🎁", d: "Collect cute figurines. One of them is a hidden limited edition!", sel: "#bbGrid" },
    { t: "Find your favourite", d: "Search, filter and sort the menu here.", sel: "#q" },
    { t: "Add to cart", d: "Tap “Add to cart” on anything you like.", sel: "#grid .card .btn" },
    { t: "Got a PIN or voucher?", d: "Enter a code here for free credit or a discount.", sel: "#pinMountPage" },
    { t: "Send your order", d: "Open your cart, fill in your details and send. The shop confirms on WhatsApp.", sel: "#cartBar:not([hidden]), #cartBtn" }
  ];
  const reduce = () => matchMedia("(prefers-reduced-motion:reduce)").matches;
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const find = sel => [...document.querySelectorAll(sel)].find(vis);
  let card, inner, hl, idx = 0, open = false, raf = 0, glideT, fading = false, fadeT;

  const help = el("button", { className: "helpBtn", type: "button", textContent: "?", title: "Show quick tour" });
  help.setAttribute("aria-label", "Show quick tour"); document.body.append(help);

  function clear() { if (hl) hl.classList.remove("tour-hl"); hl = null; }
  function close() { open = false; fading = false; clearTimeout(fadeT); cancelAnimationFrame(raf); clear(); if (card) { card.remove(); card = inner = null; } }

  // 用户往下滑、按键盘滚动、或点其他地方：提示卡和边框慢慢淡出，然后关闭
  function fade() {
    if (!open || fading || !card) return; fading = true;
    card.classList.add("fading"); if (hl) hl.classList.add("tour-fade");
    fadeT = setTimeout(close, reduce() ? 0 : 900);
  }
  const SCROLL_KEYS = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];
  addEventListener("wheel", e => { if (Math.abs(e.deltaY) > 4) fade(); }, { passive: true });
  addEventListener("touchmove", fade, { passive: true });
  addEventListener("keydown", e => { if (SCROLL_KEYS.includes(e.key) && !/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(e.target.tagName)) fade(); });
  addEventListener("pointerdown", e => {
    if (!open || !card) return; const t = e.target;
    if (card.contains(t) || help.contains(t) || (hl && hl.contains(t))) return;   // 点提示卡、? 按钮或发光的目标不算
    fade();
  }, true);

  // 把提示卡放在目标旁边：优先目标下方，放不下就放上方，再放不下就贴屏幕底部
  function place() {
    if (!card || !hl) return;
    const r = hl.getBoundingClientRect(), cw = card.offsetWidth, ch = card.offsetHeight, vw = innerWidth, vh = innerHeight, gap = 16, topLimit = 64, botLimit = 70;
    let side = "none", y = vh - ch - botLimit;
    if (r.bottom >= topLimit && r.bottom + gap + ch <= vh - botLimit) { side = "below"; y = r.bottom + gap; }
    else if (r.top <= vh && r.top - gap - ch >= topLimit) { side = "above"; y = r.top - gap - ch; }
    const cx = r.left + r.width / 2;
    const x = side === "none" ? (vw - cw) / 2 : Math.min(Math.max(cx - cw / 2, 8), vw - cw - 8);
    card.dataset.side = side;
    card.style.setProperty("--ax", Math.min(Math.max(cx - x, 22), cw - 22) + "px");
    card.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`;
  }
  const loop = () => { if (!open) return; place(); raf = requestAnimationFrame(loop); };

  function show(i, dir = 1) {
    while (i >= 0 && i < STEPS.length && !find(STEPS[i].sel)) i += dir;       // 跳过当前看不到的步骤
    if (i < 0 || i >= STEPS.length) return i < 0 ? show(0, 1) : close();
    if (fading) return;
    idx = i; clear(); const s = STEPS[i], t = find(s.sel);
    const tall = t.getBoundingClientRect().height > innerHeight * 0.45;
    t.scrollIntoView({ behavior: reduce() ? "auto" : "smooth", block: tall ? "start" : "center" });
    t.classList.add("tour-hl"); hl = t;
    const last = STEPS.slice(i + 1).every(x => !find(x.sel));
    const back = el("button", { type: "button", className: "tbtn", textContent: "Back", disabled: i === 0 }); back.onclick = () => show(idx - 1, -1);
    const next = el("button", { type: "button", className: "tbtn pri", textContent: last ? "Done" : "Next" }); next.onclick = () => show(idx + 1, 1);
    const skip = el("button", { type: "button", className: "tskip", textContent: "Skip" }); skip.onclick = close;
    const content = [el("div", { className: "tcount", textContent: `${i + 1} / ${STEPS.length}` }), el("strong", { textContent: s.t }), el("p", { textContent: s.d }),
      el("div", { className: "tact" }, skip, el("span", { className: "grow" }), back, next)];
    if (!card) {
      inner = el("div", { className: "tour-in" }); card = el("div", { className: "tour", role: "dialog" }, inner);
      card.setAttribute("aria-label", "Quick tour"); card.setAttribute("aria-live", "polite");
      inner.replaceChildren(...content); document.body.append(card); open = true; place(); loop();
    } else {
      inner.replaceChildren(...content);
      card.classList.add("gliding"); clearTimeout(glideT); glideT = setTimeout(() => card && card.classList.remove("gliding"), 700);
    }
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
