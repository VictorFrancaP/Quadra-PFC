// Importando Request, Response e next do express
import { Request, Response, NextFunction } from "express";

// Importando dayjs para validação de horário
import dayjs from "dayjs";

// Importando schema para validação
import { ObjectSchema } from "joi";

// exportando arrow function
export const ensureHour = (schema: ObjectSchema) => {
  return (request: Request, response: Response, next: NextFunction) => {
    // pegando error ou valor
    const { error, value } = schema.validate(request.body, {
      abortEarly: false,
    });

    // se encontrar um erro, entra no if
    if (error) {
      return response.status(400).json({
        errors: error.details.map((err) => err.message),
      });
    }

    // pegando valores de horário de fechamento e abertura
    const openHour = dayjs(value.openHour, "HH:mm");
    const closingHour = dayjs(value.closingHour, "HH:mm");

    // validando formato dos horarios
    if (!openHour.isValid || !closingHour.isValid) {
      return response.status(400).json({
        message: "Formato do horário inválido",
      });
    }

    // validando se hora inicial passa do fechamento
    if (openHour.isAfter(closingHour) || openHour.isSame(closingHour)) {
      return response.status(400).json({
        message:
          "O horário de abertura não pode ser depois do horário de fechamento!",
      });
    }

    // passando o proximo middleware se tiver
    return next();
  };
};
