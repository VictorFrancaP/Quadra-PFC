// Importando Joi para a validação de dados
import Joi from "joi";

// exportando schema do joi.object
export const CreateReservationValidator = Joi.object({
  startTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  duration: Joi.number().positive().max(7).required(),
});
