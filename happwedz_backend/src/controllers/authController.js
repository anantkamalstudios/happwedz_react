
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");

// exports.register = async (req, res) => {
//     try {
//         const { name, email, password, phone, weddingVenue, country, city, weddingDate } = req.body;

//         const existingUser = await User.findOne({ where: { email } });
//         if (existingUser) {
//             return res.status(400).json({ message: "Email already registered" });
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//             phone,
//             weddingVenue,
//             country,
//             city,
//             weddingDate
//         });

//         res.status(201).json({
//             message: "✅ User registered successfully",
//             user: {
//                 id: newUser.id,
//                 name: newUser.name,
//                 email: newUser.email,
//                 phone: newUser.phone,
//                 weddingVenue: newUser.weddingVenue,
//                 country: newUser.country,
//                 city: newUser.city,
//                 weddingDate: newUser.weddingDate,
//             }
//         });
//     } catch (err) {
//         console.error("Register Error:", err);
//         res.status(500).json({ message: "Internal server error" });
//     }

// };
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // Use an environment variable in production
// const JWT_SECRET = "your_jwt_secret_here";

// // Register User
// exports.register = async (req, res) => {
//     try {
//         const { name, email, password, phone, weddingVenue, country, city, weddingDate } = req.body;

//         // Check if user already exists
//         const existingUser = await User.findOne({ where: { email } });
//         if (existingUser) {
//             return res.status(400).json({ message: "Email already registered" });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create user
//         const newUser = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//             phone,
//             weddingVenue,
//             country,
//             city,
//             weddingDate,
//         });

//         res.status(201).json({
//             message: "✅ User registered successfully",
//             user: {
//                 id: newUser.id,
//                 name: newUser.name,
//                 email: newUser.email,
//                 phone: newUser.phone,
//                 weddingVenue: newUser.weddingVenue,
//                 country: newUser.country,
//                 city: newUser.city,
//                 weddingDate: newUser.weddingDate,
//             },
//         });
//     } catch (err) {
//         console.error("Register Error:", err);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// // Login User
// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Find user by email
//         const user = await User.findOne({ where: { email } });
//         if (!user) return res.status(400).json({ message: "Invalid credentials" });

//         // Compare password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//         // Generate JWT token
//         const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

//         res.json({ message: "Login successful", token, user });
//     } catch (error) {
//         console.error("Login Error:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Use an environment variable in production
const JWT_SECRET = "your_jwt_secret_here";

// Temporary OTP storage (for demo; use Redis in production)
const otpStore = {};

// ------------------------ REGISTER ------------------------
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, weddingVenue, country, city, weddingDate } = req.body;

        // Check if user already exists by email or phone
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            weddingVenue,
            country,
            city,
            weddingDate,
        });

        res.status(201).json({
            message: "✅ User registered successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                weddingVenue: newUser.weddingVenue,
                country: newUser.country,
                city: newUser.city,
                weddingDate: newUser.weddingDate,
            },
        });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ------------------------ EMAIL/PASSWORD LOGIN ------------------------
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token, user });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ------------------------ SEND OTP (Mobile Login) ------------------------
exports.sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        const user = await User.findOne({ where: { phone } });
        if (!user) return res.status(400).json({ message: "Mobile number not registered" });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with 5 min expiry
        otpStore[phone] = { otp, expires: Date.now() + 5 * 60 * 1000 };

        // TODO: Send OTP via SMS provider (Twilio, etc.)
        console.log(`OTP for ${phone}: ${otp}`);

        res.json({ message: "OTP sent successfully" });
    } catch (err) {
        console.error("Send OTP Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ------------------------ VERIFY OTP ------------------------
exports.verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const record = otpStore[phone];

        if (!record) return res.status(400).json({ message: "OTP not found. Request a new one." });
        if (record.expires < Date.now()) return res.status(400).json({ message: "OTP expired" });
        if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

        const user = await User.findOne({ where: { phone } });

        const token = jwt.sign({ id: user.id, phone: user.phone }, JWT_SECRET, { expiresIn: "1h" });

        // Delete OTP after verification
        delete otpStore[phone];

        res.json({ message: "Login successful", token, user });
    } catch (err) {
        console.error("Verify OTP Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
