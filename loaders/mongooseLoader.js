const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectMongodb = async () => {
  try {
    const mongoServer = await MongoMemoryServer.create();

    // const mongoURI =
    //   process.env.NODE_ENV === "development"
    //     ? mongoServer.getUri()
    //     : process.env.MONGO_DB_URI;
    await mongoose.connect(process.env.MONGO_DB_URI);
  } catch (err) {
    console.error("initial connection error: ", err);
  }

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", console.log.bind(console, "Connected to database.."));
};

module.exports = connectMongodb;
