const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../controllers/usercontroller");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/profile", authenticateToken, getUserProfile);

module.exports = router;
