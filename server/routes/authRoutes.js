const express = require('express');
const router = express.Router();

// TARGET API: http://localhost:5000/api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are mandatory!" });
        }

        const userExists = await global.db.users.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "Email already registered!" });
        }

        const newUser = await global.db.users.insert({ name, email, password });
        
        res.status(201).json({ 
            success: true, 
            message: "User Registered Successfully inside Server Database!",
            user: { name: newUser.name, email: newUser.email }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// TARGET API: http://localhost:5000/api/auth/signin
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all fields!" });
        }

        const user = await global.db.users.findOne({ email, password });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid Email or Password!" });
        }

        res.status(200).json({
            success: true,
            message: `Welcome back ${user.name}!`,
            user: { name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;