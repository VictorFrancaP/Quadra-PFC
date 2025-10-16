// declarando tipos do mercadopago
declare module "mercadopago" {
  // definindo interface para a resposta da preferencia
  interface PreferenceResponse {
    body: {
      id: string;
      init_point: string;
      [key: string]: any;
    };
  }

  // definindo interface para resposta do pagamento
  interface PaymentResponse {
    body: {
      id: number;
      status: string;
      external_reference: string;
      [key: string]: any;
    };
  }

  //   definindo interface para o objeto principal
  interface mercadoPagoModule {
    // configuração
    configure(options: { access_token: string }): void;

    // preferência
    preferences: {
      create(data: any): Promise<PreferenceResponse>;
    };

    // reembolso
    refund: {
      create(data: { payment_id: string }): Promise<any>;
    };

    // pagamento para callback do webhook
    payment: {
      get(paymentId: string | number): Promise<PaymentResponse>;
    };

    // outras opções
    [key: string]: any;
  }

  const mp: mercadoPagoModule;
  export = mp;
}
