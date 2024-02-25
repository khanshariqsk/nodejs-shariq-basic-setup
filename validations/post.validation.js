const Joi = require("joi");

exports.createPostValidation = (data) => {
  const schema = Joi.object({
    content: Joi.string().required(),
    title: Joi.string().required(),
    image: Joi.string(),
    category: Joi.string(),
  });

  return schema.validateAsync(data);
};

exports.updatePostValidation = (data) => {
  const schema = Joi.object({
    content: Joi.string().required(),
    title: Joi.string().required(),
    image: Joi.string(),
    category: Joi.string(),
  });

  return schema.validateAsync(data);
};
