const express = require("express");
const router = express.Router();

const authController = require("./controllers/auth");
const verifyGoogleIdToken = require("./middleware/verifyGoogleIdToken");

router.get("/login", verifyGoogleIdToken, authController.getLogin);
//logout에 verifyToken 미들웨어 체크해줄 것.
router.get("/logout", authController.getLogout);

module.exports = router;
