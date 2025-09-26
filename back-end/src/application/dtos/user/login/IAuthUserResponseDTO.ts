// exportando interface de resposta da promise(promessa)
export interface IAuthUserResponseDTO {
  step: "setup_2fa" | "2fa_required";
  user: {
    name: string;
    id: string;
  };
  token?: string;
  refreshToken?: string;
}
