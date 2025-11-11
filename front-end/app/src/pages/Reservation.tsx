import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Popup } from "../components/Popup";
import { api } from "../context/AuthContext";
import styles from "../css/Reservation.module.css";
import {
  FaCalendarAlt,
  FaClock,
  FaHourglassHalf,
  FaDollarSign,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";

interface SoccerDetails {
  id: string;
  name: string;
  priceHour: number;
  maxDuration: number;
  openHour: string;
  closingHour: string;
  images?: string[];
}

interface ReservationResponse {
  message: string;
  reservationId: string;
  paymentLink: string;
  expiredIn: string;
}

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/dxnsn1joz/image/upload/v1762130308/imagem-quadra-padrao_ly9lpz.jpg";

export const ReservationPage = () => {
  const { soccerId } = useParams<{ soccerId: string }>();
  const navigate = useNavigate();
  const [soccerInfo, setSoccerInfo] = useState<SoccerDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] =
    useState<ReservationResponse | null>(null);
  const [popupInfo, setPopupInfo] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isError: boolean;
  }>({ isOpen: false, title: "", message: "", isError: false });

  useEffect(() => {
    if (!soccerId) {
      setDetailsError("ID da quadra não encontrado na URL.");
      setIsLoadingDetails(false);
      return;
    }
    const fetchSoccerDetails = async () => {
      setIsLoadingDetails(true);
      setDetailsError(null);
      try {
        const response = await api.get<SoccerDetails>(
          `/auth/soccer/${soccerId}`
        );
        setSoccerInfo(response.data);
        const today = new Date().toISOString().split("T")[0];
        setSelectedDate(today);
      } catch (err: any) {
        console.error(
          "Erro ao buscar detalhes da quadra:",
          err.response || err
        );
        setDetailsError("Não foi possível carregar os detalhes da quadra.");
      } finally {
        setIsLoadingDetails(false);
      }
    };
    fetchSoccerDetails();
  }, [soccerId]);

  useEffect(() => {
    if (soccerInfo && selectedDate && selectedTime && selectedDuration > 0) {
      try {
        const startDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
        if (isNaN(startDateTime.getTime()))
          throw new Error("Data/Hora inválida");

        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(startDateTime.getHours() + selectedDuration);

        const endHours = endDateTime.getHours().toString().padStart(2, "0");
        const endMinutes = endDateTime.getMinutes().toString().padStart(2, "0");
        setEndTime(`${endHours}:${endMinutes}`);

        setTotalPrice(soccerInfo.priceHour * selectedDuration);
        setBookingError(null);
      } catch (e) {
        console.error("Erro ao calcular data/hora:", e);
        setEndTime(null);
        setTotalPrice(null);
        setBookingError("Data ou hora de início inválida.");
      }
    } else {
      setEndTime(null);
      setTotalPrice(null);
    }
  }, [selectedDate, selectedTime, selectedDuration, soccerInfo]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !selectedDuration || !soccerInfo) {
      setBookingError("Por favor, preencha a data, hora de início e duração.");
      return;
    }

    setIsBooking(true);
    setBookingError(null);
    closePopup();

    try {
      const startTimeISO = new Date(
        `${selectedDate}T${selectedTime}:00`
      ).toISOString();

      const response = await api.post<ReservationResponse>(
        `/auth/reservation/create/${soccerId}`,
        {
          startTime: startTimeISO,
          duration: selectedDuration,
        }
      );

      setBookingSuccess(response.data);
    } catch (err: any) {
      console.error("Erro ao criar reserva:", err.response || err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Não foi possível criar a reserva.";
      setBookingError(errorMessage);
      showPopup("Erro na Reserva", errorMessage, true);
    } finally {
      setIsBooking(false);
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

  const getImageUrl = (images: string[] | undefined) => {
    if (images && images.length > 1 && images[1]) {
      return images[1];
    } else if (images && images.length > 0 && images[0]) {
      return images[0];
    } else {
      return DEFAULT_IMAGE_URL;
    }
  };

  const durationOptions = [];
  if (soccerInfo?.maxDuration) {
    for (let i = 1; i <= soccerInfo.maxDuration; i++) {
      durationOptions.push(
        <option key={i} value={i}>
          {i} hora{i > 1 ? "s" : ""}
        </option>
      );
    }
  }

  const timeOptions = [];
  if (soccerInfo?.openHour && soccerInfo?.closingHour) {
    try {
      const openH = parseInt(soccerInfo.openHour.split(":")[0], 10);
      const closeH = parseInt(soccerInfo.closingHour.split(":")[0], 10);
      for (let h = openH; h < closeH; h++) {
        const timeStr = `${h.toString().padStart(2, "0")}:00`;
        timeOptions.push(
          <option key={timeStr} value={timeStr}>
            {timeStr}
          </option>
        );
      }
    } catch (e) {
      console.error("Erro ao gerar horários");
    }
  }

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>
        {isLoadingDetails && (
          <div className={styles.loadingMessage}>
            <FaSpinner className={styles.spinner} /> Carregando detalhes...
          </div>
        )}
        {detailsError && (
          <div className={styles.errorMessage}>
            <FaExclamationCircle /> {detailsError}
          </div>
        )}
        {soccerInfo && !isLoadingDetails && (
          <>
            <h1>Reservar Quadra: {soccerInfo.name}</h1>
            <div className={styles.reservationLayout}>
              <div className={styles.formSection}>
                <img
                  src={getImageUrl(soccerInfo.images)}
                  alt={`Imagem de ${soccerInfo.name}`}
                  className={styles.soccerImage}
                  onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE_URL)}
                />
                <p className={styles.priceInfo}>
                  <FaDollarSign />{" "}
                  {soccerInfo.priceHour.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}{" "}
                  / hora
                </p>
                {!bookingSuccess && (
                  <form
                    onSubmit={handleBookingSubmit}
                    className={styles.bookingForm}
                  >
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="reserva-data">
                          <FaCalendarAlt /> Data
                        </label>
                        <input
                        style={{ fontFamily: `"Segoi-UI", sans-serif`}}
                          type="date"
                          id="reserva-data"
                          value={selectedDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="reserva-hora">
                          <FaClock /> Hora Início
                        </label>
                        <select
                          id="reserva-hora"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          required
                        >
                          <option value="" disabled>
                            Selecione
                          </option>
                          {timeOptions}
                        </select>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="reserva-duracao">
                        <FaHourglassHalf /> Duração
                      </label>
                      <select
                        id="reserva-duracao"
                        value={selectedDuration}
                        onChange={(e) =>
                          setSelectedDuration(Number(e.target.value))
                        }
                        required
                      >
                        {durationOptions.length > 0 ? (
                          durationOptions
                        ) : (
                          <option value="" disabled>
                            Carregando...
                          </option>
                        )}
                      </select>
                      <small>Máximo: {soccerInfo.maxDuration} hora(s)</small>
                    </div>
                    {endTime && totalPrice !== null && (
                      <div className={styles.calculatedInfo}>
                        <p>
                          Horário de Término: <strong>{endTime}</strong>
                        </p>
                        <p>
                          Preço Total:{" "}
                          <strong>
                            {totalPrice.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </strong>
                        </p>
                      </div>
                    )}
                    {bookingError && (
                      <p className={styles.formErrorMessage}>
                        <FaExclamationCircle /> {bookingError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={
                        isBooking ||
                        !selectedDate ||
                        !selectedTime ||
                        !selectedDuration
                      }
                      className={styles.submitButton}
                    >
                      {isBooking ? (
                        <>
                          <FaSpinner className={styles.spinner} /> Processando
                          Reserva...
                        </>
                      ) : (
                        "Ir para Pagamento"
                      )}
                    </button>
                    <p className={styles.paymentNotice}>
                      Você terá 15 minutos para concluir o pagamento.
                    </p>
                  </form>
                )}
              </div>
              {bookingSuccess && (
                <div className={styles.paymentSection}>
                  <h2>Reserva Iniciada!</h2>
                  <p className={styles.successMessage}>
                    {bookingSuccess.message}
                  </p>
                  <p>
                    Clique no link abaixo para ser redirecionado ao Mercado Pago
                    e concluir o pagamento.
                  </p>

                  <a
                    href={bookingSuccess.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.paymentLinkButton}
                  >
                    Pagar com Mercado Pago
                  </a>

                  {/* Opcional: Exibir QR Code */}
                  {/* <div className={styles.qrCodeContainer}>
                       <QRCodeSVG value={bookingSuccess.paymentLink} size={200} />
                       <p>Ou escaneie o QR Code</p>
                   </div> */}

                  <p className={styles.expiryInfo}>
                    Importante: O pagamento deve ser concluído antes de{" "}
                    <strong>
                      {new Date(bookingSuccess.expiredIn).toLocaleTimeString(
                        "pt-BR",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </strong>{" "}
                    do dia{" "}
                    <strong>
                      {new Date(bookingSuccess.expiredIn).toLocaleDateString(
                        "pt-BR"
                      )}
                    </strong>
                    , caso contrário sua reserva será cancelada.
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className={styles.backButton}
                  >
                    Voltar para Home
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
      <Popup
        isOpen={popupInfo.isOpen}
        onClose={closePopup}
        title={popupInfo.title}
        message={popupInfo.message}
      />
    </>
  );
};
