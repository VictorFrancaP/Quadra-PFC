import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { api } from "../context/AuthContext";
import styles from "../css/Quadra.module.css";
import {
  FaSpinner,
  FaExclamationCircle,
  FaMapMarkerAlt,
  FaDollarSign,
  FaEye,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

interface QuadraInfo {
  id: string;
  name: string;
  description: string;
  cep?: string;
  address?: string;
  city: string;
  state: string;
  images: string[];
  priceHour: number;
}

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762130308/imagem-quadra-padrao_ly9lpz.jpg";

export const QuadrasPage = () => {
  const [quadras, setQuadras] = useState<QuadraInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuadras = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<QuadraInfo[]>("/auth/soccer/findAll");
        setQuadras(response.data || []);
      } catch (err: any) {
        console.error("Erro ao buscar quadras:", err.response || err);
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data ||
          "Não foi possível carregar as quadras no momento.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuadras();
  }, []);

  const getImageUrl = (images: string[] | undefined) => {
    if (images && images.length > 1 && images[1]) {
      return images[1];
    } else if (images && images.length > 0 && images[0]) {
      return images[0];
    } else {
      return DEFAULT_IMAGE_URL;
    }
  };

  const handleReserveClick = (quadraId: string) => {
    navigate(`/reservar/${quadraId}`);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingMessage}>
          <FaSpinner className={styles.spinner} /> Carregando quadras...
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.errorMessage}>
          <FaExclamationCircle /> {error}
        </div>
      );
    }

    if (quadras.length === 0) {
      return (
        <div className={styles.centeredMessage}>
          <p>Nenhuma quadra encontrada.</p>
        </div>
      );
    }

    return (
      <div className={styles.quadrasGrid}>
        {quadras.map((quadra) => (
          <div key={quadra.id} className={styles.quadraCard}>
            <Link to={`/quadra/${quadra.id}`} className={styles.cardLink}>
              <img
                src={getImageUrl(quadra.images)}
                alt={`Imagem da quadra ${quadra.name}`}
                className={styles.cardImage}
                onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE_URL)}
              />
              <div className={styles.cardContent}>
                <h3>{quadra.name}</h3>
                <p className={styles.location}>
                  <FaMapMarkerAlt /> {quadra.city} - {quadra.state}
                </p>
                <p className={styles.price}>
                  <FaDollarSign />
                  {quadra.priceHour.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                  / hora
                </p>
              </div>
            </Link>
            <div className={styles.cardActions}>
              <Link
                to={`/quadra/${quadra.id}`}
                className={`${styles.actionButton} ${styles.detailsButton}`}
              >
                <FaEye /> Ver Detalhes
              </Link>
              <button
                className={styles.reserveButton}
                onClick={() => handleReserveClick(quadra.id)}
              >
                Reservar Agora
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>
        <h1>Encontre sua quadra</h1>
        {renderContent()}
      </div>
      <Footer />
    </>
  );
};
