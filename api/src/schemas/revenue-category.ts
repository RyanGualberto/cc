import Joi from "joi";

export const CreateRevenueCategorySchema = Joi.object({
  name: Joi.string().required(),
  teamId: Joi.string().required(),
});

export const UpdateRevenueCategorySchema = Joi.object({
  name: Joi.string(),
  teamId: Joi.string(),
});
