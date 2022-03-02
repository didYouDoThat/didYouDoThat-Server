const express = require("express");
const router = express.Router();

const habitController = require("../routes/controllers/habit");
const verifyToken = require("./middleware/verifyToken");

router.get("/:userId", verifyToken, habitController.getHabitList);
router.post("/:userId/habit", verifyToken, habitController.postNewHabit);

router.put("/:userId/habits/:habitId", (req, res, next) => {
  console.log(req);
});

router.delete("/:userId/habits/:habitId", (req, res, next) => {
  console.log(req);
});

module.exports = router;
