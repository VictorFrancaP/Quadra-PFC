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

// ip do front-end
const FRONT_HOST_PROD = process.env.FRONT_HOST_PROD || "";

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
    // ip para mandar a notificação de retorno
    const notificationUrl = `${WEBHOOK_HOST}/webhook/mercadopago`;

    // preferência de pagamento
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
        success: `${FRONT_HOST_PROD}/payment/success?reservationId=${reservationId}`,
        failure: `${FRONT_HOST_PROD}/payment/failure?reservationId=${reservationId}`,
        pending: `${FRONT_HOST_PROD}/payment/pending?reservationId=${reservationId}`,
      },
      auto_return: "approved",
    };

    try {
      // criando metodo de pagamento
      const response: PreferenceResponse = await this.preference.create({
        body: preferencesBody,
      });

      if (!response.id || !response.init_point) {
        console.error("[MercadoPago] Resposta inesperada:", response);
        throw new Error("Resposta inválida da API do Mercado Pago.");
      }

      // retornando link do pagamento e id da transação
      return {
        preferenceId: response.id,
        initPoint: response.init_point,
      };
    } catch (mpError: any) {
      // caso de erro na operação
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

  // detalhes da transação realizada
  async fetchTransactionDetails(
    paymentId: string
  ): Promise<ITransactionDetails> {
    if (!paymentId) {
      throw new Error("ID do pagamento (mpNotificationId) é inválido.");
    }

    try {
      // numero da transação
      const paymentIdAsNumber = Number(paymentId);

      const response: PaymentResponse = await this.payment.get({
        id: paymentIdAsNumber,
      });

      // retornando dados da transação
      return {
        status: response.status!,
        external_reference: response.external_reference || null,
        paymentId: response.id!,
      };
    } catch (mpError: any) {
      // caso de erro na operação
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

      throw new Error("Falha na comunicação com a API do Mercado Pago.");
    }
  }

  async makePayout(data: IMakePayoutDTO): Promise<IMakePayoutResult> {
    // simulando payout para o proprietário
    const { amount, destination, description } = data;

    // simulação
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

    // retornando resultado da simulação do payout
    return {
      transactionId: fakeTransactionId,
    };
  }

  async createRefund(paymentTransactionId: string): Promise<void> {
    // verificando se id da transação foi passado
    if (!paymentTransactionId) {
      throw new Error("ID da transação de pagamento é inválido.");
    }

    // criando metodo de reembolso
    const refundBody: PaymentRefundCreateData = {
      payment_id: paymentTransactionId,
    };

    try {
      // response do metodo de reembolso
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
      // caso de erro na operação
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
