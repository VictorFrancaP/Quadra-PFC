// Importando ErrorSuper
import { ErrorSuper } from "../../shared/errors/ErrorSuper";

// Importando Request, Response e next do express
import { Request, Response, NextFunction } from "express";

// exportando middleware para ser utilizada na app
export const errorHandler = (
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (err instanceof ErrorSuper) {
    return response.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: "error",
    message: "Erro interno do servidor!",
  });
};
