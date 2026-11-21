// 点击特效（波纹 + 小星星/蛋糕飞散）和导航高亮
(() => {
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const SPARKS = ["✨", "🍰", "🧁", "🍪", "⭐", "🍓"];
  window.burst = (x, y, n = 8, set) => {
    if (reduce) return;
    const pool = set || SPARKS;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span"); s.className = "spark"; s.textContent = pool[Math.floor(Math.random() * pool.length)];
      s.style.left = x + "px"; s.style.top = y + "px"; document.body.append(s);
      const a = Math.random() * Math.PI * 2, d = 40 + Math.random() * 70;
      s.animate([{ transform: "translate(-50%,-50%) scale(.4)", opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * d}px),calc(-50% + ${Math.sin(a) * d - 20}px)) scale(1.1) rotate(${Math.random() * 120 - 60}deg)`, opacity: 0 }],
        { duration: 650 + Math.random() * 350, easing: "cubic-bezier(.2,.7,.3,1)" }).onfinish = () => s.remove();
    }
  };
  document.addEventListener("click", e => {
    const t = e.target.closest(".btn,.chip-b,.tile,.cartBtn,.cartBar,.promo,.music,nav a,.logo");
    if (!t || t.disabled || reduce) return;
    if (t.matches(".btn,.chip-b,.tile,.cartBtn")) {
      const r = t.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2, rp = document.createElement("i");
      rp.className = "ripple"; rp.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
      t.append(rp); setTimeout(() => rp.remove(), 650);
    }
    window.burst(e.clientX, e.clientY, 7);
  });

  // 滚动时高亮当前导航项
  const links = [...document.querySelectorAll("#nav a")];
  const map = new Map(links.map(a => [a.getAttribute("href").slice(1), a]));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { links.forEach(a => a.classList.remove("active")); const a = map.get(en.target.id); if (a) a.classList.add("active"); }
    }), { rootMargin: "-40% 0px -55% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }
})();
