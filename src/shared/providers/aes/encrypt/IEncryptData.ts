// Exportando interface a ser implementada
export interface IEncryptData {
  encrypted(data: string): Promise<string>;
}
