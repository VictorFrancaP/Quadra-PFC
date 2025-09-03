// Importando Joi para validação de dados
import Joi from "joi";

// Importando tipos de permissões
import { userPermissions } from "../../../../domain/entities/User";

// exportando schema com Joi.object
export const UpdateUserRoleValidator = Joi.object({
  newRole: Joi.string()
    .valid(...Object.values(userPermissions))
    .required(),
});
