// Importando Joi para validação de dados
import Joi from "joi";

// Importando cnpj validator
import { cnpj } from "cpf-cnpj-validator";

// exportando schema do Joi.object para validação de dados
export const CreateSolicitationOwnerValidator = Joi.object({
  localName: Joi.string().min(100).max(155).required(),
  description: Joi.string().min(155).max(350).required(),
  cnpj: Joi.string()
    .custom((value, helpers) => {
      if (!cnpj.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "any.invalid": "CNPJ inválido!",
    })
    .required(),
  fone: Joi.string().min(12).max(12).required(),
});
