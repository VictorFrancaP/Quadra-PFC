// exportando interface de dados
export interface IFindUserOrderRequest {
  cnpj: string;
  userId: string;
}

// exportando interface a ser implementada
export interface IFindUserCnpjOrderRepositories {
  findUserCnpj(cnpj: string): Promise<IFindUserOrderRequest | null>;
}
