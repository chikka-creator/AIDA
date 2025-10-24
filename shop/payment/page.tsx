"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "./types";


const STORAGE_KEY = "shop_cart_v1";


export default function PaymentPage() {
const router = useRouter();
const [products, setProducts] = useState<Record<string, Product>>({});
const [cart, setCart] = useState<Record<string, number>>({});


// replicate product list (should match /shop)
const PRODUCTS: Product[] = [
{ id: "1", title: "Bromo Preset", price: 125000, description: "preset for moody landscapes", image: "/gambar1.jpg" },
{ id: "2", title: "Bali Preset", price: 99000, description: "vibrant beach tones", image: "/gambar2.jpg" },
{ id: "3", title: "Lombok Pack", price: 150000, description: "sunset and warm tones", image: "/gambar3.jpg" },
{ id: "4", title: "Komodo Series", price: 175000, description: "wild and contrasty", image: "/gambar4.jpg" },
{ id: "5", title: "Raja Ampat", price: 200000, description: "aqua and teal boost", image: "/gambar5.jpg" },
{ id: "6", title: "Flores Film", price: 120000, description: "film-like grain", image: "/gambar6.jpg" },
{ id: "7", title: "Yogyakarta", price: 110000, description: "warm street preset", image: "/gambar7.jpg" },
{ id: "8", title: "Bandung", price: 95000, description: "soft moody", image: "/gambar8.jpg" },
{ id: "9", title: "Jakarta Urban", price: 105000, description: "urban contrast", image: "/gambar9.jpg" },
{ id: "10", title: "Sumatra", price: 130000, description: "rich shadows", image: "/gambar10.jpg" },
];


useEffect(() => {
const map = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
setProducts(map);
try {
const raw = localStorage.getItem(STORAGE_KEY);
if (raw) setCart(JSON.parse(raw));
} catch (e) {}
}, []);


const items = useMemo(() => Object.entries(cart), [cart]);
const total = useMemo(() => items.reduce((s, [id, qty]) => s + (products[id]?.price || 0) * qty, 0), [items, products]);


return (
<div className="page-root">
<div className="cart-popup">
<div className="cart-header">
<button className="back" onClick={() => router.back()}>←</button>
<h3>Checkout & Payment</h3>
</div>


<div className="cart-body">
<div className="cart-left">
<div className="cart-items">
{items.length === 0 ? (
<div className="empty">No items</div>
) : (
items.map(([id, qty]) => {
const p = products[id];
return (
<div className="cart-item" key={id}>
}