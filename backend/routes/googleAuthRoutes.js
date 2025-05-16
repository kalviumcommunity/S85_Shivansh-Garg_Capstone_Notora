const express = require("express");
const passport = require("passport");
const { success, failure } = require("../controllers/googleAuthController");

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
  }),
  (req, res) => {
    res.redirect("http://localhost:5173/");
  }
);

router.get("/success", success);
router.get("/failure", failure);

module.exports = router;
