const { OAuth2Client } = require("google-auth-library");
const createError = require("http-errors");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleIdToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    const error = createError(401, { message: "Unauthorized" });
    next(error);
    
    return;
  }

  const idToken = authorization.split(" ")[1];
  
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
