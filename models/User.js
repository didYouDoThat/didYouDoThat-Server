const mongoose = require("mongoose");
const { Schema } = mongoose;

const { SCHEMA_MESSAGE } = require("../constants/dataValidationMessage");

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, SCHEMA_MESSAGE.userEmailUniqueError],
    required: [true, SCHEMA_MESSAGE.userEmailRequiredError],
  },
  name: {
    type: String,
    required: [true, SCHEMA_MESSAGE.userNameError],
  },
  habits: [
    {
      type: Schema.Types.ObjectId,
      ref: "Habit",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
