// exportando interface de dados
export interface IUpdateSoccerOwnerDTO {
    userId: string;
    name: string;
    description: string;
    cep: string;
    address: string;
    city: string;
    state: string;
    fone: string;
    operationDays: string[];
    openHour: string;
    closingHour: string;
    priceHour: number;
    maxDuration: number;
    isActive: boolean;
    images: string[];
    observations: string;
}