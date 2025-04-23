const express = require("express")
const router = express.Router();
const User = require("../models/user");

router.post("/register", async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;

    // Validate inputs
    if (!name || !email || !password || !confirmpassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmpassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Create new user
        const newUser = new User({ name, email, password });
        const user = await newUser.save();
        
        // Return user data without password
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        };
        
        res.status(201).json(userResponse);
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            message: "Registration failed",
            error: error.message 
        });
    }
});


// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Simple password comparison (in production, use bcrypt.compare())
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Return the full user object including isAdmin
        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});


router.get("/getallusers", async (req, res) => {
    try {
        const users = await User.find()
        res.send(users)

    } catch (error) {
        return res.status(400).json({ error });

    }
});




router.get('/api/users/getuser/:userid', async (req, res) => {
    try {
        const user = await User.findById(req.params.userid, 'name email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
});

module.exports = router;