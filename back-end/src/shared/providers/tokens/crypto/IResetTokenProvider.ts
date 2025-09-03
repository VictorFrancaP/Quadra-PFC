// exportando interface a ser implementada
export interface IResetTokenProvider {
  generateToken(): Promise<string>;
}
