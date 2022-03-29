const request = require("supertest");
const { expect } = require("chai");
const { before, after } = require("mocha");
const jwt = require("jsonwebtoken");

const app = require("../app");
const User = require("../models/User");
const Habit = require("../models/Habit");
const CatImage = require("../models/CatImage");

describe("Habit CRUD Test", () => {
  describe("Make New Habit Test", () => {
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
    });

    after(async () => {
      await User.findByIdAndDelete(newUserId);
      await Habit.deleteMany({ author: newUserId });
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

  describe("Get habit test", () => {
    let newUser;
    let newUserId;
    let newUserToken;
    let newHabit;
    let newHabitId;
    let allCatImage;
    let catImageId;

    before(async () => {
      allCatImage = await CatImage.find().lean().exec();
      catImageId = allCatImage[0]._id;

      newUser = await User.create({
        email: "mock@gmail.com",
        name: "mock user",
        habit: [],
      });
      newUserId = newUser._id;

      newUserToken = jwt.sign({ newUserId }, process.env.SECRET_KEY);
      newHabit = await Habit.create({
        author: newUserId,
        title: "test",
        dateList: [
          {
            date: "2022-03-26T00:00:00.638Z",
            isChecked: false,
          },
          {
            date: "2022-03-27T00:00:00.638Z",
            isChecked: false,
          },
          {
            date: "2022-03-28T00:00:00.638Z",
            isChecked: false,
          },
          {
            date: "2022-03-29T00:00:00.638Z",
            isChecked: false,
          },
          {
            date: "2022-03-30T00:00:00.638Z",
            isChecked: false,
          },
          {
            date: "2022-03-31T00:00:00.638Z",
            isChecked: false,
          },
          {
            date: "2022-04-01T00:00:00.638Z",
            isChecked: false,
          },
        ],
        catImage: {
          catType: catImageId,
          catStatus: 0,
        },
      });
      newHabitId = newHabit._id;
    });

    after(async () => {
      await User.findByIdAndDelete(newUserId);
      await Habit.deleteMany({ author: newUserId });
    });

    it("Get habit", (done) => {
      request(app)
        .get(`/users/${newUserId}`)
        .set("authorization", `Bearer ${newUserToken}`)
        .type("application/json")
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            done(err);
            return;
          }

          const targetHabitList = res.body.habitList;

          expect(targetHabitList).to.exist();
          expect(targetHabitList.length).to.be(1);
          expect(targetHabitList[0].title).to.be("test");
          expect(targetHabitList[0].status).to.be(0);
        });

      done();
    });
  });

  describe("Update habit test", () => {
    const currentTime = new Date();
    const updateInfo = {
      currentLocalDate: currentTime.toISOString(),
      localTimeOffset: 9,
    };

    let newUser;
    let newUserId;
    let newUserToken;
    let newHabit;
    let newHabitId;
    let allCatImage;
    let catImageId;

    before(async () => {
      allCatImage = await CatImage.find().lean().exec();
      catImageId = allCatImage[0]._id;

      newUser = await User.create({
        email: "mock@gmail.com",
        name: "mock user",
        habit: [],
      });
      newUserId = newUser._id;

      newUserToken = jwt.sign({ newUserId }, process.env.SECRET_KEY);
      newHabit = await Habit.create({
        author: newUserId,
        title: "test",
        dateList: [
          {
            date: "2022-03-26T00:00:00.638Z",
            isChecked: false,
          },
          {
            date: "2022-03-27T00:00:00.638Z",
            isChecked: false,
          },
          {
            date: "2022-03-28T00:00:00.638Z",
            isChecked: false,
          },
          {
            date: "2022-03-29T00:00:00.638Z",
            isChecked: false,
          },
          {
            date: "2022-03-30T00:00:00.638Z",
            isChecked: false,
          },
          {
            date: "2022-03-31T00:00:00.638Z",
            isChecked: false,
          },
          {
            date: "2022-04-01T00:00:00.638Z",
            isChecked: false,
          },
        ],
        catImage: {
          catType: catImageId,
          catStatus: 0,
        },
      });
      newHabitId = newHabit._id;
    });

    after(async () => {
      await User.findByIdAndDelete(newUserId);
      await Habit.deleteMany({ author: newUserId });
    });

    it("Update habit", (done) => {
      request(app)
        .put(`/users/${newUserId}/habits/${newHabitId}`)
        .set("authorization", `Bearer ${newUserToken}`)
        .type("application/json")
        .send(updateInfo)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res.body.result).to.be("success");
        });

      done();
    });
  });

  describe("Delete habit test", () => {
    let newUser;
    let newUserId;
    let newUserToken;
    let newHabit;
    let newHabitId;
    let allCatImage;
    let catImageId;

    before(async () => {
      allCatImage = await CatImage.find().lean().exec();
      catImageId = allCatImage[0]._id;

      newUser = await User.create({
        email: "mock@gmail.com",
        name: "mock user",
        habit: [],
      });
      newUserId = newUser._id;

      newUserToken = jwt.sign({ newUserId }, process.env.SECRET_KEY);
      newHabit = await Habit.create({
        author: newUserId,
        title: "test",
        dateList: [
          {
            date: "2022-03-26T00:00:00.638Z",
            isChecked: false,
          },
          {
            date: "2022-03-27T00:00:00.638Z",
            isChecked: false,
          },
          {
            date: "2022-03-28T00:00:00.638Z",
            isChecked: false,
          },
          {
            date: "2022-03-29T00:00:00.638Z",
            isChecked: false,
          },
          {
            date: "2022-03-30T00:00:00.638Z",
            isChecked: false,
          },
          {
            date: "2022-03-31T00:00:00.638Z",
            isChecked: false,
          },
          {
            date: "2022-04-01T00:00:00.638Z",
            isChecked: false,
          },
        ],
        catImage: {
          catType: catImageId,
          catStatus: 0,
        },
      });
      newHabitId = newHabit._id;
    });

    after(async () => {
      await User.findByIdAndDelete(newUserId);
    });

    it("Delete habit", (done) => {
      request(app)
        .delete(`/users/${newUserId}/habits/${newHabitId}`)
        .set("authorization", `Bearer ${newUserToken}`)
        .type("application/json")
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            done(err);
            return;
          }

          const habitList = await Habit.findById(newHabitId).lean().exec();

          expect(res.body.result).to.be("success");
          expect(habitList.length).to.be(0);
        });
      done();
    });
  });
});
