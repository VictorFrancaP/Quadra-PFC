// Importando Joi para validação dos dados
import Joi from "joi";

export const CreateSupportValidator = Joi.object({
  subject: Joi.string().min(10).max(155).required(),
  message: Joi.string().min(10).max(300).required(),
});
