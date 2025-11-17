// Importando Joi para validação de dados
import Joi from "joi";

// Importando tipos de permissões
import { supportStatus } from "../../../../domain/entities/Support";

// exportando schema com Joi.object
export const UpdateSupportValidator = Joi.object({
  newStatus: Joi.string()
    .valid(...Object.values(supportStatus))
    .required(),
});
