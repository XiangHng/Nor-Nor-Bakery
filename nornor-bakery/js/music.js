// 轻松背景音乐：用 Web Audio 现场生成（无音频文件、免版权）。默认关闭，顾客点按钮才播放。
(() => {
  const btn = document.getElementById("musicBtn"); if (!btn) return;
  let ctx, master, timer, step = 0, on = false;
  const N = { C4: 261.63, D4: 293.66, E4: 329.63, G4: 392, A4: 440, C5: 523.25, D5: 587.33, E5: 659.25 };
  const melody = ["E4","G4","A4","G4","E4","D4","C4","D4","E4","G4","C5","A4","G4","E4","D4",null,
                  "A4","C5","D5","C5","A4","G4","E4","G4","A4","E5","D5","C5","A4","G4","E4",null];
  const bass = { 0: "C4", 8: "G4", 16: "A4", 24: "G4" };
  function tone(f, t, dur, vol, type) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = f; o.connect(g); g.connect(master);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function tick() {
    const t = ctx.currentTime + 0.05, n = melody[step % melody.length];
    if (n) tone(N[n], t, 1.2, 0.5, "triangle");
    const b = bass[step % melody.length]; if (b) tone(N[b] / 2, t, 2.4, 0.35, "sine");
    step++;
  }
  btn.onclick = () => {
    on = !on;
    if (on) {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (!master) { master = ctx.createGain(); master.gain.value = 0.12; master.connect(ctx.destination); }
      ctx.resume(); tick(); timer = setInterval(tick, 520);
    } else { clearInterval(timer); if (ctx) ctx.suspend(); }
    btn.setAttribute("aria-pressed", on); btn.textContent = on ? "♪ Music on" : "♪ Music off";
  };
})();
