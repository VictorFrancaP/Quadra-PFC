// exportando variavel com os tipos de status de pagamento
export const statusPayment = {
  PENDIND_PAYMENT: "PENDING_PAYMENT",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
} as const;

// pegando valores do objeto statusPayment
export type statusPayment = (typeof statusPayment)[keyof typeof statusPayment];

// exportando entidade
export class Reservation {
  // atributos
  public id?: string;
  public startTime: Date;
  public endTime: Date;
  public statusPayment: statusPayment;
  public expiredIn: Date;
  public totalPrice: number;
  public duration: number;
  public soccerId: string;
  public userId: string;
  public paymentTransactionId?: string | null;
  public paymentReceivedAt?: Date | null;

  // inicializador
  constructor(
    startTime: Date,
    endTime: Date,
    statusPayment: statusPayment,
    expiredIn: Date,
    totalPrice: number,
    duration: number,
    soccerId: string,
    userId: string,
    paymentTransactionId?: string | null,
    paymentReceivedAt?: Date | null,
    id?: string
  ) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.statusPayment = statusPayment;
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
      existing.id
    );
  }
}
