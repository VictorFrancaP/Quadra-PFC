// Importando Joi para validação de dados
import Joi from "joi";

// exportando schema com Joi.object
export const UpdateOrderUserValidator = Joi.object({
  localName: Joi.string().max(155),
  description: Joi.string().max(255),
  fone: Joi.string(),
});
