const express = require("express");
const router = express.Router();

router.get("/login", (req, res, next) => {
  console.log(req);
});

router.get("/logout", (req, res, next) => {
  console.log(req);
});

module.exports = router;
