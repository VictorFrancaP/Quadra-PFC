// Importando Joi para validação de dados
import Joi from "joi";

// exportando schema Joi.object
export const CreateRatingValidator = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comments: Joi.string().max(155),
});
