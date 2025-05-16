const express = require("express");
const { register, login } = require("../controllers/authController");
const router = express.Router();
const passport = require("passport");
require("../passport/google");

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/", 
    failureRedirect: "http://localhost:5173/login",
  })
);

router.post("/signup", register);
router.post("/login", login);

module.exports = router;
