// exportando classe de error personalizada para tratamento
export class ErrorSuper extends Error {
  // criando variavel de statusCode
  public readonly statusCode: number;

  // criando construtor para herdarmos o message e o utilizarmos o statusCode
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
