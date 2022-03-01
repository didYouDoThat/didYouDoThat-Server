const mongoose = require("mongoose");
const { Schema } = mongoose;

const { SCHEMA_MESSAGE } = require("../constants/dataValidationMessage");

const HabitSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    required: [true, SCHEMA_MESSAGE.habitAuthorError],
    ref: "User",
  },
  title: {
    type: String,
    required: [true, SCHEMA_MESSAGE.habitTitleError],
  },
  dateList: [
    {
      date: {
        type: String,
        required: [true, SCHEMA_MESSAGE.habitDateListDateError],
      },
      isChecked: {
        type: Boolean,
        required: [true, SCHEMA_MESSAGE.habitCheckedError],
        default: false,
      },
    },
  ],
  endDate: {
    type: String,
    required: [true, SCHEMA_MESSAGE.habitEndDateError],
  },
  catImage: {
    catType: {
      type: Schema.Types.ObjectId,
      required: [true, SCHEMA_MESSAGE.habitCatTypeError],
      ref: "CatImage",
    },
    catStatus: {
      type: Number,
      required: [true, SCHEMA_MESSAGE.habitCatStatusError],
    },
  },
  isActive: {
    type: Boolean,
    required: [true, SCHEMA_MESSAGE.habitActivationError],
  },
});

module.exports = mongoose.model("Habit", HabitSchema);
