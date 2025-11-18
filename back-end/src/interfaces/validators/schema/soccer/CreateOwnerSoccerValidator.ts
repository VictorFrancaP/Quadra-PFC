// Importando Joi para validação de dados
import Joi from "joi";

// exportando schema do Joi.object
export const CreateOwnerSoccerValidator = Joi.object({
  name: Joi.string().max(50).required(),
  description: Joi.string().max(255).required(),
  cep: Joi.string()
    .length(8)
    .pattern(/^[0-9]+$/)
    .required(),
  address: Joi.string().max(255).required(),
  city: Joi.string().max(50).required(),
  state: Joi.string().min(2).max(4).required(),
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
  openHour: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  closingHour: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required(),
  priceHour: Joi.number().min(20).positive().required(),
  maxDuration: Joi.number().integer().positive().required(),
  ownerPixKey: Joi.string().required(),
  observations: Joi.string().max(155),
});
