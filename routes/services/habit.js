const User = require("../../models/User");
const Habit = require("../../models/Habit");
const CatImage = require("../../models/CatImage");

const makeDateListData = require("../../utils/makeDateListData");

exports.getHabitList = async (userId) => {
  const targetUser = await User.findById(userId)
    .populate("habits")
    .populate({
      path: "habits",
      populate: { path: "catImage.catType" },
    });

  const activeHabits = targetUser.habits.map((activeHabit) => {
    return {
      id: activeHabit._id,
      title: activeHabit.title,
      endDate: activeHabit.dateList[activeHabit.dateList.length - 1].date,
      dateList: activeHabit.dateList,
      catImage:
        activeHabit.catImage.catType.catStatusList[
          activeHabit.catImage.catStatus
        ],
      status: activeHabit.catImage.catStatus,
    };
  });

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
          ? habit.catImage.catStatus === 7
          : habit.catImage.catStatus !== 7)
      );
    })
    .map((expiredHabit) => {
      return {
        id: expiredHabit._id,
        title: expiredHabit.title,
        endDate: expiredHabit.dateList[expiredHabit.dateList.length - 1].date,
        dateList: expiredHabit.dateList,
        catImage:
          expiredHabit.catImage.catType.catStatusList[
            expiredHabit.catImage.catStatus
          ],
        status: expiredHabit.catImage.catStatus,
      };
    });

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

exports.postNewHabit = async (title, currentDate, userId) => {
  const catImageList = await CatImage.find().lean().exec();
  const catImageIndex = Math.floor(Math.random() * 7);
  const dateList = makeDateListData(currentDate);

  const newHabit = await Habit.create({
    author: userId,
    title,
    dateList,
    catImage: {
      catType: catImageList[catImageIndex]._id,
      catStatus: 0,
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

  let currentStatus = 0;
  updatedHabitList.forEach(({ date, isChecked }) => {
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
