const { body } = require("express-validator");

const { REQBODY_MESSAGE } = require("../../constants/dataValidationMessage");

const checkNewHabitInput = [
  body("title", REQBODY_MESSAGE.habitTitleError).exists().isString(),
  body("currentDate", REQBODY_MESSAGE.habitCurrentDateError)
    .exists()
    .isISO8601(),
];

const checkUpdateHabit = [
  body("currentLocalDate", REQBODY_MESSAGE.updateHabitDateError)
    .exists()
    .isISO8601(),
];

module.exports = {
  checkNewHabitInput,
  checkUpdateHabit,
};
