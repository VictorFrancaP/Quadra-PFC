// Importando interface a ser implementada nesta classe
import { IPaymentProvider } from "../IPaymentProvider";

// Importando lib do mercadopago
import * as mercadopago from "mercadopago";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// pegando access_token do mercadopago
mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN as string,
});

// exportando classe de implementação
export class PaymentProvider implements IPaymentProvider {
  async createPaymentPreference(
    value: number,
    description: string,
    reservationId: string,
    soccerOwnerKey?: string
  ): Promise<{ preferenceId: string; initPoint: string }> {
    // arrumar url de notificação com outro servidor
    const notificationUrl = "/mercadopago/webhook";

    // preferencias
    const preferences = {
      items: [
        {
          title: description,
          unit_price: value,
          quantity: 1,
        },
      ],

      external_reference: reservationId,
      notification_url: notificationUrl,
      back_urls: {
        success: process.env.FRONT_HOST + "/payment/success",
        failure: process.env.FRONT_HOST + "/payment/failure",
        pending: process.env.FRONT_HOST + "/payment/pending",
      },
      auto_return: "approved",
    };

    // armazenando resposta da api
    const response = await mercadopago.preferences.create(preferences);

    // retornando id da transferência e link para pagamento
    return {
      preferenceId: response.body.id,
      initPoint: response.body.init_point,
    };
  }

  async createRefund(paymentTransactionId: string): Promise<void> {
    // reembolso para o usuário no prazo antes de 24hrs
    await mercadopago.refund.create({
      payment_id: paymentTransactionId,
    });
  }
}
