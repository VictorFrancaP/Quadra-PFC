import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { MapComponent } from "../components/MapComponent";
import { api, useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/Nearby.module.css";
import {
  FaSpinner,
  FaExclamationCircle,
  FaMapMarkerAlt,
  FaDollarSign,
  FaDirections,
  FaEye,
} from "react-icons/fa";

interface NearbyQuadraInfo {
  id: string;
  name: string;
  description?: string;
  city: string;
  state: string;
  images: string[];
  priceHour: number;
  latitude?: number | null;
  longitude?: number | null;
  distancia?: number | null;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762130308/imagem-quadra-padrao_ly9lpz.jpg";
const DEFAULT_MAX_DISTANCE_KM = 10;
const DEBOUNCE_DELAY = 350;

export const NearbyQuadrasPage = () => {
  const [nearbyQuadras, setNearbyQuadras] = useState<NearbyQuadraInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState(DEFAULT_MAX_DISTANCE_KM);
  const [debouncedDistance, setDebouncedDistance] = useState(
    DEFAULT_MAX_DISTANCE_KM
  );
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNearbyQuadras = async (distanciaKm: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.post<NearbyQuadraInfo[]>(
          "/auth/soccer/nearby",
          { distanciaMaximaKm: distanciaKm }
        );
        setNearbyQuadras(response.data || []);
      } catch (err: any) {
        console.error("Erro ao buscar quadras próximas:", err.response || err);

        let errorMessage = "Não foi possível buscar quadras próximas.";
        const status = err.response?.status;
        const responseData = err.response?.data;

        if (typeof responseData === "string") {
          if (
            status === 404 ||
            responseData.includes("Nenhuma quadra encontrada")
          ) {
            setError(null);
          } else if (responseData.includes("latitude e longitude")) {
            errorMessage =
              "Erro: Suas informações de localização (CEP) não estão completas no perfil.";
            setError(errorMessage);
          } else {
            errorMessage = responseData;
            setError(errorMessage);
          }
        } else if (
          responseData?.message &&
          typeof responseData.message === "string"
        ) {
          errorMessage = responseData.message;
          if (errorMessage.includes("latitude e longitude")) {
            errorMessage =
              "Erro: Suas informações de localização (CEP) não estão completas no perfil.";
          }
          setError(errorMessage);
        } else if (status !== 404) {
          setError(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearbyQuadras(debouncedDistance);
  }, [debouncedDistance]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedDistance(sliderValue);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timerId);
    };
  }, [sliderValue]);

  const getImageUrl = (images: string[] | undefined): string => {
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

  const userLocation: UserLocation | null =
    user?.latitude && user?.longitude
      ? { latitude: user.latitude, longitude: user.longitude }
      : null;
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingMessage}>
          <FaSpinner className={styles.spinner} /> Buscando quadras próximas...
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

    if (nearbyQuadras.length === 0) {
      return (
        <div className={styles.centeredMessage}>
          <p>Nenhuma quadra encontrada a até {debouncedDistance} km.</p>
        </div>
      );
    }

    return (
      <div className={styles.quadrasGrid}>
        {nearbyQuadras.map((quadra) => (
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
                <p className={styles.distanceInfo}>
                  <FaDirections />
                  {typeof quadra.distancia === "number"
                    ? `${quadra.distancia.toFixed(1)} km de distância`
                    : "Distância indisponível"}
                </p>
                <p className={styles.location}>
                  <FaMapMarkerAlt /> {quadra.city} - {quadra.state}
                </p>
                <p className={styles.price}>
                  <FaDollarSign />{" "}
                  {quadra.priceHour?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}{" "}
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
                className={`${styles.actionButton} ${styles.reserveButton}`}
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
        <h1>Quadras Próximas</h1>

        <div className={styles.mapContainer}>
          <MapComponent quadras={nearbyQuadras} userLocation={userLocation} />
        </div>

        <div style={{ textAlign: "center" }} className={styles.distanceControl}>
          <label htmlFor="distanceSlider">
            Exibindo quadras a até <strong>{sliderValue} km</strong>
          </label>
          <input
            type="range"
            id="distanceSlider"
            min="1"
            max="50"
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className={styles.slider}
          />
        </div>
        {renderContent()}
      </div>
      <Footer />
    </>
  );
};
