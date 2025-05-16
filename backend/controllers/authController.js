const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ———— Register New User ————
exports.register = async (req, res) => {
  console.log("🟢 [REGISTER] payload:", req.body);
  const { name, email, password } = req.body;

  try {
    // 1. Check existing
    if (await User.findOne({ email })) {
      console.log("🟢 [REGISTER] email in use:", email);
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2. Create & save (model hook will hash)
    const user = new User({ name, email, password });
    await user.save();
    console.log("🟢 [REGISTER] created user:", user);

    // 3. Issue JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log("🟢 [REGISTER] token issued");

    // 4. Respond
    res.status(201).json({
      message: "Signup successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("❌ [REGISTER] error:", error);
    res.status(500).json({ message: "Signup failed", details: error.message });
  }
};

// ———— Login Existing User ————
exports.login = async (req, res) => {
  console.log("🔵 [LOGIN] payload:", req.body);
  const { email, password } = req.body;

  try {
    // 1. Find
    const user = await User.findOne({ email });
    console.log("🔵 [LOGIN] found user:", !!user);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Compare
    console.log("🔵 [LOGIN] plain:", password);
    console.log("🔵 [LOGIN] hash:", user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔵 [LOGIN] password match?:", isMatch);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // 3. Issue JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log("🔵 [LOGIN] token issued");

    // 4. Respond
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("❌ [LOGIN] error:", error);
    res.status(500).json({ message: "Login failed", details: error.message });
  }
};
