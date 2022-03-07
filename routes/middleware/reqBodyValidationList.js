const { body } = require("express-validator");

const checkNewHabitInput = [
  body("title", "Title should be string").exists().isString(),
  body("currentDate", "CurrentData should be string").exists().isISO8601(),
];

const checkUpdateHabit = [
  body("currentLocalDate", "CurrentLocalDate should be ISO string.").isISO8601(),
]

module.exports = {
  checkNewHabitInput,
  checkUpdateHabit,
};
