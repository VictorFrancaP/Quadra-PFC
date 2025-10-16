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
}
