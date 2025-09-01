// exportando classe de entidade
export class Soccer {
  // atributos
  public id?: string;
  public name: string;
  public description: string;
  public cep: string;
  public address: string;
  public city: string;
  public state: string;
  public cnpj: string;
  public fone: string;
  public operationDays: string[];
  public openHour: string;
  public closingHour: string;
  public priceHour: number;
  public maxDuration: number;
  public isActive: boolean;
  public userId: string;

  // opcionais
  public observations?: string | null;

  // inicializador
  constructor(
    name: string,
    description: string,
    cep: string,
    address: string,
    city: string,
    state: string,
    cnpj: string,
    fone: string,
    operationDays: string[],
    openHour: string,
    closingHour: string,
    priceHour: number,
    maxDuration: number,
    isActive: boolean,
    userId: string,
    observations?: string | null,
    id?: string
  ) {
    this.name = name;
    this.description = description;
    this.cep = cep;
    this.address = address;
    this.city = city;
    this.state = state;
    this.cnpj = cnpj;
    this.fone = fone;
    this.operationDays = operationDays;
    this.openHour = openHour;
    this.closingHour = closingHour;
    this.priceHour = priceHour;
    this.maxDuration = maxDuration;
    this.isActive = isActive;
    this.userId = userId;

    if (observations !== undefined) this.observations = observations;
    if (id) this.id = id;
  }
}
