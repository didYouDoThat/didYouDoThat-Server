const User = require("../../models/User");
const Habit = require("../../models/Habit");
const CatImage = require("../../models/CatImage");

exports.getHabitList = async (userId) => {
  const targetUser = await User.findById(userId)
    .populate("habits")
    .populate({
      path: "habits",
      populate: { path: "catImage.catType" },
    });

  const activeHabits = targetUser.habits
    .filter((habit) => habit.isActive)
    .map((activeHabit) => {
      return {
        id: activeHabit._id,
        title: activeHabit.title,
        endDate: activeHabit.endDate,
        catImage:
          activeHabit.catImage.catType.catStatusList[
            activeHabit.catImage.catStatus
          ],
      };
    });

  return activeHabits;
};
