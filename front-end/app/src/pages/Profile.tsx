import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Popup } from "../components/Popup";
import { EditProfileModal } from "../components/EditProfile";
import { api, useAuth } from "../context/AuthContext";
import type { User } from "../context/AuthContext";
import { FaEdit, FaUser } from "react-icons/fa";
import styles from "../css/Profile.module.css";
import { ChangePictureModal } from "../components/ChangePictureModal";

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
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [isForgotPasswordConfirmOpen, setIsForgotPasswordConfirmOpen] =
    useState(false);
  const [isForgotPasswordSuccessOpen, setIsForgotPasswordSuccessOpen] =
    useState(false);

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

  useEffect(() => {
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

  const handleEditClick = () => {
    setError(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateSuccess = (updatedData: Partial<ProfileData>) => {
    setProfile((prev) => (prev ? { ...prev, ...updatedData } : null));
    setIsEditModalOpen(false);
  };

  const handlePictureSaveSuccess = (newImageUrl: string) => {
    setProfile((prev) =>
      prev ? { ...prev, profileImage: newImageUrl } : null
    );
    fetchProfile();
    setIsPictureModalOpen(false);
  };

  const handleForgotPasswordClick = () => {
    setError(null);
    setIsForgotPasswordConfirmOpen(true);
  };

  const handleConfirmForgotPassword = async () => {
    setIsForgotPasswordConfirmOpen(false);
    setIsForgotPasswordLoading(true);
    setError(null);

    try {
      await api.post("/auth/user/forgot-password", {
        email: profile?.email,
      });

      setIsForgotPasswordSuccessOpen(true);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Erro ao solicitar alteração de senha. Tente novamente.";
      setError(errorMessage);
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading && !profile) {
      return (
        <div className={styles.centeredMessage}>
          <p>Carregando perfil...</p>
        </div>
      );
    }
    if (error && !profile) {
      return (
        <div className={styles.centeredMessage}>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      );
    }
    if (!profile) {
      return (
        <div className={styles.centeredMessage}>
          <p>Não foi possível carregar o perfil.</p>
        </div>
      );
    }

    return (
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.profileImageContainer}>
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
            <button
              className={styles.editImageButton}
              title="Alterar foto de perfil"
              onClick={() => setIsPictureModalOpen(true)}
            >
              <FaEdit />
            </button>
          </div>
          <h2>{profile.name}</h2>
          {profile.role &&
            (profile.role.toUpperCase() === "ADMIN" ||
              profile.role.toUpperCase() === "OWNER") && (
              <span className={styles.profileRole}>
                {profile.role.toUpperCase() === "ADMIN"
                  ? "Administrador"
                  : "Proprietário"}
              </span>
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
          <button className={styles.actionButton} onClick={handleEditClick}>
            Editar Perfil
          </button>
          <button
            className={styles.actionButton}
            onClick={handleForgotPasswordClick}
            disabled={isForgotPasswordLoading}
          >
            {isForgotPasswordLoading ? "Enviando..." : "Alterar Senha"}
          </button>

          {profile.role.toUpperCase() !== "ADMIN" && (
            <button
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
                          {isDeleting ? "Deletando..." : "Deletar Conta"}       
               {" "}
            </button>
          )}
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
        title="Confirmar Exclusão"
        message="Tem certeza que deseja deletar sua conta?"
        confirmText="Deletar"
        cancelText="Cancelar"
      />
      <Popup
        isOpen={isForgotPasswordConfirmOpen}
        onClose={() => setIsForgotPasswordConfirmOpen(false)}
        onConfirm={handleConfirmForgotPassword}
        title="Alterar Senha"
        message="Você receberá um e-mail com instruções para redefinir sua senha. Deseja continuar?"
        confirmText="Continuar"
        cancelText="Cancelar"
      />
      <Popup
        isOpen={isForgotPasswordSuccessOpen}
        onClose={() => setIsForgotPasswordSuccessOpen(false)}
        title="Sucesso!"
        message="Enviamos um e-mail para você com as instruções para alterar sua senha."
      />
      {profile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentProfile={profile}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
      <ChangePictureModal
        isOpen={isPictureModalOpen}
        onClose={() => setIsPictureModalOpen(false)}
        onSaveSuccess={handlePictureSaveSuccess}
        currentImageUrl={profile?.profileImage}
      />
    </>
  );
};
