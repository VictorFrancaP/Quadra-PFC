// exportando classe de entidade
export class Order {
  // atributos
  public id?: string;
  public localName: string;
  public description: string;
  public cnpj: string;
  public fone: string;
  public approved: boolean;
  public userId: string;

  // construtor
  constructor(
    localName: string,
    description: string,
    cnpj: string,
    fone: string,
    approved: boolean,
    userId: string,
    id?: string
  ) {
    this.localName = localName;
    this.description = description;
    this.cnpj = cnpj;
    this.fone = fone;
    this.approved = approved;
    this.userId = userId;

    if (id) this.id = id;
  }
}
