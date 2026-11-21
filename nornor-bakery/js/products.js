// 商品资料 / Product data — 改价钱、图片、库存都在这里
// image 留空会显示占位图。available:false = 售罄。checkoutUrl 以后可填各商品付款链接。
const CATEGORIES = ["Cakes", "Cookies", "Brownies", "Pastries"];
const PRODUCTS = [
  { id: "choc-oreo-cake", name: "Chocolate Chip & Oreo Cake", category: "Cakes", price: 38,
    desc: "Fluffy homemade sponge with chocolate chips and Oreo crumbs. Freshly baked daily.",
    image: "assets/images/choc-oreo-cake.jpg", available: true, labels: ["Best Seller"], popularity: 100, checkoutUrl: "" },
  { id: "sample-brownies", name: "Fudgy Brownies (box of 6)", category: "Brownies", price: 22,
    desc: "SAMPLE – edit this product. Rich, fudgy chocolate brownies.",
    image: "", available: true, labels: ["New"], popularity: 60, checkoutUrl: "" },
  { id: "sample-cookies", name: "Choc Chip Cookies (jar)", category: "Cookies", price: 25,
    desc: "SAMPLE – edit this product. Crisp edges, soft centre.",
    image: "", available: true, labels: [], popularity: 50, checkoutUrl: "" },
  { id: "sample-pastry", name: "Butter Croissant (3 pcs)", category: "Pastries", price: 15,
    desc: "SAMPLE – edit this product. Sold out example.",
    image: "", available: false, labels: [], popularity: 20, checkoutUrl: "" }
];
