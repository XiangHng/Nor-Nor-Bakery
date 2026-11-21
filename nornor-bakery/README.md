# Nor Nor Bakery 网站

## 改东西（只改这两个文件）
- `js/products.js`：商品名、价钱(RM)、描述、图片、库存(`available:false`=售罄)、标签、各商品付款链接 `checkoutUrl`。
- `js/config.js`：WhatsApp 号码、Instagram/TikTok、地址、营业时间、配送/自取/退款说明、总付款链接。留空的会显示“待店家确认”。

## 换图片
把照片放进 `assets/images/`，在 `products.js` 里把 `image` 改成 `"assets/images/文件名.jpg"`。建议 800×800 左右、小于 300KB。

## 部署（免费，Cloudflare Pages）
1. 把整个文件夹上传到 GitHub 新仓库。
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → 选仓库。
3. Build command 留空，Output directory 填 `/`。Deploy。

## 订单自动通知（Telegram，免费）
1. Telegram 找 @BotFather → `/newbot` → 得到 token。
2. 给你的机器人发一句话，再打开 `https://api.telegram.org/bot<TOKEN>/getUpdates` 找 `chat.id`。
3. Cloudflare Pages → Settings → Variables and Secrets 加：`TELEGRAM_BOT_TOKEN`、`TELEGRAM_CHAT_ID`，然后重新 Deploy。
没设置也能用：顾客会看到 WhatsApp 按钮，订单发到 WhatsApp。

## 说明
- 目前没有网上付款。订单只是“已提交”，店家 WhatsApp 确认后再收款。有付款链接后填进 `config.js` / `products.js` 即可。
- 总价由顾客浏览器计算，仅供参考，店家确认时请核对。
- 以后加后台/库存：保持 `products.js` 的格式，改成从 API 读取即可。
