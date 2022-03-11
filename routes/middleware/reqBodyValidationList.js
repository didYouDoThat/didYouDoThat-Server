const { body } = require("express-validator");

const { REQBODY_MESSAGE } = require("../../constants/dataValidationMessage");

const checkNewHabitInput = [
  body("title", REQBODY_MESSAGE.habitTitleError).exists().isString(),
  body("localTimeOffset", REQBODY_MESSAGE.habitLocalTimeOffsetError)
    .exists()
    .isNumeric(),
];

const checkUpdateHabit = [
  body("currentLocalDate", REQBODY_MESSAGE.updateHabitDateError)
    .exists()
    .isISO8601(),
  body("localTimeOffset", REQBODY_MESSAGE.habitLocalTimeOffsetError)
    .exists()
    .isNumeric(),
];

module.exports = {
  checkNewHabitInput,
  checkUpdateHabit,
};
