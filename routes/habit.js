const express = require("express");
const router = express.Router();

router.get("/:userId", (req, res, next) => {
  console.log(req);
});

router.post("/:userId/habit", (req, res, next) => {
  console.log(req);
});

router.put("/:userId/habits/:habitId", (req, res, next) => {
  console.log(req);
});

router.delete("/:userId/habits/:habitId", (req, res, next) => {
  console.log(req);
});

module.exports = router;
