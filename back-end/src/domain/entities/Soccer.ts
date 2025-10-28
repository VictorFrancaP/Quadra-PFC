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
  public userName: string;
  public images: string[];
  public latitude?: number | null;
  public longitude?: number | null;
  public ownerPixKey?: string | null;

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
    userName: string,
    images: string[],
    latitude?: number | null,
    longitude?: number | null,
    ownerPixKey?: string | null,
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
    this.userName = userName;
    this.images = images;

    if (latitude !== undefined) this.latitude = latitude;
    if (longitude !== undefined) this.longitude = longitude;
    if (ownerPixKey !== undefined) this.ownerPixKey = ownerPixKey;
    if (observations !== undefined) this.observations = observations;
    if (id) this.id = id;
  }

  // criando metodo estatico para atualização de informações da quadra (soccer)
  static updateSoccer(existing: Soccer, updates: Partial<Soccer>): Soccer {
    return new Soccer(
      updates.name ?? existing.name,
      updates.description ?? existing.description,
      updates.cep ?? existing.cep,
      updates.address ?? existing.address,
      updates.city ?? existing.city,
      updates.state ?? existing.state,
      existing.cnpj,
      updates.fone ?? existing.fone,
      updates.operationDays ?? existing.operationDays,
      updates.openHour ?? existing.openHour,
      updates.closingHour ?? existing.closingHour,
      updates.priceHour ?? existing.priceHour,
      updates.maxDuration ?? existing.maxDuration,
      updates.isActive ?? existing.isActive,
      existing.userId,
      existing.userName,
      updates.images ?? existing.images,
      updates.latitude !== undefined ? updates.latitude : existing.latitude,
      updates.longitude !== undefined ? updates.longitude : existing.longitude,
      existing.ownerPixKey,
      updates.observations ?? existing.observations,
      existing.id
    );
  }
}
