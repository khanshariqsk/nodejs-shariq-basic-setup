const Joi = require("joi");

exports.profileUpdateValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    profilePicture: Joi.string(),
    password: Joi.string(),
  });

  return schema.validateAsync(data);
};
