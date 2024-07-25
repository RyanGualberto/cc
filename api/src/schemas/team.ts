import Joi from "joi";

export const CreateTeamSchema = Joi.object({
  name: Joi.string().required(),
});
