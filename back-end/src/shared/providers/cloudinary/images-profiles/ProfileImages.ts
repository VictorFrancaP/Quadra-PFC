// Importando interface a ser implementada nesta classe
import { IProfileImages } from "./IProfileImages";

// exportando classe de implementação de interface
export class ProfileImages implements IProfileImages {
  async getImages(): Promise<string[]> {
    // armazenando imagens do cloudinary
    const profilesImages: string[] = [
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762744928/Corinthians-logo_ee2hdp-removebg-preview_duj29z.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762120060/Cruzeiro-logo_xqwt0f.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762745019/Ceara-logo_tm2y3l-removebg-preview_w1blin.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762745120/red-bull-bragantino-logo-0-removebg-preview_lezccq.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119990/AtleticoMG-logo_pf3uph.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762120004/Bahia-logo_l79lpf.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762745227/botafogo-removebg-preview_apdc2o.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119976/Vitoria-logo_ubadw2.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762745610/vasco-removebg-preview_ilszgb.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762745418/sport-removebg-preview_d7ckrc.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762745314/sp-removebg-preview_sddlxp.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119916/Santos-logo_kvgmsx.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762745521/png-transparent-sociedade-esportiva-palmeiras-campeonato-brasileiro-serie-a-logo-football-football-sport-logo-sports-removebg-preview_ozsugw.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119851/Internacional-logo_rz8lxr.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119864/Juventude-logo_epesbk.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762745689/mirassol-removebg-preview_wbhfoh.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119813/Gremio-logo_q83msl.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762745919/fortaleza-removebg-preview_mdz7qw.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762746304/fluminense-removebg-preview_ji7cpj.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762746092/clube-de-regatas-do-flamengo-logo-vector-11574187919spjqeerhzi-removebg-preview_c6b4lp.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762746407/logo-removebg-preview_x7eda7.png",
    ];

    // retornando imagens
    return profilesImages;
  }
}
