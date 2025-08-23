// Importando Joi para validação dos dados
import Joi from "joi";

// Importando validação com CPF
import { cpf } from "cpf-cnpj-validator";

// exportando schema do Joi.object para validação
export const UpdateUserProfileValidator = Joi.object({
  name: Joi.string().min(3),
  age: Joi.number().min(14),
  address: Joi.string().max(255),
  cep: Joi.string()
    .length(8)
    .pattern(/^[0-9]+$/),
  cpf: Joi.string()
    .custom((value, helpers) => {
      if (!cpf.isValid(value)) {
        return helpers.error("any.invalid");
      }

      return value;
    })
    .messages({
      "any.invalid": "CPF inválido!",
    }),
});
