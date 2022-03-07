const { validationResult } = require("express-validator");
const createError = require("http-errors");

const validator = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const error = createError(400, { message: errors.array()[0].msg });
    next(error);
  };
};

module.exports = validator;
