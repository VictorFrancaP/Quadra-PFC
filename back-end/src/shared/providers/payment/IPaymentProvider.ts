// exportando interface para ser um parameter
export interface ITransactionDetails {
  status: string;
  external_reference: string | null;
  paymentId: string | number;
}

// exportando interface para ser um parameter
export interface IMakePayoutDTO {
  amount: number;
  destination: string;
  description: string;
}

// exportando interface de resposta
export interface IMakePayoutResult {
  transactionId: string;
}

// exportando interface a ser implementada
export interface IPaymentProvider {
  createPaymentPreference(
    value: number,
    description: string,
    reservationId: string
  ): Promise<{ preferenceId: string; initPoint: string }>;
  fetchTransactionDetails(paymentId: string): Promise<ITransactionDetails>;
  makePayout(data: IMakePayoutDTO): Promise<IMakePayoutResult>;
  createRefund(paymentTransactionId: string): Promise<void>;
}
