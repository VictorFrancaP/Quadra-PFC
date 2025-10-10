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
  public totalPrice: number;
  public duration: number;
  public soccerId: string;
  public userId: string;

  // inicializador
  constructor(
    startTime: Date,
    endTime: Date,
    statusPayment: statusPayment,
    totalPrice: number,
    duration: number,
    soccerId: string,
    userId: string,
    id?: string
  ) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.statusPayment = statusPayment;
    this.totalPrice = totalPrice;
    this.duration = duration;
    this.soccerId = soccerId;
    this.userId = userId;

    if (id) this.id = id;
  }
}
