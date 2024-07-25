import Joi from "joi";

export const CreateUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone: Joi.string().required(),
  cpf: Joi.string().required(),
});

export const UserLoginSchema = Joi.object({
  email: Joi.string().email(),
  phone: Joi.string(),
  cpf: Joi.string(),
  password: Joi.string().required(),
});
