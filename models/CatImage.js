const mongoose = require("mongoose");
const { Schema } = mongoose;

const { SCHEMA_MESSAGE } = require("../constants/dataValidationMessage");

const CatImageSchema = new Schema({
  catStatusList: [
    {
      type: String,
      required: [true, SCHEMA_MESSAGE.catImageUrlError],
    },
  ],
});

module.exports = mongoose.model("CatImage", CatImageSchema);
