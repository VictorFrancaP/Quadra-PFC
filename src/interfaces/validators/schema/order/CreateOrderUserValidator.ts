// Importando Joi para validação de dados
import Joi from "joi";

// Importando cnpj para validação do CNPJ passado
import { cnpj } from "cpf-cnpj-validator";

// exportando schema do Joi.object
export const CreateOrderUserValidator = Joi.object({
  localName: Joi.string().min(10).max(155).required(),
  description: Joi.string().min(50).max(255).required(),
  cnpj: Joi.string()
    .custom((value, helpers) => {
      if (!cnpj.isValid(value)) {
        return helpers.error("any-invalid");
      }

      return value;
    })
    .messages({
      "any-invalid": "CNPJ inválido!",
    })
    .required(),
  fone: Joi.string().required(),
});
