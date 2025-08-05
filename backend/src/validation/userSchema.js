import Joi from "joi";

const nameRule = Joi.string().min(3).max(30).required();

const emailRule = Joi.string()
  .email()
  .messages({"string.email": "Invalid email format"});

const passwordRule = Joi.string()
  .min(6)
  .messages({"string.min": "Password must be at least 6 characters long"});

const phoneRule = Joi.string()
  .pattern(/^\d{10}$/)
  .messages({"string.pattern.base": "Phone number must be 10 digits"});

const rolesRule = Joi.array()
  .items(Joi.string())
  .messages({"array.includes": "Invalid role ID format"});

const userSchema = Joi.object({
  name: nameRule,
  email: emailRule,
  password: passwordRule,
  phone: phoneRule,
  roles: rolesRule,
});

const updateUserSchema = Joi.object({
  name: nameRule,
  password: passwordRule,
  phone: phoneRule,
  roles: rolesRule,
});

export {userSchema, updateUserSchema};
