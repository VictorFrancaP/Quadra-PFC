// Importando Joi para validação de dados
import Joi from "joi";

// exportando schema com Joi.object
export const FindNearbySoccerValidator = Joi.object({
  distanciaMaximaKm: Joi.number().positive(),
});
