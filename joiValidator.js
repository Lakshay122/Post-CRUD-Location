const Joi = require("joi");

const validator = (schema) => (payload) => {
  return schema.validate(payload, { abortEarly: false });
};

const signupValidatorSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirm_password: Joi.ref("password"),
});

const createPostValidatorSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
  active:Joi.boolean(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
});
const updatePostValidatorSchema = Joi.object({
  title: Joi.string(),
  body: Joi.string(),
  active:Joi.boolean(),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180),
});



exports.validateSignup = validator(signupValidatorSchema);
exports.validateCreatePost = validator(createPostValidatorSchema);
exports.validateUpdatePost = validator(updatePostValidatorSchema);
