// Tipos de status de suporte
export type supportStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";

// exportando classe de entidade
export class Support {
  public id?: string;
  public userId: string;
  public subject: string;
  public message: string;
  public status: supportStatus;

  constructor(
    userId: string,
    subject: string,
    message: string,
    status: supportStatus,
    id?: string
  ) {
    this.userId = userId;
    this.subject = subject;
    this.message = message;
    this.status = status;

    if (id) this.id = id;
  }
}
