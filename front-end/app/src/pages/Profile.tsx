import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Popup } from "../components/Popup";
import { api, useAuth } from "../context/AuthContext";
import type { User } from "../context/AuthContext";
import { FaUser } from "react-icons/fa";
import styles from "../css/Profile.module.css";

const formatCPF = (cpf: string | undefined | null): string => {
  if (!cpf) return "Não informado";
  const cleanCPF = cpf.replace(/\D/g, "");
  if (cleanCPF.length !== 11) return "CPF inválido";
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***-$4");
};

interface ProfileData extends User {
  age?: number;
  cep?: string;
  address?: string;
  cpf?: string;
}

export const ProfilePage = () => {
  const { user: contextUser, signOut } = useAuth();

  const [profile, setProfile] = useState<ProfileData | null>(contextUser);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupIsVisible, setPopupIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/auth/user/profile");
        setProfile(response.data.profile);
        setError(null);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data ||
          "Erro ao carregar perfil.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      "TEM CERTEZA QUE DESEJA DELETAR SUA CONTA?\n\nEsta ação é permanente e irreversível. Todos os seus dados serão perdidos."
    );

    if (!isConfirmed) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await api.delete("/auth/user/delete");

      setPopupMessage("Sua conta foi deletada com sucesso!");
      setPopupIsVisible(true);
      signOut();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Erro ao deletar a conta. Tente novamente.";
      setError(errorMessage);
      setIsDeleting(false);
    }
  };

  const renderContent = () => {
    if (isLoading && !profile) {
      return <p>Carregando perfil...</p>;
    }

    if (error && !profile) {
      return <p className={styles.errorMessage}>{error}</p>;
    }

    if (!profile) {
      return <p>Não foi possível carregar o perfil.</p>;
    }

    return (
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt="Foto de perfil"
              className={styles.profileImage}
            />
          ) : (
            <div className={styles.profileIconFallback}>
              <FaUser />
            </div>
          )}
          <h2>{profile.name}</h2>
          {profile.role === "ADMIN" && (
            <span className={styles.profileRole}>Administrador</span>
          )}
        </div>
        <div className={styles.profileDetails}>
          <h3>Informações Pessoais</h3>
          <div className={styles.detailItem}>
            <strong>Nome:</strong>
            <span>{profile.name}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Email:</strong>
            <span>{profile.email}</span>
          </div>
          <div className={styles.detailItem}>
            <strong>CPF:</strong>
            <span>{formatCPF(profile.cpf)}</span>
          </div>

          <div className={styles.detailItem}>
            <strong>Idade:</strong>
            <span>{profile.age ? `${profile.age} anos` : "Não informado"}</span>
          </div>
          <h3 className={styles.subHeader}>Endereço</h3>
          <div className={styles.detailItem}>
            <strong>CEP:</strong>
            <span>{profile.cep || "Não informado"}</span>
          </div>
          <div className={styles.detailItem}>
            <strong>Endereço:</strong>
            <span>{profile.address || "Não informado"}</span>
          </div>
        </div>
        {error && <p className={styles.actionError}>{error}</p>}
        <div className={styles.profileActions}>
          <button className={styles.actionButton}>Editar Perfil</button>
          <button className={styles.actionButton}>Alterar Senha</button>

          <button
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? "Deletando..." : "Deletar Conta"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>{renderContent()}</div>
      <Footer />
      <Popup
        isOpen={popupIsVisible}
        onClose={() => setPopupIsVisible(false)}
        title="Deletar conta"
        message={popupMessage}
      />
    </>
  );
};
