// exportando interface de dados
export interface IMailRequest {
  email: string;
  content: string;
  subject: string;
  resetToken?: string;
}

// exportando interface a ser implementada
export interface IMailProvider {
  send(mailPayload: IMailRequest): Promise<void>;
  linkConfirm: string;
}
