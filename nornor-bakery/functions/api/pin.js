import { getPins, getVouchers, has } from "../_pins.js";
// 验证 PIN / Voucher。只回传这个码自己的信息，不回传其他码。
export async function onRequestPost({ request, env }) {
  const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json", "cache-control": "no-store" } });
  let b; try { b = await request.json(); } catch { return json({ ok: false }, 400); }
  const code = String(b && b.pin || "").trim().toUpperCase().slice(0, 24);
  const pins = getPins(env), vs = getVouchers(env);
  if (has(pins, code) && Number(pins[code]) > 0) return json({ ok: true, kind: "credit", amount: Number(pins[code]) });
  if (has(vs, code)) { const v = vs[code]; return json({ ok: true, kind: "voucher", code, percent: +v.percent || 0, off: +v.off || 0, min: +v.min || 0, max: +v.max || 0, label: String(v.label || "").slice(0, 60) }); }
  return json({ ok: false }, 404);
}
