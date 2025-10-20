// Importando Joi para a validação de dados
import Joi from "joi";

// Importando cpf e cnpj validator
import { cpf } from "cpf-cnpj-validator";

// exportando e criando arrow function com schema do Joi
export const CreateUserValidator = Joi.object({
  password: Joi.string().min(7).required(),
  age: Joi.number().min(13).max(50).required(),
  address: Joi.string().max(500).required(),
  cep: Joi.string()
    .length(8)
    .pattern(/^[0-9]+$/)
    .required(),
  cpf: Joi.string()
    .custom((value, helpers) => {
      if (!cpf.isValid(value)) {
        return helpers.error("any.invalid");
      }

      return value;
    })
    .messages({ "any.invalid": "CPF inválido!" })
    .required(),
  gender: Joi.string()
    .valid("MALE", "FEMALE", "NOTINFORM")
    .required()
    .messages({ "any.only": "Gênero inválido [MALE, FEMALE and NOTINFORM" }),
});
