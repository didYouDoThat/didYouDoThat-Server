const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const { TOKEN_MESSAGE } = require("../../constants/dataValidationMessage");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];

  try {
    jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (err) {
    const error = createError(400, err, { message: TOKEN_MESSAGE.tokenError });
    next(error);
  }
};

module.exports = verifyToken;
