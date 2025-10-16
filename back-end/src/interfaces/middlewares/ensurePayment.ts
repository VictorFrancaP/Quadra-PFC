// Importando Request, Response e NextFunction
import { Request, Response, NextFunction } from "express";

// exportando middleware para o mercadopago webhook callback
export const ensurePayment = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // criando try/catch para capturar erros na execução
  try {
    if (request.body) {
      (request as any).mercadopagoBody = JSON.parse(request.body.toString());
    }
  } catch (err) {
    (request as any).mercadopagoBody = {};
  }
  next();
};
