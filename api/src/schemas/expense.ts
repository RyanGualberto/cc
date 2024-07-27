import Joi from "joi";

export const CreateExpenseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  date: Joi.date().required(),
  // monthly, weekly, daily or once
  recurrence: Joi.string()
    .valid("monthly", "weekly", "daily", "once")
    .required(),
  until: Joi.date(),
  amountInCents: Joi.number().required(),
  userId: Joi.string().required(),
  teamId: Joi.string().required(),
});

export const UpdateExpenseSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  date: Joi.date(),
  // monthly, weekly, daily or once
  recurrence: Joi.string().valid("monthly", "weekly", "daily", "once"),
  until: Joi.date(),
  amountInCents: Joi.number(),
  includeFuture: Joi.boolean(),
});
