import styles from "../css/Header.module.css";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaUser,
  FaSignOutAlt,
  FaStore,
  FaFileAlt,
  FaDoorOpen,
} from "react-icons/fa";
import Logo from "../../public/logo.png";
import { useAuth } from "../context/AuthContext";
import { FaUserShield } from "react-icons/fa";

export const Header = () => {
  const { isAuthenticated, user, signOut } = useAuth();

  const isCommonUser =
    isAuthenticated &&
    user &&
    user.role?.toUpperCase() !== "ADMIN" &&
    user.role?.toUpperCase() !== "OWNER";

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
          {isAuthenticated && user?.role?.toLowerCase() === "admin" && (
            <div className={styles.container}>
              <FaUserShield className={styles.icon} />
              <Link className={styles.link} to="/admin/dashboard">
                Admin
              </Link>
            </div>
          )}
        </div>
        <div className={styles.groupThree}>
          {!isAuthenticated ? (
            <>
              <Link to="/login">Entrar</Link>
              <Link className={styles.cadastrar} to="/user/cadastrar">
                Cadastrar
              </Link>
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
              {isCommonUser && (
                <Link
                  to="/minha-solicitacao"
                  className={styles.headerActionLink}
                  title="Minha Solicitação"
                >
                  <FaFileAlt />
                </Link>
              )}
              {isCommonUser && (
                <Link
                  to="/solicitar-proprietario"
                  className={styles.becomeOwnerLink}
                  title="Virar Proprietário"
                >
                  <FaStore />
                  <span>Virar Proprietário</span>
                </Link>
              )}
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
