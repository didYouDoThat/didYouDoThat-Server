const mongoose = require("mongoose");

const connectMongodb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
  } catch (err) {
    console.error("initial connection error: ", err);
  }

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", console.log.bind(console, "Connected to database.."));
};

module.exports = connectMongodb;
