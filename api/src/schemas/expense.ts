import Joi from "joi";

export const CreateExpenseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  recurrence: Joi.string().required(),
  amountInCents: Joi.number().required(),
  userId: Joi.string().required(),
  teamId: Joi.string().required(),
});
