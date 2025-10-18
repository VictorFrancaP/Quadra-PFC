// Importando Joi para a validação de dados
import Joi from "joi";

// exportando schema do joi.object
export const CreateReservationValidator = Joi.object({
  startTime: Joi.date().iso().min("now").required().messages({
    "date.min": "Não é possível reservar um horário que já passou!",
    "date.iso": "O formato da data deve ser completo (YYYY-MM-DDTHH:MM:SSZ).",
  }),
  duration: Joi.number().integer().positive().max(5).required(),
});
