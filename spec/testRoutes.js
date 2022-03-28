const request = require("supertest");
const { expect } = require("chai");
const { before, after } = require("mocha");
const jwt = require("jsonwebtoken");

const app = require("../app");
const User = require("../models/User");
const Habit = require("../models/Habit");

describe("Route Test", () => {
  describe("Setting up for tests", () => {
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
      await User.findOneAndDelete({ email: "mock@gmail.com" });
      await Habit.findOneAndDelete({ author: newUser._id });
    });

    const mockHabit = {
      title: "test",
      localTimeOffset: 9,
    };

    const mockHabit2 = {
      title: "test2",
      localTimeOffset: 9,
    };

    const updateInfo = {
      currentLocalDate: new Date().toISOString,
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

    it("Get habit", (done) => {
      request(app)
        .get(`/users/${newUserId}`)
        .set("authorization", `Bearer ${newUserToken}`)
        .type("application/json")
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }

          const targetHabitList = res.body.habitList;

          expect(targetHabitList).to.exist();
          expect(targetHabitList.length).to.be(1);
          expect(targetHabitList[0].title).to.be("test");
          expect(targetHabitList[0].status).to.be(0);
        });
      done();
    });

    it("Delete habit", (done) => {
      request(app)
        .post(`/users/${newUserId}/habit`)
        .set("authorization", `Bearer ${newUserToken}`)
        .type("application/json")
        .send(mockHabit2)
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err);

          const habitList = await User.findById(newUserId).lean().exec();
          const targetHabitId = habitList[0]._id;

          expect(habitList.length).to.be(2);

          request(app)
            .delete(`/users/${newUserId}/habits/${targetHabitId}`)
            .type("application/json")
            .expect(200)
            .end(async (err, res) => {
              if (err) return done(err);

              const updatedHabitList = await User.findById(newUserId)
                .lean()
                .exec();

              expect(res.body.result).to.be("success");
              expect(updatedHabitList.length).to.be(1);
              expect(updatedHabitList[0].title).to.be(mockHabit2.title);
            });
        });
      done();
    });
  });
});
