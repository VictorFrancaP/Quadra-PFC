// Importando Joi para validação de dados
import Joi from "joi";

// exportando schema do Joi.object
export const UpdateSoccerOwnerValidator = Joi.object({
  name: Joi.string().max(50),
  description: Joi.string().max(255),
  cep: Joi.string()
    .length(8)
    .pattern(/^[0-9]+$/),
  address: Joi.string().max(255),
  city: Joi.string().max(50),
  state: Joi.string().min(2).max(4),
  fone: Joi.string(),
  operationDays: Joi.array().items(
    Joi.string().valid(
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sabado",
      "Domingo"
    )
  ),
  openHour: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
  closingHour: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
  priceHour: Joi.number().min(20).positive(),
  maxDuration: Joi.number().integer().positive(),
  observations: Joi.string().min(50).max(155),
});
