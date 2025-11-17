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
  FaBookOpen,
  FaChartLine,
  FaRocketchat,
  FaHeadset,
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
          {isOwner && (
            <div className={styles.container}>
              <FaChartLine className={styles.icon} />
              <Link to="/owner/report" className={styles.link}>
                Relatório - Reservas
              </Link>
            </div>
          )}
          {isOwner && (
            <div className={styles.container}>
              <FaRocketchat className={styles.icon} />
              <Link to="/chats" className={styles.link}>
                Minhas conversas
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
                to="/chamados"
                className={styles.navIcon}
                title="Meus Chamados"
              >
                <FaHeadset style={{fontSize: "20px"}} />
              </Link>
              <Link style={{padding: "5px"}}
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
                  style={{ padding: "4px" }}
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
                  style={{ padding: "1px" }}
                >
                  <FaClipboardList />
                </Link>
              )}
              {isOwner && (
                <Link
                  to="/minha-quadra/reservas"
                  className={styles.headerActionLink}
                  title="Reservas da Minha Quadra"
                  style={{ padding: "1px" }}
                >
                  <FaBookOpen />
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
