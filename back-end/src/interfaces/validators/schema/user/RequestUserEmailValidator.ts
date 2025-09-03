// Importando Joi para a validação de dados
import Joi from "joi";

// exportando schema do Joi.object
export const RequestUserEmailValidator = Joi.object({
  email: Joi.string().email().required(),
});
