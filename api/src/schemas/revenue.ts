import Joi from "joi";

export const CreateRevenueSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  date: Joi.date().required(),
  // monthly, weekly, daily or once
  recurrence: Joi.string()
    .valid("monthly", "weekly", "daily", "once")
    .required(),
  until: Joi.date(),
  amountInCents: Joi.number().required(),
  userId: Joi.string().required(),
  teamId: Joi.string().required(),
  status: Joi.string().valid("pending", "paid", "overdue"),
  categoryId: Joi.string().required(),
});

export const UpdateRevenueSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().optional(),
  date: Joi.date(),
  // monthly, weekly, daily or once
  recurrence: Joi.string().valid("monthly", "weekly", "daily", "once"),
  status: Joi.string().valid("pending", "paid", "overdue").required(),
  until: Joi.date(),
  amountInCents: Joi.number(),
  includeFuture: Joi.boolean(),
  categoryId: Joi.string(),
});
