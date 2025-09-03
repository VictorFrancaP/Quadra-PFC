// Importando Joi para validação de dados
import Joi from "joi";

// exportando schema com Joi.object
export const UpdateOrderUserValidator = Joi.object({
  localName: Joi.string().min(10).max(155),
  description: Joi.string().min(50).max(255),
  fone: Joi.string(),
});
