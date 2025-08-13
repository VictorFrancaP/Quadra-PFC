// exportando interface a ser implementada
export interface ICompareProvider {
  comparePassword(data: string, hashed: string): Promise<boolean>;
}
