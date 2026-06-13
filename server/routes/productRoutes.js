const express = require('express');
const router = express.Router();

// 1. GET ALL PRODUCTS (Homepage Fetch)
router.get('/', async (req, res) => {
    try {
        const products = await global.db.products.find({});
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 2. ADD NEW PRODUCT
router.post('/add', async (req, res) => {
    try {
        const newProduct = await global.db.products.insert(req.body);
        res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 3. LIVE UPDATE DISCOUNT & MRP ENGINE (Admin Live Control)
router.post('/update', async (req, res) => {
    try {
        const { id, price, originalPrice, discount } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Product Selection ID Missing!" });
        }

        // Database edit operation trigger
        await global.db.products.update(
            { _id: id },
            { $set: { 
                price: Number(price), 
                originalPrice: Number(originalPrice), 
                discount: Number(discount) 
            } },
            {}
        );

        res.status(200).json({ success: true, message: "Live Market rates updated successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;