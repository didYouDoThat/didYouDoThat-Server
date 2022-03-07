const express = require("express");
const router = express.Router();

const habitController = require("../routes/controllers/habit");
const verifyToken = require("./middleware/verifyToken");
const validator = require("./middleware/validator");
const { checkNewHabitInput, checkUpdateHabit } = require("./middleware/reqBodyValidationList");

router.get("/:userId", verifyToken, habitController.getHabitList);
router.post("/:userId/habit", verifyToken, validator(checkNewHabitInput), habitController.postNewHabit);
router.put("/:userId/habits/:habitId", verifyToken, validator(checkUpdateHabit), habitController.updateHabitStatus);
router.delete("/:userId/habits/:habitId", verifyToken, habitController.deleteHabit);

module.exports = router;
