// Importando Joi para validação de dados e mongodb para validação do objectId
import Joi from "joi";
import { ObjectId } from "mongodb";

// export schema de validação
export const RequestParamsRatingValidator = Joi.object({
  soccerId: Joi.string()
    .custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "any.invalid": "Identificador de quadra inválido!",
    }),

  ratedUserId: Joi.string()
    .custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "any.invalid": "Identificador de usuário inválido!",
    }),
}).xor("soccerId", "ratedUserId"); // só aceita UM dos dois
