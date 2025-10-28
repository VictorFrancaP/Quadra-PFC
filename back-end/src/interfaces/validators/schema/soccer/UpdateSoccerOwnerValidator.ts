// Importando Joi para validação de dados
import Joi from "joi";

// exportando schema do Joi.object
export const UpdateSoccerOwnerValidator = Joi.object({
  name: Joi.string().max(50).optional(),
  description: Joi.string().max(255).optional().allow(""),
  cep: Joi.string()
    .length(8)
    .pattern(/^[0-9]+$/)
    .optional(),
  address: Joi.string().max(255).optional(),
  city: Joi.string().max(50).optional(),
  state: Joi.string().min(2).max(4).optional(),
  fone: Joi.string().optional(),
  operationDays: Joi.array()
    .items(
      Joi.string().valid(
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sabado",
        "Domingo"
      )
    )
    .optional(),
  openHour: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
  closingHour: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
  priceHour: Joi.number().min(20).positive().optional(),
  maxDuration: Joi.number().integer().positive().optional(),
  isActive: Joi.boolean().optional(),
  observations: Joi.string().max(155).optional().allow(""),
});
