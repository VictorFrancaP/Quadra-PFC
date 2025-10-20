// Importando css
import styles from "../css/Footer.module.css";
// Importando icons
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
// Importando Link
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

export const Footer = () => {
  // pegando ano atual
  const ano = new Date().getFullYear();

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.containerOne}>
          <div className={styles.group}>
            <div className={styles.brand}>
              <img src={Logo} alt="Imagem logo da plataforma" />
              <h2>Quadra Marcada</h2>
            </div>

            <p>
              A plataforma que conecta jogadores a <br /> quadras de futebol.
              Reserve, jogue e se <br /> divirta com segurança e praticidade.
            </p>

            <div className={styles.icons}>
              <FaFacebookF size={24} color="#000" />
              <FaInstagram size={24} color="#000" />
              <FaTwitter size={24} color="#000" />
            </div>
          </div>

          <div className={styles.group}>
            <div>
              <h2>Links Rápidos</h2>
            </div>
            <Link to="/">Inicio</Link>
            <Link to="/quadras">Quadras</Link>
            <Link to="/perfil">Meu Perfil</Link>
            <Link to="/">Como funciona</Link>
          </div>

          <div className={styles.group}>
            <div>
              <h2>Suporte</h2>
            </div>
            <Link to="/ajuda">Central de Ajuda</Link>
            <Link to="/termos">Termos de Uso</Link>
            <Link to="/politica">Politica de Privacidade</Link>
            <Link to="/contato">Contato</Link>
            <Link to="/faq">FAQ</Link>
          </div>

          <div className={styles.group}>
            <div>
              <h2>Contato</h2>
            </div>

            <div className={styles.iconContato}>
              <FaMapMarkerAlt size={24} color="#000" />
              <p>São Paulo - SP, Brasil</p>
            </div>

            <div className={styles.iconContato}>
              <MdEmail size={24} color="#000" />
              <p>alugueldequadrasmarcada@gmail.com</p>
            </div>

            <div className={styles.iconContato}>
              <FaPhoneAlt size={24} color="#000" />
              <p>(11) 91234-5678</p>
            </div>
          </div>
        </div>

        <hr />

        <div className={styles.containerTwo}>
          <div>
            <p> © {ano} Quadra Marcada. Todos os direitos reservados</p>
          </div>

          <div>
            <p className={styles.under}>Politica de Cookies</p>
            <p className={styles.under}>LGPD</p>
          </div>
        </div>
      </footer>
    </>
  );
};
