// exportando interface a ser implementada
export interface ITotpProvider {
  // função para gerar o secret factor aleatorio
  generateSecret(email: string): {
    secret: string;
    otpAuthUrl: string;
  };

  // função para verificar o token digitado pelo usuário
  verifyToken(token: string, secret: string): boolean;
}
