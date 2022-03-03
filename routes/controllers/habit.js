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

exports.postNewHabit = async (req, res, next) => {
  // req.body validation needed
  const { userId } = req.params;
  const { title } = req.body;

  if (!ObjectId.isValid(userId)) {
    const error = createError(400, { message: AUTH_MESSAGE.invalidUser });
    next(error);

    return;
  }

  try {
    const newHabit = await habitService.postNewHabit(title, userId);

    res.json({
      newHabit,
    });
  } catch (err) {
    const error = createError(500, err, {
      message: COMMON_MESSAGE.invalidServerError,
    });
    next(error);
  }
};

exports.deleteHabit = async (req, res, next) => {
  const { userId, habitId } = req.params;

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(habitId)) {
    // habitId에 대해서 오류인 경우의 메시지도 업데이트 해줘야 함.
    const error = createError(400, { message: AUTH_MESSAGE.invalidUser });
    next(error);

    return;
  }

  try {
    await habitService.deleteHabit(habitId, userId);

    res.json({
      result: "success",
    });
  } catch (err) {
    const error = createError(500, err, {
      message: COMMON_MESSAGE.invalidServerError,
    });
    next(error);
  }
};
