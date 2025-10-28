import styles from "../css/Header.module.css";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaUser,
  FaSignOutAlt,
  FaStore,
  FaFileAlt,
  FaPlusSquare,
  FaStreetView,
  FaCalendarCheck,
  FaClipboardList,
} from "react-icons/fa";
import Logo from "../../public/logo-header.png";
import { useAuth } from "../context/AuthContext";
import { FaUserShield } from "react-icons/fa";

export const Header = () => {
  const { isAuthenticated, user, signOut } = useAuth();

  const isCommonUser =
    isAuthenticated &&
    user &&
    user.role?.toUpperCase() !== "ADMIN" &&
    user.role?.toUpperCase() !== "OWNER";

  const isAdminOrOwner =
    isAuthenticated &&
    user &&
    (user.role?.toUpperCase() === "ADMIN" ||
      user.role?.toUpperCase() === "OWNER");

  const isUserOrAdmin =
    isAuthenticated &&
    user &&
    (user.role?.toUpperCase() === "USER" ||
      user.role?.toUpperCase() === "ADMIN");

  const isOwner =
    isAuthenticated && user && user.role?.toUpperCase() === "OWNER";

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
          {isAuthenticated && (
            <div className={styles.container}>
              <FaStreetView className={styles.icon} />
              <Link className={styles.link} to="/quadras-proximas">
                Próximas
              </Link>
            </div>
          )}
          {isAuthenticated && user?.role?.toLowerCase() === "admin" && (
            <div className={styles.container}>
              <FaUserShield className={styles.icon} />
              <Link className={styles.link} to="/admin/dashboard">
                Admin
              </Link>
            </div>
          )}
          {isAdminOrOwner && (
            <div className={styles.container}>
              <FaPlusSquare className={styles.icon} />
              <Link className={styles.link} to="/cadastrar-quadra">
                Cadastrar Quadra
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
              <span className={styles.userName} style={{ marginRight: "0" }}>
                Olá, {user?.name.split(" ")[0]}
              </span>
              {isUserOrAdmin && (
                <Link
                  to="/minhas-reservas"
                  className={styles.headerActionLink}
                  title="Minhas Reservas"
                  style={{ padding: "6px" }}
                >
                  <FaCalendarCheck />
                </Link>
              )}
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
              {isOwner && (
                <Link
                  to="/minha-quadra"
                  className={styles.headerActionLink}
                  title="Minha Quadra"
                  style={{padding: "6px"}}
                >
                  <FaClipboardList />
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
