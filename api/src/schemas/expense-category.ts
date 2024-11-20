import Joi from "joi";

export const CreateExpenseCategorySchema = Joi.object({
  name: Joi.string().required(),
  teamId: Joi.string().required(),
});

export const UpdateExpenseCategorySchema = Joi.object({
  name: Joi.string(),
  teamId: Joi.string(),
});
