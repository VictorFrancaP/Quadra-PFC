// Importando css
import styles from "../css/Header.module.css";
// Importando Link
import { Link } from "react-router-dom";
// Importando ícones
import { FaMapMarkerAlt, FaUsers, FaUser, FaSignOutAlt } from "react-icons/fa";
// Importando imagem
import Logo from "../assets/logo.png";

// IMPORTAR O HOOK 'useAuth' DO SEU CONTEXTO
import { useAuth } from "../context/AuthContext";

export const Header = () => {
  const { isAuthenticated, user, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
  };

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
        </div>
        <div className={styles.groupThree}>
          {!isAuthenticated ? (
            <>
              <Link to="/login">Entrar</Link>
              <Link className={styles.cadastrar} to="/user/cadastrar">Cadastrar</Link>
            </>
          ) : (
            <div className={styles.profileContainer}>
              <Link
                to="/profile"
                className={styles.profileLink}
                title="Ver Perfil"
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Foto de perfil"
                    className={styles.profileImage}
                  />
                ) : (
                  <FaUser className={styles.profileIcon} />
                )}
              </Link>
              <span className={styles.userName}>
                Olá, {user?.name.split(" ")[0]}
              </span>
              <button onClick={handleLogout} className={styles.logoutButton}>
                <FaSignOutAlt title="Sair" />
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
