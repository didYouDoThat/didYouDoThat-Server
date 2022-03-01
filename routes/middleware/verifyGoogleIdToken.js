const { OAuth2Client } = require("google-auth-library");
const createError = require("http-errors");

const {
  TOKEN_MESSAGE,
  COMMON_MESSAGE,
} = require("../../constants/dataValidationMessage");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleIdToken = async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    const error = createError(400, { message: TOKEN_MESSAGE.emptyTokenError });
    next(error);

    return;
  }

  try {
    const ticket = await client.verifyIdToken({ idToken });
    const { email, name } = ticket.getPayload();

    req.userInfo = { email, name };

    next();
  } catch (err) {
    const error = createError(400, err, {
      message: COMMON_MESSAGE.invalidServerError,
    });
    next(error);
  }
};

module.exports = verifyGoogleIdToken;
