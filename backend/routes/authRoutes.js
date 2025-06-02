// app.use("/api/auth", authRoutes);


const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { register, login, getCurrentUser } = require("../controllers/authController");
const router = express.Router();
const passport = require("passport");
require("../passport/google");
const User = require("../models/User");


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