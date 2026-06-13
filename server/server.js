const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// MASTER CORE DATABASE SEEDER PIPELINE
setTimeout(async () => {
    try {
        const count = await global.db.products.count({});
        // Agar items 4 se kam hain to naya full dynamic stock reload hoga
        if (count < 4) {
            await global.db.products.remove({}, { multi: true }); // Reset fresh pool
            console.log("📦 Injecting JadounHub Complete Multi-Category Inventory Database...");
            
            const fullMarketplaceStock = [
                {
                    name: "Premium Wireless Earbuds",
                    price: 2999, originalPrice: 2999, discount: 10,
                    category: "Electronics", gender: "All", sizes: ["Standard"],
                    colors: ["Black", "White"], rating: 4.8,
                    img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df"
                },
                {
                    name: "Luxury Leather Chronograph Watch",
                    price: 8999, originalPrice: 12999, discount: 30,
                    category: "Electronics", gender: "Male", sizes: ["Standard"],
                    colors: ["Tan Leather", "Onyx Black"], rating: 4.9,
                    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                },
                {
                    name: "Slim-Fit Core Denim Jacket",
                    price: 2499, originalPrice: 3999, discount: 37,
                    category: "Fashion", gender: "Male", sizes: ["M", "L", "XL"],
                    colors: ["Classic Blue", "Dark Gray"], rating: 4.6,
                    img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0"
                },
                {
                    name: "Oversized Streetwear Graphic Hoodie",
                    price: 1999, originalPrice: 2999, discount: 33,
                    category: "Fashion", gender: "All", sizes: ["S", "M", "L", "XL"],
                    colors: ["Beige", "Black"], rating: 4.7,
                    img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7"
                },
                {
                    name: "JadounHub Retro Urban Sneaker v2",
                    price: 4999, originalPrice: 7999, discount: 37,
                    category: "Shoes", gender: "Male", sizes: ["7", "8", "9", "10"],
                    colors: ["White/Blue", "All-Black"], rating: 4.9,
                    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                },
                {
                    name: "Minimalist Ceramic Matte Vase Set",
                    price: 1899, originalPrice: 2499, discount: 24,
                    category: "Home Decor", gender: "All", sizes: ["Standard"],
                    colors: ["Beige", "Terracotta"], rating: 4.5,
                    img: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c"
                }
            ];

            for (let product of fullMarketplaceStock) {
                await global.db.products.insert(product);
            }
            console.log("🚀 Complete Catalog (Electronics, Fashion, Shoes, Decor) Loaded Live!");
        }
    } catch (err) {
        console.error("Database Seeding Error:", err.message);
    }
}, 1000);

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server fully running on port ${PORT}`);
});