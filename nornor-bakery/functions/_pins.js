// PIN(免费额度) 与 Voucher(折扣码)。只在服务器验证，不会出现在网页代码里。
// 想改不改代码：在 Cloudflare Pages → Settings → Variables 加
//   PIN_CODES     例 {"MOH888":50,"NORNOR888":888}
//   VOUCHER_CODES 例 {"MOHHOUSE10":{"percent":10,"min":30,"max":15},"WELCOME5":{"off":5,"min":25}}
// percent = 百分比折扣；off = 固定扣 RM；min = 最低消费 RM；max = 最高折扣 RM；label = 显示文字(可选)
const PINS = { MOH888: 50, NORNOR888: 888 };
const VOUCHERS = {
  MOHHOUSE10: { percent: 10, min: 30, max: 15, label: "10% off (max RM15)" },
  WELCOME5: { off: 5, min: 25, label: "RM5 off" },
  NORNOR15: { off: 15, min: 80, label: "RM15 off" },
  SWEET20: { percent: 20, min: 60, max: 20, label: "20% off (max RM20)" }
};
const fromEnv = (v, d) => { try { if (v) { const o = JSON.parse(v); if (o && typeof o === "object") return o; } } catch {} return d; };
export const getPins = env => fromEnv(env && env.PIN_CODES, PINS);
export const getVouchers = env => fromEnv(env && env.VOUCHER_CODES, VOUCHERS);
export const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
// 折扣计算(服务器和网页用同一规则)
export function discount(v, subtotal) {
  if (!v || subtotal < (v.min || 0)) return 0;
  let d = v.percent ? subtotal * v.percent / 100 : (v.off || 0);
  if (v.max) d = Math.min(d, v.max);
  return Math.min(+d.toFixed(2), subtotal);
}
