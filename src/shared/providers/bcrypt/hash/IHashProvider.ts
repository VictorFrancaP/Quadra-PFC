// exportando interface a ser implementada
export interface IHashProvider {
  hashPassword(data: string): Promise<string>;
}
