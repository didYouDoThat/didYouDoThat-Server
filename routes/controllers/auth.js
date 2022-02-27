const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const authService = require("../services/auth");

exports.getLogin = async (req, res, next) => {
  try {
    const { id, name } = await authService.createUser(req.userInfo);

    const accessToken = jwt.sign({ id }, process.env.SECRET_KEY, {
      expiresIn: 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        id,
        name,
      },
      token: accessToken,
    });
  } catch (err) {
    const error = createError(500, err, { message: "Invalid Server Error" });
    next(error);
  }
};
