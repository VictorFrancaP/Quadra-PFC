// Importando Joi para validação de dados
import Joi from "joi";

// exportando variável schema
export const CreateUserRequestValidator = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
});
