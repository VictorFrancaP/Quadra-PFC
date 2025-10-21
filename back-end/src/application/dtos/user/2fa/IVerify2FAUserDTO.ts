// exportando interface de dados
export interface IVerify2FAUserDTO {
  userId: string;
  token: string;
}

// exportando interface de resposta
export interface IVerify2FAUserResponse {
  accessToken?: string;
  refreshToken?: string;
}
