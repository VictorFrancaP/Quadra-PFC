// exportando interface a ser implementada
export interface IDeleteUserOrderRepositories {
  deleteOrder(id: string): Promise<void>;
}
