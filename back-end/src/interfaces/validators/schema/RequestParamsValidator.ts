// Importando Joi para validação de dados e mongodb para validação do objectId
import Joi from "joi";
import { ObjectId } from "mongodb";

// export schema de validação com Joi.object
export const RequestParamsValidator = Joi.object({
  id: Joi.string()
    .custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        helpers.error("any-invalid");
      }
      return value;
    })
    .messages({
      "any-invalid": "Identificador inválido!",
    })
    .required(),
});
