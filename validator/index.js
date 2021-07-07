const { check, validationResult } = require("express-validator");

exports.userSignupValidator = async (req, res, next) => {
  await check("name", "Name is required").notEmpty().run(req);
  await check("email", "Email must be between 3 to 32 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
      min: 4,
      max: 32,
    })
    .run(req);
  await check("password", "Password is required").notEmpty().run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .run(req);

  const errorMessage = validationResult.withDefaults({
    formatter: (error) => error.msg,
  });

  const errors = validationResult(req).formatWith(errorMessage);
  if (!errors.isEmpty()) {
    const firstError = errorMessage(req).array();
    return res.status(400).json({ error: firstError[0] });
    // const firstError = errors.mapped();
    // return res.status(400).json({ error: firstError });
  }
  next();
};
