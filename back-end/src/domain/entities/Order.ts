// criando objeto javascript para criar variaveis literais
export const orderStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  DENIED: "DENIED",
} as const;

// pegando chaves do objeto com keyof
export type orderStatus = (typeof orderStatus)[keyof typeof orderStatus];

// exportando classe de entidade
export class Order {
  // atributos
  public id?: string;
  public localName: string;
  public description: string;
  public cnpj: string;
  public fone: string;
  public status: orderStatus;
  public userId: string;

  // construtor
  constructor(
    localName: string,
    description: string,
    cnpj: string,
    fone: string,
    status: orderStatus,
    userId: string,
    id?: string
  ) {
    this.localName = localName;
    this.description = description;
    this.cnpj = cnpj;
    this.fone = fone;
    this.status = status;
    this.userId = userId;

    if (id) this.id = id;
  }

  // metodo estatico para atualização da solicitação do usuário
  static updateUserOrder(existing: Order, updates: Partial<Order>): Order {
    return new Order(
      updates.localName ?? existing.localName,
      updates.description ?? existing.description,
      existing.cnpj,
      updates.fone ?? existing.fone,
      updates.status ?? existing.status,
      existing.userId,
      existing.id
    );
  }
}
