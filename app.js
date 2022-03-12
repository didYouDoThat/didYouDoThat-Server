require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const mongooseLoader = require("./loaders/mongooseLoader");
const auth = require("./routes/auth");
const habit = require("./routes/habit");

mongooseLoader();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", auth);
app.use("/users", habit);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  console.error(err);
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
