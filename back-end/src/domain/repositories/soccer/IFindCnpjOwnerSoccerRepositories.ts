// exportando interface para ser promise(promessa)
export interface IFindCnpjOwnerSoccerRequest {
  cnpj: string;
  userId: string;
}

// exportando interface a ser implementada
export interface IFindCnpjOwnerSoccerRepositories {
  findCnpjOwner(cnpj: string): Promise<IFindCnpjOwnerSoccerRequest[] | null>;
}
