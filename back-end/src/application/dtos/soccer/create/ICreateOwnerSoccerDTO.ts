// exportando interface de dados
export interface ICreateOwnerSoccerDTO {
  userId: string;
  name: string;
  description: string;
  cep: string;
  address: string;
  city: string;
  state: string;
  operationDays: string[];
  openHour: string;
  closingHour: string;
  priceHour: number;
  maxDuration: number;
  ownerPixKey: string;
  observations?: string;
}
