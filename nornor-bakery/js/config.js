// 店家设置 / Shop settings — 只改这里 (edit here only)
const CONFIG = {
  shopName: "Nor Nor Bakery",
  whatsapp: "601155072517",          // 国家码+号码，不要 + 和空格
  instagram: "",                      // 例: https://instagram.com/xxx (留空=不显示)
  tiktok: "",
  generalCheckoutUrl: "",             // 以后有付款链接填这里 (留空=用订单表单)
  orderApi: "/api/order",             // 自动通知 (Cloudflare Function -> Telegram)
  address: "",                        // 待填 / TBC
  hours: "",                          // 待填 / TBC
  deliveryInfo: "",
  pickupInfo: "",
  refundPolicy: "",
  // 支付方式 / Payment methods — detail 填收款号码或账户名，qr 填二维码图片路径(例 "assets/payment/tng-qr.png")。
  // 留空 = 显示“确认订单后在 WhatsApp 提供”。不需要的方式可以删掉。网站本身不收款。
  payments: [
    { name: "Touch 'n Go eWallet", icon: "💙", detail: "", qr: "" },
    { name: "DuitNow / Bank transfer", icon: "🏦", detail: "", qr: "" },
    { name: "Cash (pickup only)", icon: "💵", detail: "", qr: "" }
  ]
};

