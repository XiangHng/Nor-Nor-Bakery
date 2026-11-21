// Cloudflare Pages Function: 收到订单 -> 发到 Telegram。密钥放在 Cloudflare 环境变量，不在网页里。
import { getPins, getVouchers, has, discount } from "../_pins.js";
export async function onRequestPost({ request, env }) {
  const bad = (m, s = 400) => new Response(JSON.stringify({ ok: false, error: m }), { status: s, headers: { "content-type": "application/json" } });
  let o; try { o = await request.json(); } catch { return bad("Invalid JSON"); }
  const s = (v, n) => String(v ?? "").replace(/[<>]/g, "").slice(0, n);
  if (!o.name || !/^[0-9+\-\s]{8,16}$/.test(o.phone || "") || !Array.isArray(o.items) || !o.items.length || o.items.length > 30) return bad("Invalid order");
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return bad("Notification not configured", 503);
  const pinMap = getPins(env), pins = (Array.isArray(o.pins) ? o.pins : []).map(p => String(p).toUpperCase().trim()).filter((p, i, a) => has(pinMap, p) && a.indexOf(p) === i);
  const allowed = pins.reduce((t, p) => t + Number(pinMap[p]), 0), claimed = Math.max(0, Number(o.credit) || 0), tot = Math.max(0, Number(o.total) || 0);
  const vMap = getVouchers(env), vCode = String(o.voucher || "").toUpperCase().trim(), v = vCode && has(vMap, vCode) ? vMap[vCode] : null;
  const vClaim = Math.max(0, Number(o.discount) || 0), vOk = v ? discount(v, tot) : 0;
  let extra = "";
  if (vCode) extra += `\nVoucher: ${s(vCode, 24)} -RM ${vClaim.toFixed(2)}${!v ? " ⚠ INVALID CODE" : vClaim > vOk + 0.01 ? " ⚠ MORE THAN ALLOWED (RM " + vOk.toFixed(2) + "), CHECK" : ""}`;
  if (claimed > 0) extra += `\nCredit used: RM ${claimed.toFixed(2)} (PIN: ${pins.join(", ") || "none valid"})${claimed > allowed ? " ⚠ MORE THAN PIN VALUE, CHECK" : ""}`;
  if (extra) extra += `\nTo pay (client): RM ${Math.max(0, tot - vClaim - claimed).toFixed(2)}`;
  const creditLine = extra;
  const lines = o.items.map(i => `• ${s(i.name, 80)} x${Math.min(99, parseInt(i.qty) || 1)}`).join("\n");
  const text = `🧁 New order (unpaid, to confirm)\nName: ${s(o.name, 60)}\nPhone: ${s(o.phone, 16)}\n${s(o.method, 10)}: ${s(o.address, 200) || "-"}\nDate: ${s(o.date, 30) || "-"}\n${o.payment ? "Payment: " + s(o.payment, 60) + "\n" : ""}\n${lines}\nTotal (client): RM ${Number(o.total || 0).toFixed(2)}${creditLine}\nNote: ${s(o.note, 300) || "-"}`;
  const r = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text }) });
  return r.ok ? new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } }) : bad("Send failed", 502);
}

