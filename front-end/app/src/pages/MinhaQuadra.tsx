import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { MapComponent } from "../components/MapComponent";
import { Popup } from "../components/Popup";
import { UploadImagesModal } from "../components/UploadImagesModal";
import { EditSoccerModal } from "../components/EditSoccerModel";
import { api } from "../context/AuthContext";
import styles from "../css/MinhaQuadra.module.css";
import {
  FaSpinner,
  FaExclamationCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaPhoneAlt,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaEdit,
  FaPlusSquare,
  FaImages,
  FaTrash,
} from "react-icons/fa";

interface SoccerDetails {
  id: string;
  name: string;
  description: string;
  cep: string;
  address: string;
  city: string;
  state: string;
  cnpj: string;
  fone: string;
  operationDays: string[];
  openHour: string;
  closingHour: string;
  priceHour: number;
  maxDuration: number;
  isActive: boolean;
  userId: string;
  userName: string;
  images: string[];
  latitude?: number | null;
  longitude?: number | null;
  ownerPixKey?: string | null;
  observations?: string | null;
}

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/dxnsn1joz/image/upload/v1761429900/soccer-default_weihtp.png";

export const MyQuadraPage = () => {
  const navigate = useNavigate();
  const [soccer, setSoccer] = useState<SoccerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateButton, setShowCreateButton] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [popupInfo, setPopupInfo] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isError: boolean;
  }>({ isOpen: false, title: "", message: "", isError: false });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false); 

  const fetchMyQuadra = async () => {
    setIsLoading(true);
    setError(null);
    setShowCreateButton(false);
    try {
      const response = await api.get<SoccerDetails>("/auth/soccer/find");
      setSoccer(response.data);
      setCurrentImageIndex(0);
    } catch (err: any) {
      console.error(
        "Erro ao buscar quadra do proprietário:",
        err.response || err
      );
      if (
        err.response?.status === 404 ||
        err.response?.data?.includes("não encontrada")
      ) {
        setError("Você ainda não cadastrou sua quadra.");
        setShowCreateButton(true);
      } else {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data ||
          "Erro ao carregar seus dados.";
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyQuadra();
  }, []);

  const getDisplayImage = (): string => {
    if (soccer?.images && soccer.images.length > 0) {
      return (
        soccer.images[currentImageIndex] ||
        soccer.images[0] ||
        DEFAULT_IMAGE_URL
      );
    }
    return DEFAULT_IMAGE_URL;
  };
  const nextImage = () => {
    if (soccer?.images && soccer.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % soccer.images.length);
    }
  };
  const prevImage = () => {
    if (soccer?.images && soccer.images.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + soccer.images.length) % soccer.images.length
      );
    }
  };
  const showPopup = (
    title: string,
    message: string,
    isError: boolean = false
  ) => {
    setPopupInfo({ isOpen: true, title, message, isError });
  };
  const closePopup = () => {
    setPopupInfo({ ...popupInfo, isOpen: false });
  };

  const handleUpdateSuccess = (updatedData: Partial<SoccerDetails>) => {
    setSoccer((prev) => (prev ? { ...prev, ...updatedData } : null));
    setIsEditModalOpen(false);
    showPopup("Sucesso", "Informações da quadra atualizadas.");
  };
  const handleImageUploadSuccess = (updatedFullImageList: string[]) => {
    setSoccer((prev) => {
      if (!prev) return null;
      return { ...prev, images: updatedFullImageList };
    });
    if (soccer?.images) setCurrentImageIndex(soccer.images.length);
    setIsUploadModalOpen(false);
    showPopup("Sucesso", "Imagens enviadas com sucesso!");
  };

  const handleDeleteClick = () => {
    setError(null);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsConfirmDeleteOpen(false);
    setIsDeleting(true);
    setError(null);
    try {
      await api.delete("/auth/soccer/delete");
      showPopup("Quadra Deletada", "Sua quadra foi deletada com sucesso.");
      setSoccer(null);
      setShowCreateButton(true);
      setError("Você ainda não cadastrou sua quadra.");
    } catch (err: any) {
      console.error("Erro ao deletar quadra:", err.response);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Erro ao deletar a quadra.";
      showPopup("Erro", errorMessage, true);
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.centeredMessage}>
          <FaSpinner className={styles.spinner} /> Carregando...
        </div>
      );
    }

    if (showCreateButton) {
      return (
        <div className={styles.emptyStateContainer}>
          <FaExclamationCircle className={styles.emptyIcon} />
          <h2>Nenhuma Quadra Cadastrada</h2>
          <p>
            {error || "Você ainda não cadastrou os detalhes da sua quadra."}
          </p>
          <button
            className={styles.createButton}
            onClick={() => navigate("/cadastrar-quadra")}
          >
            <FaPlusSquare /> Cadastrar Minha Quadra
          </button>
        </div>
      );
    }
    if (error) {
      return (
        <div className={styles.centeredMessage}>
          <p className={styles.errorMessage}>
            <FaExclamationCircle /> {error}
          </p>
        </div>
      );
    }

    if (soccer) {
      return (
        <div className={styles.detailCard}>
          <div className={styles.imageSection}>
            {soccer.images && soccer.images.length > 1 && (
              <button
                onClick={prevImage}
                className={`${styles.navButton} ${styles.prev}`}
                aria-label="Imagem anterior"
              >
                &#10094;
              </button>
            )}
            <img
              src={getDisplayImage()}
              alt={`Imagem ${soccer.name}`}
              className={styles.mainImage}
              onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE_URL)}
            />
            {soccer.images && soccer.images.length > 1 && (
              <button
                onClick={nextImage}
                className={`${styles.navButton} ${styles.next}`}
                aria-label="Próxima imagem"
              >
                &#10095;
              </button>
            )}
            {soccer.images && soccer.images.length > 1 && (
              <div className={styles.thumbnailContainer}>
                {soccer.images.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`Miniatura ${index + 1}`}
                    className={`${styles.thumbnail} ${
                      index === currentImageIndex ? styles.activeThumbnail : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={{marginTop: "60px"}} className={styles.mainInfoSection}>
            <h1>{soccer.name}</h1>
            <p className={styles.address}>
              <FaMapMarkerAlt /> {soccer.address}, {soccer.city} -{" "}
              {soccer.state}
            </p>
            <div className={styles.statusPrice}>
              <span
                className={`${styles.statusBadge} ${
                  soccer.isActive ? styles.statusActive : styles.statusInactive
                }`}
              >
                {soccer.isActive ? (
                  <>
                    <FaCheckCircle /> Ativa
                  </>
                ) : (
                  <>
                    <FaTimesCircle /> Inativa
                  </>
                )}
              </span>
              <span className={styles.price}>
                <FaDollarSign />
                {soccer.priceHour.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}{" "}
                / hora
              </span>
            </div>
            <p className={styles.description}>{soccer.description}</p>

            <div className={styles.actionButtonsContainer}>
              <button
                className={`${styles.actionButton} ${styles.editButton}`}
                onClick={() => setIsEditModalOpen(true)}
              >
                <FaEdit /> Editar Informações
              </button>
              <button
                className={`${styles.actionButton} ${styles.uploadButton}`}
                onClick={() => setIsUploadModalOpen(true)}
                disabled={(soccer.images?.length || 0) >= 10}
              >
                <FaImages /> Adicionar Imagens
              </button>
              <button
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={handleDeleteClick}
                disabled={isDeleting}
                title={
                  soccer.isActive
                    ? "Desative a quadra para deletar"
                    : "Deletar Quadra"
                }
              >
                {isDeleting ? (
                  <FaSpinner className={styles.spinner} />
                ) : (
                  <FaTrash />
                )}
                Deletar Quadra
              </button>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <strong>
                <FaCalendarAlt /> Dias:
              </strong>
              <span>{soccer.operationDays?.join(", ") || "Não informado"}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>
                <FaClock /> Horário:
              </strong>
              <span>
                {soccer.openHour} - {soccer.closingHour}
              </span>
            </div>
            <div className={styles.detailItem}>
              <strong>
                <FaHourglassHalf /> Duração Máx.:
              </strong>
              <span>{soccer.maxDuration} hora(s)</span>
            </div>
            <div className={styles.detailItem}>
              <strong>
                <FaPhoneAlt /> Contato:
              </strong>
              <span>{soccer.fone}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Proprietário:</strong> <span>{soccer.userName}</span>
            </div>
            {soccer.observations && (
              <div className={`${styles.detailItem} ${styles.fullWidth}`}>
                <strong>
                  <FaInfoCircle /> Observações:
                </strong>
                <span>{soccer.observations}</span>
              </div>
            )}
          </div>

          {soccer.latitude && soccer.longitude && (
            <div className={styles.mapSection}>
              <h3>Localização no Mapa</h3>
              <div className={styles.mapContainer}>
                <MapComponent
                  quadras={[
                    {
                      id: soccer.id,
                      name: soccer.name,
                      latitude: soccer.latitude,
                      longitude: soccer.longitude,
                    },
                  ]}
                  initialZoom={16}
                />
              </div>
            </div>
          )}
        </div>
      );
    }
    return (
      <div className={styles.centeredMessage}>
        <p>Ocorreu um erro inesperado.</p>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>{renderContent()}</div>
      <Footer />

      <Popup
        isOpen={popupInfo.isOpen}
        onClose={closePopup}
        title={popupInfo.title}
        message={popupInfo.message}
      />

      <Popup
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja deletar sua quadra permanentemente? Esta ação é irreversível."
        confirmText="Deletar"
        cancelText="Cancelar"
      />

      {soccer && (
        <EditSoccerModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentSoccer={soccer}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {soccer && (
        <UploadImagesModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          soccerId={soccer.id}
          currentImageCount={soccer.images?.length || 0}
          maxTotalImages={10}
          maxFilesPerUpload={5}
          onUploadSuccess={handleImageUploadSuccess}
        />
      )}
    </>
  );
};
