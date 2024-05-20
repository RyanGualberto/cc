import Joi from "joi";

export const createUser = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .required()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})")
    )
    .message(
      "Password must have at least 6 characters, one uppercase letter, one lowercase letter, one number and one special character"
    ),
  cpf: Joi.string().required().length(11),
  phone: Joi.string().required(),
});

export type createUser = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
};
