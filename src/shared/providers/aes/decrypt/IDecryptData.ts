// exportando interface a ser implementada
export interface IDecryptData {
  decrypted(data: string): Promise<string>;
}
