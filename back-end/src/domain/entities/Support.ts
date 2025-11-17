// criando objeto imutavel com tipos de status de suporte
export const supportStatus = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  CLOSED: "CLOSED",
} as const;

// Tipos de status de suporte
export type supportStatus = (typeof supportStatus)[keyof typeof supportStatus];

// exportando classe de entidade
export class Support {
  public id?: string;
  public userId: string;
  public userEmail: string;
  public subject: string;
  public message: string;
  public status: supportStatus;
  public created_at?: Date;

  constructor(
    userId: string,
    userEmail: string,
    subject: string,
    message: string,
    status: supportStatus,
    id?: string,
    created_at?: Date
  ) {
    this.userId = userId;
    this.userEmail = userEmail;
    this.subject = subject;
    this.message = message;
    this.status = status;

    if (id) this.id = id;
    if (created_at !== undefined) this.created_at = created_at;
  }

  // atualização por meio do metodo estatico
  static updateSupport(existing: Support, updates: Partial<Support>): Support {
    return new Support(
      existing.userId,
      existing.userEmail,
      existing.subject,
      existing.message,
      updates.status !== undefined ? updates.status : existing.status,
      existing.id,
      existing.created_at
    );
  }
}
