// Importando Joi para validação de dados
import Joi from "joi";

// exportando schema de validação com Joi.object - body
export const ResetPasswordUserValidator = Joi.object({
  password: Joi.string().min(7).required(),
});

// exportando schema de validação com Joi.object - params
export const ResetPasswordUserValidatorParams = Joi.object({
  token: Joi.string().required(),
});
