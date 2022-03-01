const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const createError = require("http-errors");

const habitService = require("../services/habit");

exports.getHabitList = async (req, res, next) => {
  const { userId } = req.params;

  if (!ObjectId.isValid(userId)) {
    const error = createError(400, { message: "Invalid User" });
    next(error);

    return;
  }

  try {
    const targetHabitList = await habitService.getHabitList(userId);

    res.json({
      habitList: targetHabitList,
    });
  } catch (err) {
    const error = createError(500, err, { message: "Invalid Server Error" });
    next(error);
  }
};
