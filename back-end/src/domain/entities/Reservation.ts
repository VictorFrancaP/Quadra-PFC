// exportando variavel com os tipos de status de pagamento
export const statusPayment = {
  PENDIND_PAYMENT: "PENDING_PAYMENT",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;

// pegando valores do objeto statusPayment
export type statusPayment = (typeof statusPayment)[keyof typeof statusPayment];

// exportando variavel com tipos de status de payout
export const statusPayout = {
  PENDIND: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
} as const;

// exportando tipos de status de payout
export type statusPayout = (typeof statusPayout)[keyof typeof statusPayout];

// exportando entidade
export class Reservation {
  // atributos
  public id?: string;
  public startTime: Date;
  public endTime: Date;
  public statusPayment: statusPayment;
  public statusPayout: statusPayout;
  public expiredIn: Date;
  public totalPrice: number;
  public duration: number;
  public soccerId: string;
  public userId: string;
  public paymentTransactionId?: string | null;
  public paymentReceivedAt?: Date | null;
  public systemFeeAmount?: number | null;
  public netPayoutAmount?: number | null;
  public payoutDate?: Date | null;
  public payoutTransactionId?: string | null;

  // inicializador
  constructor(
    startTime: Date,
    endTime: Date,
    statusPayment: statusPayment,
    statusPayout: statusPayout,
    expiredIn: Date,
    totalPrice: number,
    duration: number,
    soccerId: string,
    userId: string,
    paymentTransactionId?: string | null,
    paymentReceivedAt?: Date | null,
    systemFeeAmount?: number | null,
    netPayoutAmount?: number | null,
    payoutDate?: Date | null,
    payoutTransactionId?: string | null,
    id?: string
  ) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.statusPayment = statusPayment;
    this.statusPayout = statusPayout;
    this.paymentTransactionId = paymentTransactionId;
    this.expiredIn = expiredIn;
    this.totalPrice = totalPrice;
    this.duration = duration;
    this.soccerId = soccerId;
    this.userId = userId;

    if (paymentTransactionId !== undefined)
      this.paymentTransactionId = paymentTransactionId;
    if (paymentReceivedAt !== undefined)
      this.paymentReceivedAt = paymentReceivedAt;
    if (systemFeeAmount !== undefined) this.systemFeeAmount = systemFeeAmount;
    if (netPayoutAmount !== undefined) this.netPayoutAmount = netPayoutAmount;
    if (payoutDate !== undefined) this.payoutDate = payoutDate;
    if (payoutTransactionId !== undefined)
      this.payoutTransactionId = payoutTransactionId;
    if (id) this.id = id;
  }

  // metodo estatico para atualização
  static updatesReservation(
    existing: Reservation,
    updates: Partial<Reservation>
  ): Reservation {
    return new Reservation(
      existing.startTime,
      existing.endTime,
      updates.statusPayment ?? existing.statusPayment,
      updates.statusPayout ?? existing.statusPayout,
      existing.expiredIn,
      existing.totalPrice,
      existing.duration,
      existing.soccerId,
      existing.userId,
      updates.paymentTransactionId !== undefined
        ? updates.paymentTransactionId
        : existing.paymentTransactionId,
      updates.paymentReceivedAt !== undefined
        ? updates.paymentReceivedAt
        : existing.paymentReceivedAt,
      updates.systemFeeAmount !== undefined
        ? updates.systemFeeAmount
        : existing.systemFeeAmount,
      updates.netPayoutAmount !== undefined
        ? updates.netPayoutAmount
        : existing.netPayoutAmount,
      updates.payoutDate !== undefined
        ? updates.payoutDate
        : existing.payoutDate,
      updates.payoutTransactionId !== undefined
        ? updates.payoutTransactionId
        : existing.payoutTransactionId,
      existing.id
    );
  }
}
