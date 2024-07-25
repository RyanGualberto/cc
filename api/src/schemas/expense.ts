import Joi from "joi";

export const CreateExpenseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  amountInCents: Joi.number().required(),
  date: Joi.date().required(),
  recurrence: Joi.string().required(),
  teamId: Joi.number().required(),
});
