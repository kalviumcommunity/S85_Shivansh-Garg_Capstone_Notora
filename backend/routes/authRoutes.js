const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { register, login, getCurrentUser } = require("../controllers/authController");
const router = express.Router();
const passport = require("passport");
require("../passport/google");
const User = require("../models/User");
const redisClient = require("../utils/redisClient");
const jwt = require('jsonwebtoken');

router.post("/logout", async (req, res) => {
  const authHeader = req.header("Authorization") || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(400).json({ error: "Token not provided" });
  }

  try {
    // Optional: decode token to get expiry time
    const decoded = jwt.decode(token);
    const exp = decoded.exp; // in seconds

    // Calculate TTL
    const now = Math.floor(Date.now() / 1000);
    const ttl = exp - now;

    if (ttl > 0) {
      await redisClient.setEx(`blacklist_${token}`, ttl, "true");
    }

    return res.status(200).json({ message: "Logout successful and token blacklisted" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", authMiddleware, getCurrentUser);

router.post("/signup", register);
router.post("/login", login);

module.exports = router;

// const express = require("express");
// const authMiddleware = require("../middlewares/authMiddleware");
// const { register, login, getCurrentUser } = require("../controllers/authController");
// const router = express.Router();
// const passport = require("passport");
// require("../passport/google");

// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// router.get("/me", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user).select("name email");
//     if (!user) return res.status(404).json({ error: "User not found" });
//     res.json({ user });
//   } catch (err) {
//     console.error("❌ [AUTH/ME] Error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "http://localhost:5173/", // 
//     failureRedirect: "http://localhost:3000/login",
//   })
// );

// router.post("/signup", register);
// router.post("/login", login);

// module.exports = router;