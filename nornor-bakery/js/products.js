// 商品资料 / Product data — 改价钱、图片、库存都在这里
// image 留空会显示彩色占位图(用 emoji)。available:false = 售罄。checkoutUrl 以后可填各商品付款链接。
// emoji 可选，只用在没有照片时。价钱是示例价，请按你的实际价钱修改。
const CATEGORIES = ["Cakes", "Cookies", "Brownies", "Pastries", "Premium Drinks", "Fruit Juices", "Blind Box"];
const P = (id, name, category, price, desc, o = {}) => ({
  id, name, category, price, desc, image: "", available: true, labels: [], popularity: 50, checkoutUrl: "", emoji: "", ...o
});
const PRODUCTS = [
  // ---- Cakes ----
  P("choc-oreo-cake", "Chocolate Chip & Oreo Cake", "Cakes", 38,
    "Fluffy homemade sponge with chocolate chips and Oreo crumbs. Freshly baked daily.",
    { image: "assets/images/choc-oreo-cake.jpg", labels: ["Best Seller"], popularity: 100 }),
  P("pandan-gula-melaka", "Pandan Gula Melaka Cake", "Cakes", 38,
    "Soft pandan sponge layered with fragrant gula melaka cream. Made with real pandan juice.",
    { labels: ["New", "Pandan"], popularity: 95, emoji: "🌿" }),
  P("pandan-chiffon", "Pandan Coconut Chiffon", "Cakes", 32,
    "Light and airy pandan chiffon with a fresh coconut aroma. Not too sweet.",
    { labels: ["Pandan"], popularity: 88, emoji: "🌿" }),
  P("banana-cake", "Classic Banana Cake", "Cakes", 28,
    "Moist homemade banana cake baked with ripe bananas and a hint of cinnamon.",
    { labels: ["New"], popularity: 90, emoji: "🍌" }),
  P("banana-walnut-loaf", "Banana Walnut Loaf", "Cakes", 26,
    "Dense, buttery banana loaf with crunchy toasted walnuts.",
    { popularity: 70, emoji: "🍌" }),
  P("banana-choc-cake", "Banana Chocolate Cake", "Cakes", 34,
    "Banana cake with rich chocolate ganache and chocolate chips.",
    { popularity: 75, emoji: "🍌" }),
  P("red-velvet", "Red Velvet Cake", "Cakes", 42,
    "Velvety red sponge with smooth cream cheese frosting.",
    { popularity: 80, emoji: "❤️" }),
  P("burnt-cheesecake", "Basque Burnt Cheesecake", "Cakes", 45,
    "Creamy, caramelised top and a soft centre. Best served slightly chilled.",
    { labels: ["Premium"], popularity: 85, emoji: "🧀" }),
  // ---- Cookies ----
  P("choc-chip-cookies", "Choc Chip Cookies (jar)", "Cookies", 25,
    "Crisp edges, soft centre, loaded with chocolate chips.",
    { popularity: 50 }),
  P("salted-egg-cookies", "Salted Egg Yolk Cookies (jar)", "Cookies", 32,
    "Buttery, crumbly cookies with a rich salted egg yolk flavour.",
    { labels: ["Popular"], popularity: 78, emoji: "🥚" }),
  P("pandan-cookies", "Pandan Coconut Cookies (jar)", "Cookies", 26,
    "Melt-in-the-mouth cookies with pandan and toasted coconut.",
    { labels: ["Pandan"], popularity: 65, emoji: "🌿" }),
  // ---- Brownies ----
  P("fudgy-brownies", "Fudgy Brownies (box of 6)", "Brownies", 22,
    "Rich, fudgy chocolate brownies with a crackly top.",
    { labels: ["New"], popularity: 60 }),
  P("walnut-brownies", "Walnut Brownies (box of 6)", "Brownies", 24,
    "Fudgy brownies topped with crunchy walnuts.",
    { popularity: 55, emoji: "🌰" }),
  P("caramel-brownies", "Salted Caramel Brownies (box of 6)", "Brownies", 26,
    "Dark chocolate brownies with a salted caramel swirl.",
    { popularity: 62, emoji: "🍯" }),
  // ---- Pastries ----
  P("croissant", "Butter Croissant (3 pcs)", "Pastries", 15,
    "Flaky, buttery croissants. Sold out example, set available:true to sell.",
    { available: false, popularity: 20 }),
  P("egg-tart", "Egg Tarts (box of 6)", "Pastries", 18,
    "Crisp buttery shell with silky egg custard.",
    { popularity: 58, emoji: "🥧" }),
  P("cinnamon-roll", "Cinnamon Rolls (box of 4)", "Pastries", 20,
    "Soft rolls with cinnamon sugar and cream cheese glaze.",
    { popularity: 52, emoji: "🌀" }),
  // ---- Premium Drinks ----
  P("spanish-latte", "Iced Spanish Latte", "Premium Drinks", 13,
    "Double espresso, fresh milk and sweet condensed milk over ice.",
    { labels: ["Best Seller"], popularity: 92, emoji: "☕" }),
  P("gula-melaka-coffee", "Gula Melaka Coffee", "Premium Drinks", 13,
    "Smooth coffee with house gula melaka syrup and fresh milk.",
    { labels: ["Signature"], popularity: 86, emoji: "☕" }),
  P("matcha-latte", "Premium Matcha Latte", "Premium Drinks", 15,
    "Ceremonial-grade matcha whisked with fresh milk. Hot or iced.",
    { labels: ["Premium"], popularity: 82, emoji: "🍵" }),
  P("hojicha-latte", "Roasted Hojicha Latte", "Premium Drinks", 14,
    "Roasted green tea with a nutty, caramel aroma. Hot or iced.",
    { popularity: 66, emoji: "🍵" }),
  P("belgian-choc", "Belgian Hot Chocolate", "Premium Drinks", 14,
    "Thick, velvety chocolate made with real Belgian chocolate.",
    { popularity: 64, emoji: "🍫" }),
  P("thai-milk-tea", "Premium Thai Milk Tea", "Premium Drinks", 10,
    "Strong Thai tea with creamy milk over ice.",
    { popularity: 60, emoji: "🧋" }),
  P("rose-lychee-sparkling", "Rose Lychee Sparkling", "Premium Drinks", 13,
    "Sparkling water with lychee and rose syrup. Light and refreshing.",
    { labels: ["New"], popularity: 68, emoji: "🌹" }),
  // ---- Fruit Juices ----
  P("orange-juice", "Fresh Orange Juice", "Fruit Juices", 10,
    "Squeezed to order. No added sugar.",
    { popularity: 75, emoji: "🍊" }),
  P("watermelon-juice", "Watermelon Juice", "Fruit Juices", 8,
    "Cold, sweet and hydrating, blended from fresh watermelon.",
    { popularity: 72, emoji: "🍉" }),
  P("mango-juice", "Mango Juice", "Fruit Juices", 12,
    "Thick and creamy juice from ripe sweet mangoes.",
    { labels: ["Popular"], popularity: 80, emoji: "🥭" }),
  P("pineapple-mint", "Pineapple Mint Juice", "Fruit Juices", 10,
    "Tangy pineapple with a fresh mint finish.",
    { popularity: 58, emoji: "🍍" }),
  P("apple-carrot", "Apple Carrot Juice", "Fruit Juices", 11,
    "Naturally sweet blend of apple and carrot.",
    { popularity: 45, emoji: "🥕" }),
  P("strawberry-banana", "Strawberry Banana Smoothie", "Fruit Juices", 13,
    "Creamy smoothie with strawberries, banana and a touch of yoghurt.",
    { labels: ["New"], popularity: 70, emoji: "🍓" }),
  P("dragonfruit-juice", "Dragon Fruit Juice", "Fruit Juices", 11,
    "Vibrant pink juice from red dragon fruit.",
    { popularity: 50, emoji: "🐉" }),
  // ---- Blind Box ----
  P("blind-box", "Mystery Blind Box", "Blind Box", 29,
    "1 random collectible figurine from 3 designs, including a chance at the hidden limited edition. Packed randomly by the shop.",
    { image: "assets/blindbox/box.svg", labels: ["New", "Limited"], popularity: 97, emoji: "🎁" })
];

// 盲盒设定 / Blind box setup — chance 是你们装箱的比例(合计 100)，请按实际装箱比例修改。
const BLINDBOX = {
  productId: "blind-box",
  figures: [
    { id: "dog", name: "Latte Pup", note: "A little dog sipping coffee", rarity: "Regular", chance: 45, image: "assets/blindbox/dog.svg" },
    { id: "cat", name: "Cake Kitty", note: "A kitty sitting down to eat cake", rarity: "Regular", chance: 45, image: "assets/blindbox/cat.svg" },
    { id: "trex", name: "Sunny Rex", note: "T-rex in sunglasses, sunbathing with fruit juice", rarity: "Hidden · Limited", chance: 10, image: "assets/blindbox/trex.svg", hidden: true }
  ]
};
