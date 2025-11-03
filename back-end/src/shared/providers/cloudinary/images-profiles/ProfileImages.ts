// Importando interface a ser implementada nesta classe
import { IProfileImages } from "./IProfileImages";

// exportando classe de implementação de interface
export class ProfileImages implements IProfileImages {
  async getImages(): Promise<string[]> {
    // armazenando imagens do cloudinary
    const profilesImages: string[] = [
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762120071/Corinthians-logo_ee2hdp.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762120060/Cruzeiro-logo_xqwt0f.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762120048/Ceara-logo_tm2y3l.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762120028/Bragantino-logo_jyj2n9.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119990/AtleticoMG-logo_pf3uph.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762120004/Bahia-logo_l79lpf.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762120018/Botafogo-logo_ztc51g.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119976/Vitoria-logo_ubadw2.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119962/VascoDaGama-logo_tv1sql.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119943/Sport-logo_cujfgy.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119930/S%C3%A3oPaulo-logo_odleeq.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119916/Santos-logo_kvgmsx.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119892/Palmeiras-logo_bdzgsu.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119851/Internacional-logo_rz8lxr.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119864/Juventude-logo_epesbk.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119878/Mirassol-logo_wvqkme.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119813/Gremio-logo_q83msl.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119795/Fortaleza-logo_iwcj3p.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119784/Fluminense-logo_ldknzw.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762119769/Flamengo-logo_riivd4.png",
      "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762120091/Default-team-logo_w7jfpm.avif",
    ];

    // retornando imagens
    return profilesImages;
  }
}
