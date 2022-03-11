const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const createError = require("http-errors");

const {
  AUTH_MESSAGE,
  COMMON_MESSAGE,
} = require("../../constants/dataValidationMessage");
const { RESPONSE_MESSAGE } = require("../../constants/responseMessage");
const habitService = require("../services/habit");

exports.getHabitList = async (req, res, next) => {
  const { userId } = req.params;

  if (!ObjectId.isValid(userId)) {
    const error = createError(400, { message: AUTH_MESSAGE.invalidUser });
    next(error);

    return;
  }

  try {
    if (!Object.keys(req.query).length) {
      const targetHabitList = await habitService.getHabitList(userId);

      res.json({
        habitList: targetHabitList,
      });
    } else {
      const { limit, status, localTime, page } = req.query;
      const { expiredHabitList, nextPage } =
        await habitService.getExpiredHabitList(
          userId,
          limit,
          status,
          localTime,
          page
        );

      res.json({
        habitList: expiredHabitList,
        nextPage,
      });
    }
  } catch (err) {
    const error = createError(500, err, {
      message: COMMON_MESSAGE.invalidServerError,
    });
    next(error);
  }
};

exports.postNewHabit = async (req, res, next) => {
  const { userId } = req.params;
  const { title, localTimeOffset } = req.body;

  if (!ObjectId.isValid(userId)) {
    const error = createError(400, { message: AUTH_MESSAGE.invalidUser });
    next(error);

    return;
  }

  try {
    const newHabit = await habitService.postNewHabit(
      title,
      localTimeOffset,
      userId
    );

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

exports.updateHabitStatus = async (req, res, next) => {
  const { userId, habitId } = req.params;
  const { currentLocalDate, localTimeOffset } = req.body;

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(habitId)) {
    const error = createError(400, { message: AUTH_MESSAGE.invalidObjectIds });
    next(error);

    return;
  }

  try {
    const updatedStatus = await habitService.updateHabitStatus(
      currentLocalDate,
      localTimeOffset,
      habitId
    );

    res.json({
      result: RESPONSE_MESSAGE.success,
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
    const error = createError(400, { message: AUTH_MESSAGE.invalidObjectIds });
    next(error);

    return;
  }

  try {
    const response = await habitService.deleteHabit(habitId, userId);

    res.json({
      result: RESPONSE_MESSAGE.success,
    });
  } catch (err) {
    const error = createError(500, err, {
      message: COMMON_MESSAGE.invalidServerError,
    });
    next(error);
  }
};
