const express = require("express");
const router = express.Router();

const authController = require("./controllers/auth");
const verifyGoogleIdToken = require("./middleware/verifyGoogleIdToken");

router.get("/login", verifyGoogleIdToken, authController.getLogin);

module.exports = router;
