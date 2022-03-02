const User = require("../../models/User");
const Habit = require("../../models/Habit");
const CatImage = require("../../models/CatImage");

const { TIME_NUMBERS } = require("../../constants/numbers");
const makeDateListData = require("../../utils/makeDateListData");

exports.getHabitList = async (userId) => {
  const currentDate = new Date();

  const targetUser = await User.findById(userId)
    .populate("habits")
    .populate({
      path: "habits",
      populate: { path: "catImage.catType" },
    });

  const activeHabits = targetUser.habits
    .filter((habit) => {
      return (
        new Date(habit.dateList[habit.dateList.length - 1].date) -
          currentDate >=
          TIME_NUMBERS.checkTimeForActiveness ||
        currentDate -
          new Date(habit.dateList[habit.dateList.length - 1].date) <=
          2 * TIME_NUMBERS.checkTimeForActiveness
      );
    })
    .map((activeHabit) => {
      return {
        id: activeHabit._id,
        title: activeHabit.title,
        endDate: activeHabit.dateList[activeHabit.dateList.length - 1].date,
        catImage:
          activeHabit.catImage.catType.catStatusList[
            activeHabit.catImage.catStatus
          ],
        status: activeHabit.catImage.catStatus,
      };
    });

  return activeHabits;
};

exports.postNewHabit = async (title, userId) => {
  const currentDate = new Date();

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
