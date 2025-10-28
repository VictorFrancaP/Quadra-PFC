// Importando DTO para payload
import {
  IMakePayoutDTO,
  IMakePayoutResult,
  IPaymentProvider,
  ITransactionDetails,
} from "../IPaymentProvider";

// Importando dotenv para a utilização de variaveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// Importando configurações do mercadopago
import { MercadoPagoConfig, Preference } from "mercadopago";
import { PreferenceRequest } from "mercadopago/dist/clients/preference/commonTypes";
import { PreferenceResponse } from "mercadopago/dist/clients/preference/commonTypes";
import { Payment } from "mercadopago";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { randomUUID } from "crypto";
import { PaymentRefund } from "mercadopago";
import { PaymentRefundCreateData } from "mercadopago/dist/clients/paymentRefund/create/types";
import { RefundResponse } from "mercadopago/dist/clients/paymentRefund/commonTypes";

// pegando accesstoken do mercadopago
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

// erro de caso o accesstoken não esteja definido no .env
if (!accessToken) {
  throw new Error("MERCADO_PAGO_ACCESS_TOKEN não definido.");
}

// instânciando mercadopagoConfig
const client = new MercadoPagoConfig({ accessToken: accessToken });

// ip do webhook host
const WEBHOOK_HOST = process.env.WEBHOOK_HOST || "";

// ip do front-host
const FRONT_HOST_LOST = process.env.FRONT_HOST_LOST || "";

// exportando classe de implementação de interface
export class PaymentProvider implements IPaymentProvider {
  private readonly preference: Preference;
  private readonly payment: Payment;
  private readonly refund: PaymentRefund;
  // inicializador
  constructor() {
    this.preference = new Preference(client);
    this.payment = new Payment(client);
    this.refund = new PaymentRefund(client);
  }

  // criar metodo de pagamento
  async createPaymentPreference(
    value: number,
    description: string,
    reservationId: string
  ): Promise<{ preferenceId: string; initPoint: string }> {
    if (!value || value <= 0) throw new Error("Valor inválido para pagamento.");
    if (!description) throw new Error("Descrição inválida para pagamento.");
    if (!reservationId)
      throw new Error("ID da reserva inválido para pagamento.");
    if (!WEBHOOK_HOST || !WEBHOOK_HOST.startsWith("https://")) {
      console.warn("AVISO: WEBHOOK_HOST não é uma URL HTTPS válida.");
    }
    if (!FRONT_HOST_LOST) console.warn("AVISO: FRONT_HOST não definido.");

    const notificationUrl = `${WEBHOOK_HOST}/webhook/mercadopago`;

    const preferencesBody: PreferenceRequest = {
      items: [
        {
          id: reservationId,
          title: description,
          unit_price: Number(value.toFixed(2)),
          quantity: 1,
          currency_id: "BRL",
        },
      ],
      external_reference: reservationId,
      notification_url: notificationUrl,
      back_urls: {
        success: `${FRONT_HOST_LOST}/payment/success?reservationId=${reservationId}`,
        failure: `${FRONT_HOST_LOST}/payment/failure?reservationId=${reservationId}`,
        pending: `${FRONT_HOST_LOST}/payment/pending?reservationId=${reservationId}`,
      },
      auto_return: "approved",
    };

    console.log(
      "[MercadoPago] Criando preferência com payload:",
      JSON.stringify(preferencesBody, null, 2)
    );

    try {
      const response: PreferenceResponse = await this.preference.create({
        body: preferencesBody,
      });

      if (!response.id || !response.init_point) {
        console.error("[MercadoPago] Resposta inesperada:", response);
        throw new Error("Resposta inválida da API do Mercado Pago.");
      }

      console.log(`[MercadoPago] Preferência criada: ID=${response.id}`);
      return {
        preferenceId: response.id,
        initPoint: response.init_point,
      };
    } catch (mpError: any) {
      const errorMessage = mpError?.message || mpError?.toString();
      const errorCause = mpError?.cause || mpError?.apiResponse?.data;
      console.error("[MercadoPago] ERRO ao criar preferência:", errorMessage);
      if (errorCause)
        console.error(
          "[MercadoPago] Detalhes:",
          JSON.stringify(errorCause, null, 2)
        );
      throw new Error("Falha na comunicação com a API do Mercado Pago.");
    }
  }

  async fetchTransactionDetails(
    paymentId: string
  ): Promise<ITransactionDetails> {
    if (!paymentId) {
      throw new Error("ID do pagamento (mpNotificationId) é inválido.");
    }

    console.log(`[MercadoPago] Buscando detalhes do pagamento: ${paymentId}`);

    try {
      const paymentIdAsNumber = Number(paymentId);
      if (isNaN(paymentIdAsNumber)) {
        throw new Error("ID do pagamento não é um número válido.");
      }

      const response: PaymentResponse = await this.payment.get({
        id: paymentIdAsNumber,
      });

      if (!response || !response.status || !response.id) {
        console.error(
          "[MercadoPago] Resposta inválida ao buscar pagamento:",
          response
        );
        throw new Error("Resposta inválida da API do Mercado Pago.");
      }

      console.log(
        `[MercadoPago] Detalhes recebidos: Status=${response.status}, ExternalRef=${response.external_reference}`
      );

      return {
        status: response.status,
        external_reference: response.external_reference || null,
        paymentId: response.id,
      };
    } catch (mpError: any) {
      const errorMessage = mpError?.message || mpError?.toString();
      const errorCause = mpError?.cause || mpError?.apiResponse?.data;
      console.error(
        "[MercadoPago] ERRO ao buscar detalhes do pagamento:",
        errorMessage
      );
      if (errorCause)
        console.error(
          "[MercadoPago] Detalhes:",
          JSON.stringify(errorCause, null, 2)
        );

      if (mpError?.apiResponse?.status === 404) {
        throw new Error("Pagamento não encontrado no Mercado Pago.");
      }

      throw new Error(
        "Falha na comunicação com a API do Mercado Pago."
      );
    }
  }

  async makePayout(data: IMakePayoutDTO): Promise<IMakePayoutResult> {
    const { amount, destination, description } = data;

    console.log("--- [SIMULAÇÃO DE PAYOUT] ---");
    console.log(`[MercadoPago] Iniciando Payout (Transferência PIX)...`);
    console.log(`[MercadoPago] Valor: R$ ${amount.toFixed(2)}`);
    console.log(`[MercadoPago] Destino (PIX): ${destination}`);
    console.log(`[MercadoPago] Descrição: ${description}`);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const fakeTransactionId = `payout_sim_${randomUUID()}`;

    console.log(`[MercadoPago] SIMULAÇÃO: Payout realizado com sucesso.`);
    console.log(`[MercadoPago] Transaction ID: ${fakeTransactionId}`);
    console.log("---------------------------------");

    return {
      transactionId: fakeTransactionId,
    };
  }

  async createRefund(paymentTransactionId: string): Promise<void> {
    if (!paymentTransactionId) {
      throw new Error("ID da transação de pagamento é inválido.");
    }

    const refundBody: PaymentRefundCreateData = {
      payment_id: paymentTransactionId, 
    };

    try {
      const response: RefundResponse = await this.refund.create(refundBody);

      if (
        !response.id ||
        (response.status !== "approved" && response.status !== "pending")
      ) {
        throw new Error(
          "Resposta inválida da API de Reembolso do Mercado Pago."
        );
      }
      return;
    } catch (mpError: any) {
      const errorMessage = mpError?.message || mpError?.toString();
      const errorCause = mpError?.cause || mpError?.apiResponse?.data;
      console.error("[MercadoPago] ERRO ao processar reembolso:", errorMessage);
      if (errorCause)
        console.error(
          "[MercadoPago] Detalhes:",
          JSON.stringify(errorCause, null, 2)
        );

      if (
        errorCause?.message?.includes("amount_to_refund_is_greater") ||
        errorCause?.message?.includes("payment_already_refunded")
      ) {
        throw new Error(
          "Não foi possível processar o reembolso (valor já reembolsado ou inválido)."
        );
      }

      throw new Error(
        "Falha na comunicação com a API de Reembolso do Mercado Pago."
      );
    }
  }
}
