const Joi = require("joi");

module.exports.validateLogin = function (user) {
  const Vl_Schema = {
    ident: Joi.string().required().max(150),
    password: Joi.string().required().alphanum().min(10),
  };
  return Joi.validate(user, Vl_Schema);
};
module.exports.validateRegister = function (user) {
  const Vl_Schema = {
    username: Joi.string().required().min(3).max(30).lowercase(),
    email: Joi.string().email().required().max(150),
    password: Joi.string().alphanum().required().min(10),
  };
  return Joi.validate(user, Vl_Schema);
};
