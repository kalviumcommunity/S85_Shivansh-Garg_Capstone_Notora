// app.use("/api/auth", googleAuthRoutes);

const express = require("express");
const passport = require("passport");
const { success, failure } = require("../controllers/googleAuthController");

const router = express.Router();

// Start Google OAuth flow
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/",
    failureRedirect: "http://localhost:5173/login",
  })
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // Optional: only if using session cookie
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

router.post("/logout", (req, res) => {
  // For JWT, just tell frontend to delete token
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
