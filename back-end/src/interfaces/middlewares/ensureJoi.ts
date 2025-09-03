// Importando Request, Response e next do express
import { Request, Response, NextFunction } from "express";

// Importando ObjectSchema do Joi
import { ObjectSchema } from "joi";

// exportando middleware de validação de dados com Joi
export const ensureJoi = (
  schema: ObjectSchema,
  location: "body" | "params" | "query" = "body"
) => {
  return (request: Request, response: Response, next: NextFunction) => {
    // guardando resultado da validação na variável result
    const result = schema.validate(request[location], { abortEarly: false });

    // verificando se houve algum erro, se tiver lista todos com (abortEarly: false)
    if (result.error) {
      return response.status(400).json({
        message: "Validation error",
        errors: result.error.details.map((err) => err.message),
      });
    }

    // retorna para o proximo middleware ou fluxo
    return next();
  };
};
