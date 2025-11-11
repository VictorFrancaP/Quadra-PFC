import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { MapComponent } from "../components/MapComponent";
import { Popup } from "../components/Popup";
import { ChatModal } from "../components/ChatModal";
import { api, useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import styles from "../css/QuadraDetails.module.css";
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
  FaComments,
  FaUser,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { RatingModal } from "../components/RatingModal";

interface RatingWithUser {
  id: string;
  rating: number;
  comments: string | null;
  created_at: string;
  user: {
    name: string;
    profileImage: string;
  };
}

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

interface ChatRecipient {
  id: string;
  name: string;
}

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762130308/imagem-quadra-padrao_ly9lpz.jpg";

export const SoccerDetailPage = () => {
  const { id: soccerId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuth();
  const { socket, isConnected: isSocketConnected } = useSocket();
  const [soccer, setSoccer] = useState<SoccerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [popupInfo, setPopupInfo] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isError: boolean;
  }>({ isOpen: false, title: "", message: "", isError: false });
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<ChatRecipient | null>(
    null
  );
  const [average, setAverage] = useState<number | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [ratings, setRatings] = useState<RatingWithUser[]>([]);
  const [isRatingsLoading, setIsRatingsLoading] = useState(true);
  const [ratingsError, setRatingsError] = useState<string | null>(null);

  useEffect(() => {
    if (!soccerId) {
      setError("ID da quadra não fornecido.");
      setIsLoading(false);
      return;
    }
    const fetchSoccerDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<SoccerDetails>(
          `/auth/soccer/${soccerId}`
        );
        setSoccer(response.data);
      } catch (err: any) {
        console.error("Erro ao buscar detalhes:", err.response || err);
        const errorMessage =
          err.response?.status === 404
            ? "Quadra não encontrada."
            : err.response?.data?.message ||
              err.response?.data ||
              "Erro ao carregar.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSoccerDetails();
  }, [soccerId]);

  useEffect(() => {
    if (!soccerId) return;

    const fetchRatings = async () => {
      setIsRatingsLoading(true);
      setRatingsError(null);
      try {
        const response = await api.get<RatingWithUser[]>(
          `/auth/rating/findAll/${soccerId}`
        );
        setRatings(response.data);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data ||
          "Erro ao carregar avaliações.";

        if (errorMessage.includes("Avaliação não encontrada")) {
          setRatings([]);
        } else {
          setRatingsError(errorMessage);
        }
      } finally {
        setIsRatingsLoading(false);
      }
    };

    fetchRatings();
  }, [soccerId]);

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

  const handleStartChat = () => {
    if (!isSocketConnected || !socket) {
      showPopup(
        "Erro de Conexão",
        "A conexão com o chat não está ativa.",
        true
      );
      return;
    }
    if (!soccer || !soccer.userId || !soccer.userName) {
      showPopup("Erro", "Não foi possível identificar o proprietário.", true);
      return;
    }
    if (loggedInUser?.id === soccer.userId) {
      showPopup("Aviso", "Você não pode iniciar um chat consigo mesmo.", true);
      return;
    }
    setChatRecipient({ id: soccer.userId, name: soccer.userName });
    setIsChatModalOpen(true);
  };

  const handleRatingAverage = async () => {
    if (!soccer) return;

    try {
      const response = await api.get(`/auth/rating/find/soccer/${soccer.id}`);
      setAverage(response.data.average.average);
      setHasRated(response.data.average.hasRated);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    handleRatingAverage();
  }, [soccer]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>
        {i < Math.round(rating) ? (
          <FaStar color="#ffc107" />
        ) : (
          <FaRegStar color="#e4e5e9" />
        )}
      </span>
    ));
  };

  const renderRatingsList = () => {
    if (isRatingsLoading) {
      return (
        <div className={styles.centeredMessage}>
          <FaSpinner className={styles.spinner} /> Carregando avaliações...
        </div>
      );
    }

    if (ratingsError) {
      return (
        <div className={styles.centeredMessage}>
          <p className={styles.errorMessage}>
            <FaExclamationCircle /> {ratingsError}
          </p>
        </div>
      );
    }

    if (ratings.length === 0) {
      return (
        <div className={styles.centeredMessage}>
          <p>
            Esta quadra ainda não possui avaliações. Seja o primeiro a avaliar!
          </p>
        </div>
      );
    }

    return (
      <div className={styles.ratingsList}>
        {ratings.map((rating) => (
          <div key={rating.id} className={styles.ratingItem}>
            <div className={styles.ratingHeader}>
              <div className={styles.ratingUser}>
                {rating.user?.profileImage ? (
                  <img
                    src={rating.user.profileImage}
                    alt={rating.user?.name || "Usuário"}
                    className={styles.ratingUserImage}
                  />
                ) : (
                  <div className={styles.ratingUserIcon}>
                    <FaUser />
                  </div>
                )}
                <strong>{rating.user?.name || "Usuário"}</strong>
              </div>
              <div className={styles.ratingStars}>
                {renderStars(rating.rating)}
              </div>
            </div>
            {rating.comments && (
              <p className={styles.ratingComment}>"{rating.comments}"</p>
            )}
            <span className={styles.ratingDate}>
              {new Date().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.centeredMessage}>
          <FaSpinner className={styles.spinner} /> Carregando...
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

    if (!soccer) {
      return (
        <div className={styles.centeredMessage}>
          <p>Detalhes da quadra não encontrados.</p>
        </div>
      );
    }

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

        <div style={{ marginTop: "60px" }} className={styles.mainInfoSection}>
          <h1>{soccer.name}</h1>
          <p className={styles.address}>
            <FaMapMarkerAlt /> {soccer.address}, {soccer.city} - {soccer.state}
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
            {soccer.isActive ? (
              <button
                className={styles.reserveButton}
                onClick={() => navigate(`/reservar/${soccer.id}`)}
              >
                Reservar Agora
              </button>
            ) : (
              <p className={styles.inactiveMessage}>
                <FaExclamationCircle /> Indisponível para reserva
              </p>
            )}
            {loggedInUser &&
              isSocketConnected &&
              loggedInUser.id !== soccer.userId && (
                <button
                  className={`${styles.actionButton} ${styles.chatButton}`}
                  onClick={handleStartChat}
                  title={`Conversar com ${soccer.userName}`}
                >
                  <FaComments /> Conversar com Proprietário
                </button>
              )}
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
            <strong>
              <FaUser /> Proprietário:
            </strong>
            <span>{soccer.userName}</span>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column",
              alignItems: "center",
              gap: "10px",
              marginTop: "50px",
            }}
          >
            <div>
              {average !== null && (
                <div>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>
                      {i < Math.round(average) ? <FaStar /> : <FaRegStar />}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {!hasRated && (
              <button
                onClick={() => setIsRatingModalOpen(true)}
                className={styles.button}
              >
                Avaliar Quadra
              </button>
            )}
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

        <div className={styles.ratingsSection}>
          <h2>Avaliações da Quadra ({ratings.length})</h2>
          {renderRatingsList()}
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
        isOpen={popupInfo.isOpen}
        onClose={closePopup}
        title={popupInfo.title}
        message={popupInfo.message}
      />
      {chatRecipient && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          recipientId={chatRecipient.id}
          recipientName={chatRecipient.name}
        />
      )}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        soccerId={soccer?.id || ""}
        onRated={() => {
          setHasRated(true);
          handleRatingAverage();
          if (soccerId) {
            const fetchRatings = async () => {
              setIsRatingsLoading(true);
              setRatingsError(null);
              try {
                const response = await api.get<RatingWithUser[]>(
                  `/auth/rating/findAll/${soccerId}`
                );
                setRatings(response.data);
              } catch (err: any) {
                setError(err.message);
              } finally {
                setIsRatingsLoading(false);
              }
            };
            fetchRatings();
          }
        }}
      />
    </>
  );
};
