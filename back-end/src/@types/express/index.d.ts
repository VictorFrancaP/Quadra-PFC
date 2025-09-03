// Exportando inteface para a utilização do (request.user.id e request.user.role)
declare namespace Express {
  export interface Request {
    user: {
      id: string;
      role: "USER" | "ADMIN" | "OWNER";
    };
  }
}
