const express = require("express");
const passport = require("passport");
const { success, failure } = require("../controllers/googleAuthController");

const router = express.Router();

router.get("/success", success);
router.get("/failure", failure);

module.exports = router;
