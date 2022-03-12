const request = require("supertest");
const { expect } = require("chai");
const { before, after } = require("mocha");
const jwt = require("jsonwebtoken");

const app = require("../app");
const User = require("../models/User");
const Habit = require("../models/Habit");
const CatImage = require("../models/CatImage");

describe("POST /users/:userId/habit", function () {
  this.timeout(10000);

  const mongoose = require("mongoose");
  const db = mongoose.connection;
  const sampleCatImage = require("../models/sampleJSON/catImages.json");

  const storeMockCatImages = () => {
    sampleCatImage.forEach(async (catImage) => {
      await new CatImage(catImage).save();
    });
  };

  before((done) => {
    (function checkDatabaseConnection() {
      if (db.readyState === 1) {
        return done();
      }

      setTimeout(checkDatabaseConnection, 1000);
    })();
  });

  describe("Setting for test", () => {
    let newUser;
    let newUserId;
    let newUserToken;

    before(async () => {
      newUser = await User.create({
        email: "mock@gmail.com",
        name: "mock user",
        habit: [],
      });
      newUserId = newUser._id;

      newUserToken = jwt.sign({ newUserId }, process.env.SECRET_KEY);
      storeMockCatImages();
    });

    after(async () => {
      await User.findOneAndDelete({ email: "mock@gmail.com" });
      await Habit.findOneAndDelete({ author: newUser._id });
      await CatImage.deleteMany();
    });

    const mockHabit = {
      title: "test",
      localTimeOffset: 9,
    };

    it("Make new habit", (done) => {
      request(app)
        .post(`/users/${newUserId}/habit`)
        .set("authorization", `Bearer ${newUserToken}`)
        .type("application/json")
        .send(mockHabit)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }

          const newHabit = res.body.newHabit;

          expect(newHabit).to.exist();

          expect(newHabit.title).to.be("test");
          expect(newHabit.catImage).to.exist();
        });

      done();
    });
  });
});
