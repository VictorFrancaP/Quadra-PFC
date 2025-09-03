// Importando Joi para validação de dados
import Joi from "joi";

// Importando tipos de status
import { orderStatus } from "../../../../domain/entities/Order";

// exportando schema do Joi.object
export const UpdateUserOrderStatusValidator = Joi.object({
  newStatus: Joi.string()
    .valid(...Object.values(orderStatus))
    .required(),
});
