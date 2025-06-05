// app.use("/api/auth", googleAuthRoutes);

const express = require("express");
const passport = require("passport");
const { success, failure } = require("../controllers/googleAuthController");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Start Google OAuth flow
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect to frontend with token and user data
    const userData = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    };
    
    const queryParams = new URLSearchParams({
      token,
      user: JSON.stringify(userData)
    });

    res.redirect(`http://localhost:5173/auth/google/callback?${queryParams.toString()}`);
  }
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logout successful" });
});

// Optional success/failure routes
router.get("/success", success);
router.get("/failure", failure);

module.exports = router;


// const express = require("express");
// const passport = require("passport");
// const { success, failure } = require("../controllers/googleAuthController");

// const router = express.Router();

// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "http://localhost:5173/", // 
//     failureRedirect: "http://localhost:3000/login",
//   })
// );

// router.get("/success", success);
// router.get("/failure", failure);

// module.exports = router;
