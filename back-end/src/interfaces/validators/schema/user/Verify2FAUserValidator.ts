// Importando Joi para validação de dados
import Joi from "joi";

// exportando Joi.object para validação
export const Verify2FAUserValidator = Joi.object({
  token: Joi.string().min(6).max(6).required(),
});
