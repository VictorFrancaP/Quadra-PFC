// Importando css
import styles from "../css/Header.module.css";
// Importando Link
import { Link } from "react-router-dom";
// Importando ícones
import { FaMapMarkerAlt, FaUsers, FaUser } from "react-icons/fa";
// Importando imagem
import Logo from "../assets/logo.png";

export const Header = () => {
  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.groupOne}>
          <img src={Logo} alt="Imagem Logo da plataforma" />
          <h2>Quadra Marcada</h2>
        </div>

        <div className={styles.groupTwo}>
          <div className={styles.container}>
            <FaMapMarkerAlt className={styles.icon} />
            <Link className={styles.link} to="/">
              Início
            </Link>
          </div>

          <div className={styles.container}>
            <FaUsers className={styles.icon} />
            <Link className={styles.link} to="/quadras">
              Quadras
            </Link>
          </div>

          <div className={styles.container}>
            <FaUser className={styles.icon} />
            <Link className={styles.link} to="/perfil">
              Perfil
            </Link>
          </div>
        </div>

        <div className={styles.groupThree}>
          <Link to="/login">Entrar</Link>
          <Link to="/cadastrar">Cadastrar</Link>
        </div>
      </header>
    </>
  );
};
