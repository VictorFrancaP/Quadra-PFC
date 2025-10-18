// exportando interface para ser uma promise(promessa)
export interface IPayoutResult {
  transactionId: string;
  status: "success" | "failed" | "pending";
}

// exportando interface para ser um parameter
export interface IPayoutRequest {
  amount: number;
  destination: string;
  description: string;
}

// exportando interface a ser implementada
export interface IPaymentProvider {
  createPaymentPreference(
    value: number,
    description: string,
    reservationId: string,
    soccerOwnerKey?: string
  ): Promise<{ preferenceId: string; initPoint: string }>;
  createRefund(paymentTransactionId: string): Promise<void>;
  fetchTransactionDetails(paymentId: string): Promise<any>;
  makePayout(data: IPayoutRequest): Promise<IPayoutResult>;
}
