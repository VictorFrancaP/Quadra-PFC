// src/shared/providers/payment/provider/PaymentProvider.ts

// Importando interfaces de contrato
import {
  IPaymentProvider,
  IPayoutRequest,
  IPayoutResult,
} from "../IPaymentProvider";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// Importando mercadopago com commonjs como o SDK espera
const MP_SDK = require("mercadopago");

// Fallback para obter a própria classe construtora do SDK
const MercadoPagoClient = MP_SDK.default || MP_SDK;

// Instânciando SDK Client
const mercadopago = new MercadoPagoClient({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN as string,
});

const WEBHOOK_HOST = process.env.WEBHOOK_HOST || "";

// exportando classe de implementação
export class PaymentProvider implements IPaymentProvider {
  async createPaymentPreference(
    value: number,
    description: string,
    reservationId: string,
    soccerOwnerKey?: string
  ): Promise<{ preferenceId: string; initPoint: string }> {
    const notificationUrl = `${WEBHOOK_HOST}/webhook/mercadopago`;

    const preferencesBody = {
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

    const response = await mercadopago.preferences.create(preferencesBody);

    return {
      preferenceId: response.body.id,
      initPoint: response.body.init_point,
    };
  }

  async createRefund(paymentTransactionId: string): Promise<void> {
    try {
      await mercadopago.refund.create({
        payment_id: paymentTransactionId,
      });
    } catch (err: any) {
      throw new Error(
        "Falha na comunicação com a API do Mercado Pago para reembolso."
      );
    }
  }

  async fetchTransactionDetails(paymentId: string): Promise<any> {
    try {
      const response = await mercadopago.payment.get(paymentId);
      return response.body;
    } catch (err: any) {
      console.error(`Falha ao buscar pagamento ${paymentId}:`, err.message);
      throw new Error(`Falha ao consultar transação: ${err.message}`);
    }
  }

  async makePayout(data: IPayoutRequest): Promise<IPayoutResult> {
    const transferPayload = {
      transaction_amount: data.amount,
      description: data.description,
      currency_id: "BRL",
      recipient: {
        id: data.destination,
      },
    };

    try {
      console.log(
        `Simulado repasse de R$ ${data.amount.toFixed(2)} agendado para ${
          data.destination
        }`
      );
      return {
        transactionId: `TX-TCC-PAYOUT-${Date.now()}`,
        status: "success",
      };
    } catch (err: any) {
      console.error(
        `Erro na API do Mercado Pago para ${data.destination}`,
        err.message
      );
      throw new Error(`Falha no repasse: ${err.message}`);
    }
  }
}
