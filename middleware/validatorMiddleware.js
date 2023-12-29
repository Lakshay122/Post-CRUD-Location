const { validateSignup, validateCreatePost, validateUpdatePost } = require("../joiValidator");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("./catchAsyncError");
function buildErrorMessage(details) {
  const message = details.map((i) => i.message).join(",");
  return message;
}
exports.signupVaildatorMiddleware = catchAsyncError(async (req, res, next) => {
  const { error } = validateSignup(req.body);
  const valid = error == null;

  if (valid) {
    next();
  } else {
    const { details } = error;
    const message = buildErrorMessage(details);
    return next(new ErrorHandler(message, 422));
  }
});

exports.createPostValidatorMiddleware = catchAsyncError(
  async (req, res, next) => {
    const { error } = validateCreatePost(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = buildErrorMessage(details);
      return next(new ErrorHandler(message, 422));
    }
  }
);
exports.updatePostValidatorMiddleware = catchAsyncError(
  async (req, res, next) => {
    const { error } = validateUpdatePost(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = buildErrorMessage(details);
      return next(new ErrorHandler(message, 422));
    }
  }
);
