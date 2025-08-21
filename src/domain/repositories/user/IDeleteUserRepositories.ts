// exportando interface a ser implementada
export interface IDeleteUserRepositories {
  deleteUser(id: string): Promise<void>;
}
