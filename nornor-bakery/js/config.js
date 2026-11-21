// 店家设置 / Shop settings — 只改这里 (edit here only)
const CONFIG = {
  shopName: "Nor Nor Bakery",
  whatsapp: "601155072517",          // 国家码+号码，不要 + 和空格
  instagram: "",                      // 例: https://instagram.com/xxx (留空=不显示)
  tiktok: "",
  generalCheckoutUrl: "",             // 以后有付款链接填这里 (留空=用订单表单)
  orderApi: "/api/order",
  pinApi: "/api/pin",                 // PIN 验证 (Cloudflare Function)             // 自动通知 (Cloudflare Function -> Telegram)
  address: "",                        // 待填 / TBC
  hours: "",                          // 待填 / TBC
  deliveryInfo: "",
  pickupInfo: "",
  refundPolicy: "",
  // 支付方式 / Payment methods — 目前留空(网站显示“确认订单后 WhatsApp 告知”)。以后要加就按下面格式填:
  // { name: "Touch 'n Go eWallet", icon: "💙", detail: "收款号码/名字", qr: "assets/payment/tng-qr.png" }
  // 网站本身不收款。
  payments: [],
  promoHint: "New here? Try voucher WELCOME5 for RM5 off (min spend RM25)."   // 页面上公开显示的优惠提示，留空=不显示
};

