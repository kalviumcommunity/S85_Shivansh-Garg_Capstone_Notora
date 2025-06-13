const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const DEV = process.env.NODE_ENV === "development";

exports.register = async (req, res) => {
  if (DEV) console.debug("🟢 [REGISTER] payload:", req.body);
  const { name, email, password } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Signup successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error("❌ [REGISTER] error:", err);
    res.status(500).json({ error: "Server error during signup" });
  }
};

exports.login = async (req, res) => {
  if (DEV) console.debug("🔵 [LOGIN] payload:", req.body);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role,
        isPremium: user.isPremium 
      },
      token,
    });
  } catch (err) {
    console.error("❌ [LOGIN] error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("name email _id isPremium role");
    console.log('Current user data:', {
      id: user._id,
      name: user.name,
      role: user.role,
      isPremium: user.isPremium
    });
    
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium
      }
    });
  } catch (err) {
    console.error('Error in getCurrentUser:', err);
    res.status(500).json({ error: "Server error fetching user" });
  }
};

