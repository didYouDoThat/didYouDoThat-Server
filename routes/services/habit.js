const User = require("../../models/User");
const Habit = require("../../models/Habit");
const CatImage = require("../../models/CatImage");

const { TIME_NUMBERS } = require("../../constants/numbers");

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
