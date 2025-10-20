// Importando Request, Response do express
import { Request, Response } from "express";

// Importando interfaces implementadas a serem instânciadas nesta classe
import { FindReservationByIdRepository } from "../../../infrastruture/repository/reservation/FindReservationByIdRepository";
import { UpdateReservationRepository } from "../../../infrastruture/repository/reservation/UpdateReservationRepository";
import { PaymentProvider } from "../../../shared/providers/payment/provider/PaymentProvider";

// Importando usecase
import { HandlePaymentNotificationUseCase } from "../../../application/usecases/payment/HandlePaymentNotificationUseCase";

// exportando controller
export class WebHookController {
  async handle(request: Request, response: Response) {
    // dados vindos do mercadopago
    const topic = request.query.topic as string;
    const mpNotificationId = request.query.id as string;

    // validação
    if (topic !== "payment" || !mpNotificationId) {
      return response.status(200).json({
        message: "Notificação ignorada. Tópico invalido!",
      });
    }

    // instânciando interfaces implementadas
    const findReservationByIdRepository = new FindReservationByIdRepository();
    const updateReservationRepository = new UpdateReservationRepository();
    const paymentProvider = new PaymentProvider();

    // instânciando usecase
    const useCase = new HandlePaymentNotificationUseCase(
      findReservationByIdRepository,
      updateReservationRepository,
      paymentProvider
    );

    // criando try/catch para capturar erros na execução
    try {
      await useCase.execute({ mpNotificationId, topic });

      return response.status(200).json("Notificação processada com sucesso!.");
    } catch (err: any) {
      console.error(err.message);
      return response.status(500).json(err.message);
    }
  }
}
