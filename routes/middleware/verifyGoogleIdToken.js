const { OAuth2Client } = require("google-auth-library");
const createError = require("http-errors");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleIdToken = async (req, res, next) => {
  const { idToken } = req.body;
  
  if (!idToken) {
    const error = createError(400, { message: "Bad request" });
    next(error);

    return;
  }

  try {
    const ticket = await client.verifyIdToken({ idToken });
    const { email, name } = ticket.getPayload();
    
    req.userInfo = { email, name };

    next();
  } catch(err) {
    const error = createError(400, err, { message: "Invalid Token" });
    next(error);
  }
};

module.exports = verifyGoogleIdToken;
