// 舒心温馨背景音乐：Web Audio 现场生成（无音频文件、免版权）。默认关闭，顾客点按钮才播放。
// 慢速 Cmaj7 → Am7 → Fmaj7 → G6 和弦，柔和琶音 + 偶尔的轻柔旋律，带低通滤波和回声。
(() => {
  const btn = document.getElementById("musicBtn"); if (!btn) return;
  let ctx, master, timer, nextT = 0, step = 0, on = false;
  const STEP = 0.85;                                   // 每步秒数(越大越慢)
  const VOL = 0.55;                                    // 总音量
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const CH = [[48, 52, 55, 59], [45, 48, 52, 55], [41, 45, 48, 52], [43, 47, 50, 52]]; // Cmaj7 Am7 Fmaj7 G6
  const ARP = [0, 1, 2, 3, 2, 1, 3, 2];
  const PENT = [72, 74, 76, 79, 81];                   // C D E G A
  function note(m, t, dur, vol, att, type) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || "sine"; o.frequency.value = mtof(m); o.connect(g); g.connect(master);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + att); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function schedule() {
    while (nextT < ctx.currentTime + 0.8) {
      const c = CH[Math.floor(step / 8) % CH.length], s = step % 8, t = nextT;
      if (s === 0) { c.forEach(m => note(m, t, STEP * 8.5, 0.045, 1.4)); note(c[0] - 12, t, STEP * 6, 0.12, 0.08); }
      note(c[ARP[s]] + 12, t, 2.6, 0.12, 0.03, s % 2 ? "sine" : "triangle");
      if (s === 0 || (s % 2 === 0 && Math.random() < 0.3)) note(PENT[Math.floor(Math.random() * PENT.length)], t + 0.02, 3.2, 0.06, 0.1);
      step++; nextT += STEP;
    }
  }
  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1700; lp.Q.value = 0.4;
    const d = ctx.createDelay(1); d.delayTime.value = 0.52; const fb = ctx.createGain(); fb.gain.value = 0.38; const wet = ctx.createGain(); wet.gain.value = 0.32;
    const dl = ctx.createBiquadFilter(); dl.type = "lowpass"; dl.frequency.value = 1100;
    master.connect(lp); lp.connect(ctx.destination); lp.connect(d); d.connect(dl); dl.connect(fb); fb.connect(d); dl.connect(wet); wet.connect(ctx.destination);
  }
  btn.onclick = () => {
    on = !on;
    if (on) {
      if (!ctx) build();
      ctx.resume(); nextT = ctx.currentTime + 0.1; schedule(); timer = setInterval(schedule, 250);
      master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(VOL, ctx.currentTime + 2.5);
    } else {
      clearInterval(timer);
      if (ctx) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(master.gain.value, ctx.currentTime); master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1); setTimeout(() => { if (!on) ctx.suspend(); }, 1100); }
    }
    btn.setAttribute("aria-pressed", on); btn.textContent = on ? "♪ Music on" : "♪ Music off";
  };
})();
