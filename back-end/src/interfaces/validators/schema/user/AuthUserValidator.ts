// Importando Joi para validação de dados
import Joi from "joi";

// exportando schema do Joi object
export const AuthUserValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
