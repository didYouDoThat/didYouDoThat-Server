const User = require("../../models/User");
const Habit = require("../../models/Habit");
const CatImage = require("../../models/CatImage");

exports.getHabitList = async (userId) => {
  const targetUser = await User.findById(userId)
    .populate("habits")
    .populate({
      path: "habits",
      populate: { path: "catImage.catType"}
    });

  // 여기서 클라이언트에서 렌더링하기 쉽게 내려받을 수 있도록 데이터 가공처리를 해주어야 한다.
  console.log("habit 컨트롤러", targetUser.habits);
  return targetUser;
};
