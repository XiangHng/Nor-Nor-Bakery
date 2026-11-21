// 盲盒区块 + 开箱预览（只是好玩，不影响真实订单）
(() => {
  const grid = $("#bbGrid"); if (!grid || typeof BLINDBOX === "undefined") return;
  const box = find(BLINDBOX.productId), F = BLINDBOX.figures;
  const pct = f => f.chance + "%";

  F.forEach(f => {
    const img = el("img", { src: f.image, alt: f.hidden ? "Hidden figurine silhouette" : f.name, loading: "lazy" });
    const card = el("div", { className: "bbCard" + (f.hidden ? " hid" : "") },
      el("div", { className: "bbImg" }, img, f.hidden ? el("b", { className: "q", textContent: "?" }) : ""),
      el("span", { className: "rar " + (f.hidden ? "gold" : ""), textContent: f.rarity }),
      el("h3", { textContent: f.hidden ? "???" : f.name }),
      el("p", { textContent: f.hidden ? "A secret edition. Only a few boxes have it." : f.note }),
      el("small", { textContent: "Chance " + pct(f) }));
    grid.append(card);
  });

  const addBtn = $("#bbAdd");
  if (box) { addBtn.textContent = box.available ? `Add blind box · ${rm(box.price)}` : "Sold out"; addBtn.disabled = !box.available; addBtn.onclick = () => add(box.id); }
  else addBtn.hidden = true;

  function roll() {
    let r = Math.random() * F.reduce((s, f) => s + f.chance, 0);
    return F.find(f => (r -= f.chance) < 0) || F[0];
  }
  function unbox() {
    const st = $("#unboxStage"); st.replaceChildren();
    const b = el("img", { src: box ? box.image : "assets/blindbox/box.svg", alt: "Blind box", className: "shake" });
    st.append(el("div", { className: "stage" }, b), el("p", { className: "muted", textContent: "Shaking…" }));
    if (!$("#unbox").open) $("#unbox").showModal();
    setTimeout(() => {
      const f = roll();
      const fig = el("img", { src: f.image, alt: f.name, className: "reveal" });
      const again = el("button", { className: "btn alt", type: "button", textContent: "Open another" }); again.onclick = unbox;
      const buy = el("button", { className: "btn", type: "button", textContent: "Get a real box" });
      buy.onclick = () => { $("#unbox").close(); if (box) add(box.id); };
      st.replaceChildren(el("div", { className: "stage" }, fig),
        el("span", { className: "rar " + (f.hidden ? "gold" : ""), textContent: f.hidden ? "🎉 Hidden edition!" : f.rarity }),
        el("h3", { textContent: f.name }), el("p", { textContent: f.note }),
        el("p", { className: "muted", textContent: "Just for fun. Your real box is randomly packed by the shop." }), buy, " ", again);
      const r = fig.getBoundingClientRect();
      if (window.burst) window.burst(r.left + r.width / 2, r.top + r.height / 2, f.hidden ? 26 : 14, f.hidden ? ["🦖", "☀️", "🍹", "✨", "⭐"] : null);
    }, 1400);
  }
  $("#bbTry").onclick = unbox;
})();
