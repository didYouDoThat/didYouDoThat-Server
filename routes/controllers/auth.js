const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const { TIME_NUMBERS } = require("../../constants/numbers");
const { COMMON_MESSAGE } = require("../../constants/dataValidationMessage");
const authService = require("../services/auth");

exports.getLogin = async (req, res, next) => {
  try {
    const { id, name } = await authService.createUser(req.userInfo);

    const accessToken = jwt.sign({ id }, process.env.SECRET_KEY, {
      expiresIn: TIME_NUMBERS.accessTokenExpiredTime,
    });

    res.json({
      user: {
        id,
        name,
      },
      token: accessToken,
    });
  } catch (err) {
    const error = createError(500, err, {
      message: COMMON_MESSAGE.invalidServerError,
    });
    next(error);
  }
};
