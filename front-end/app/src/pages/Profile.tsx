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
  const [error, setError] = useState<string | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
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

  const handleDeleteClick = () => {
    setError(null);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsConfirmOpen(false);
    setIsDeleting(true);
    setError(null);

    try {
      await api.delete("/auth/user/delete");

      setIsSuccessOpen(true);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Erro ao deletar a conta. Tente novamente.";
      setError(errorMessage);
      setIsDeleting(false);
    }
  };
  const handleSuccessPopupClose = () => {
    setIsSuccessOpen(false);
    signOut();
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
          {profile.role?.toLowerCase() === "admin" && (
            <span className={styles.profileRole}>Administrador</span>
          )}
          {profile.role?.toLowerCase() === "owner" && (
            <span className={styles.profileRole}>Proprietário</span>
          )}
        </div>
        <div className={styles.profileDetails}>
          <h3>Informações Pessoais</h3>
          <div className={styles.detailItem}>
            {" "}
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
            onClick={handleDeleteClick}
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
        isOpen={isSuccessOpen}
        onClose={handleSuccessPopupClose}
        title="Conta Deletada"
        message="Sua conta foi deletada com sucesso!"
      />
      <Popup
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Deletar Conta"
        message="Tem certeza que deseja deletar a sua conta?"
        confirmText="Deletar"
        cancelText="Cancelar"
      />
    </>
  );
};
