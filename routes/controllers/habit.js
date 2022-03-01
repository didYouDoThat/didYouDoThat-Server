const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const createError = require("http-errors");

const habitService = require("../services/habit");
const {
  AUTH_MESSAGE,
  COMMON_MESSAGE,
} = require("../../constants/dataValidationMessage");

exports.getHabitList = async (req, res, next) => {
  const { userId } = req.params;

  if (!ObjectId.isValid(userId)) {
    const error = createError(400, { message: AUTH_MESSAGE.invalidUser });
    next(error);

    return;
  }

  try {
    const targetHabitList = await habitService.getHabitList(userId);

    res.json({
      habitList: targetHabitList,
    });
  } catch (err) {
    const error = createError(500, err, {
      message: COMMON_MESSAGE.invalidServerError,
    });
    next(error);
  }
};
