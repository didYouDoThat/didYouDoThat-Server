const User = require("../../models/User");
const Habit = require("../../models/Habit");
const CatImage = require("../../models/CatImage");

const { HABIT_NUMBERS } = require("../../constants/numbers");
const makeDateListData = require("../../utils/makeDateListData");
const makeClientData = require("../../utils/makeClientData");

exports.getHabitList = async (userId) => {
  const targetUser = await User.findById(userId)
    .populate("habits")
    .populate({
      path: "habits",
      populate: { path: "catImage.catType" },
    });

  const activeHabits = targetUser.habits.map(makeClientData);

  return activeHabits;
};

exports.getExpiredHabitList = async (
  userId,
  limit,
  status,
  localTime,
  page
) => {
  const targetUser = await User.findById(userId)
    .populate("habits")
    .populate({
      path: "habits",
      populate: { path: "catImage.catType" },
    });

  const expiredHabitList = targetUser.habits
    .filter((habit) => {
      return (
        new Date(localTime) -
          new Date(habit.dateList[habit.dateList.length - 1].date) >
          0 &&
        (status === "success"
          ? habit.catImage.catStatus === HABIT_NUMBERS.habitSuccessStatus
          : habit.catImage.catStatus !== HABIT_NUMBERS.habitSuccessStatus)
      );
    })
    .map(makeClientData);

  const finalExpiredHabitList = expiredHabitList.slice(
    Number(limit) * (Number(page) - 1),
    Number(limit) * Number(page)
  );
  const nextPage = Number(page) + 1;

  return {
    expiredHabitList: finalExpiredHabitList,
    status,
    nextPage,
  };
};

exports.postNewHabit = async (title, localTimeOffset, userId) => {
  const catImageList = await CatImage.find().lean().exec();
  const catImageIndex = Math.floor(Math.random() * 7);
  const currentDate = new Date();
  const dateList = makeDateListData(currentDate, localTimeOffset);

  const newHabit = await Habit.create({
    author: userId,
    title,
    dateList,
    catImage: {
      catType: catImageList[catImageIndex]._id,
      catStatus: HABIT_NUMBERS.initialStatus,
    },
  });

  await User.findByIdAndUpdate(userId, { $push: { habits: newHabit._id } });

  return {
    title,
    endDate: newHabit.dateList[newHabit.dateList.length - 1].date,
    catImage: catImageList[catImageIndex].catStatusList[4],
  };
};

exports.updateHabitStatus = async (currentLocalDate, habitId) => {
  const localDate = new Date(currentLocalDate);
  const targetHabit = await Habit.findById(habitId).lean().exec();

  const updatedHabitList = targetHabit.dateList.map((dateData) => {
    const limitDateData = new Date(dateData.date);

    if (localDate.getDate() === limitDateData.getDate()) {
      return {
        date: dateData.date,
        isChecked: !dateData.isChecked,
      };
    } else {
      return {
        date: dateData.date,
        isChecked: dateData.isChecked,
      };
    }
  });

  let currentStatus = HABIT_NUMBERS.initialStatus;
  updatedHabitList.forEach(({ isChecked }) => {
    if (isChecked) currentStatus++;
  });

  await Habit.findByIdAndUpdate(habitId, {
    dateList: updatedHabitList,
    catImage: {
      catType: targetHabit.catImage.catType,
      catStatus: currentStatus,
    },
  });
};

exports.deleteHabit = async (habitId, userId) => {
  await User.findByIdAndUpdate(userId, { $pull: { habits: habitId } });
  await Habit.findByIdAndRemove(habitId);
};
