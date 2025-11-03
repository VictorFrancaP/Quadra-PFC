import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Popup } from "../components/Popup";
import { RatingModal } from "../components/RatingModal";
import { api, useAuth } from "../context/AuthContext";
import styles from "../css/MinhaReserva.module.css";
import {
  FaSpinner,
  FaExclamationCircle,
  FaCalendarDay,
  FaClock,
  FaFutbol,
  FaMoneyBillWave,
  FaInfoCircle,
  FaExternalLinkAlt,
  FaTimesCircle,
  FaEye,
  FaStar,
  FaCheck,
} from "react-icons/fa";

interface ReservationDetails {
  id: string;
  startTime: string;
  endTime: string;
  statusPayment:
    | "PENDING_PAYMENT"
    | "CONFIRMED"
    | "CANCELLED"
    | "REFUNDED"
    | string;
  statusPayout: "PENDING" | "FAILED" | "CANCELLED" | string;
  expiredIn: string;
  totalPrice: number;
  duration: number;
  soccerId: string;
  userId: string;
  paymentTransactionId?: string | null;
  soccerName: string;
  hasBeenRated?: boolean;
}

export const MyReservationsPage = () => {
  const [reservations, setReservations] = useState<ReservationDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [isCancellingId, setIsCancellingId] = useState<string | null>(null);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const [reservationToCancel, setReservationToCancel] =
    useState<ReservationDetails | null>(null);

  const [popupInfo, setPopupInfo] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isError: boolean;
  }>({ isOpen: false, title: "", message: "", isError: false });

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [reservationToRate, setReservationToRate] =
    useState<ReservationDetails | null>(null);

  const fetchReservations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<ReservationDetails[]>(
        "/auth/reservation/findAll"
      );
      const sortedReservations = (response.data || []).sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
      setReservations(sortedReservations);
    } catch (err: any) {
      console.error("Erro ao buscar reservas:", err.response || err);
      if (
        err.response?.status === 404 ||
        (typeof err.response?.data === "string" &&
          err.response.data.includes("não encontrada"))
      ) {
        setReservations([]);
      } else {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data ||
          "Erro ao carregar suas reservas.";
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "OWNER") {
      setError("Proprietários não podem ter reservas.");
      setIsLoading(false);
      return;
    }
    fetchReservations();
  }, [user]);

  const formatDate = (dateInput: string | Date | undefined | null): string => {
    if (!dateInput) return "N/A";
    try {
      return new Date(dateInput).toLocaleDateString("pt-BR");
    } catch {
      return "Data inválida";
    }
  };
  const formatTime = (dateInput: string | Date | undefined | null): string => {
    if (!dateInput) return "N/A";
    try {
      return new Date(dateInput).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Hora inválida";
    }
  };
  const getStatusInfo = (
    paymentStatus: string,
    payoutStatus: string
  ): { text: string; className: string } => {
    if (paymentStatus === "CANCELLED" || payoutStatus === "CANCELLED")
      return { text: "Cancelada", className: styles.statusCancelled };
    if (paymentStatus === "REFUNDED")
      return { text: "Reembolsada", className: styles.statusRefunded };
    if (paymentStatus === "PENDING_PAYMENT")
      return { text: "Pag. Pendente", className: styles.statusPendingPayment };
    if (
      paymentStatus === "PAID" &&
      (payoutStatus === "PAID" || payoutStatus === "COMPLETED")
    )
      return { text: "Concluída", className: styles.statusCompleted };
    if (paymentStatus === "PAID")
      return { text: "Confirmada", className: styles.statusConfirmed };
    return {
      text: paymentStatus || payoutStatus || "Desconhecido",
      className: styles.statusOther,
    };
  };
  const getPaymentLink = (preferenceId: string): string => {
    return `https://www.mercadopago.com.br/checkout/v1/redirect?preference-id=${preferenceId}`;
  };

  const handleCancelClick = (reservation: ReservationDetails) => {
    setReservationToCancel(reservation);
    setIsConfirmCancelOpen(true);
    setError(null);
  };

  const handleConfirmCancel = async () => {
    if (!reservationToCancel) return;
    setIsConfirmCancelOpen(false);
    setIsCancellingId(reservationToCancel.id);
    setError(null);
    closeGeneralPopup();
    try {
      const response = await api.delete(
        `/auth/reservation/cancel/${reservationToCancel.id}`
      );
      setReservations((prev) =>
        prev.map((res) =>
          res.id === reservationToCancel.id
            ? {
                ...res,
                statusPayment: response.data.status || "CANCELLED",
                statusPayout: response.data.status || "CANCELLED",
              }
            : res
        )
      );
      showGeneralPopup(
        "Reserva Cancelada",
        response.data.message || "Sua reserva foi cancelada."
      );
    } catch (err: any) {
      console.error("Erro ao cancelar reserva:", err.response);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Não foi possível cancelar a reserva.";
      showGeneralPopup("Erro ao Cancelar", errorMessage, true);
      setError(errorMessage);
    } finally {
      setIsCancellingId(null);
      setReservationToCancel(null);
    }
  };

  const handleRatingClick = (reservation: ReservationDetails) => {
    setReservationToRate(reservation);
    setIsRatingModalOpen(true);
  };

  const handleRatingSuccess = (ratingData: any) => {
    setIsRatingModalOpen(false);
    setReservationToRate(null);
    showGeneralPopup("Avaliação Enviada", "Obrigado pelo seu feedback!");
    // Atualiza a lista localmente para desabilitar o botão
    setReservations((prev) =>
      prev.map((res) =>
        res.id === reservationToRate?.id ? { ...res, hasBeenRated: true } : res
      )
    );
    // Nota: Se o back-end não enviar 'hasBeenRated', você pode querer re-buscar:
    // fetchReservations();
  };

  const showGeneralPopup = (
    title: string,
    message: string,
    isError: boolean = false
  ) => {
    setPopupInfo({ isOpen: true, title, message, isError });
  };
  const closeGeneralPopup = () => {
    setPopupInfo({ ...popupInfo, isOpen: false });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingMessage}>
          <FaSpinner className={styles.spinner} /> Carregando...
        </div>
      );
    }

    if (error && reservations.length === 0) {
      return (
        <div className={styles.errorMessage}>
          <FaExclamationCircle /> {error}
        </div>
      );
    }

    if (reservations.length === 0 && !isLoading) {
      return (
        <div className={styles.centeredMessage}>
          <p>Você ainda não possui reservas.</p>
        </div>
      );
    }

    return (
      <div className={styles.reservationsList}>
        {error && !isLoading && (
          <p className={styles.errorMessage}>
            <FaExclamationCircle /> {error}
          </p>
        )}

        {reservations.map((res) => {
          const statusInfo = getStatusInfo(res.statusPayment, res.statusPayout);
          const isPaymentPending =
            res.statusPayment === "PENDING_PAYMENT" &&
            res.expiredIn &&
            new Date(res.expiredIn) > new Date();
          const canCancel =
            res.statusPayment !== "CANCELLED" &&
            res.statusPayment !== "REFUNDED";

          const isCompleted =
            statusInfo.className === styles.statusConfirmed ||
            statusInfo.className === styles.statusCompleted;
          const hasPassed = new Date(res.startTime) <= new Date();
          const canRate = isCompleted && hasPassed && !res.hasBeenRated;

          return (
            <div key={res.id} className={styles.reservationCard}>
              <div className={styles.cardHeader}>
                <h4>
                  <FaFutbol />
                  {res.soccerName ??
                    `Quadra ID: ${res.soccerId.substring(0, 8)}...`}
                </h4>
                <span
                  className={`${styles.statusBadge} ${statusInfo.className}`}
                >
                  {statusInfo.text}
                </span>
              </div>
              <div className={styles.cardBody}>
                <p>
                  <FaCalendarDay /> Data:
                  <strong> {formatDate(res.startTime)}</strong>
                </p>
                <p>
                  <FaClock /> Horário:
                  <strong>
                    {formatTime(res.startTime)} às {formatTime(res.endTime)}
                  </strong>
                  ({res.duration}h)
                </p>
                <p>
                  <FaMoneyBillWave /> Valor:
                  <strong>
                    {res.totalPrice.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </p>

                {isPaymentPending && res.paymentTransactionId && (
                  <a
                    href={getPaymentLink(res.paymentTransactionId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.payLink}
                  >
                    Pagar Agora <FaExternalLinkAlt /> (Expira às {""}
                    {formatTime(res.expiredIn)})
                  </a>
                )}
                {res.statusPayment === "PENDING_PAYMENT" &&
                  !isPaymentPending && (
                    <p className={styles.expiredMessage}>
                      <FaInfoCircle /> Prazo de pagamento expirado.
                    </p>
                  )}
              </div>
              <div
                style={{
                  marginBottom: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "center",
                }}
                className={styles.cardActions}
              >
                <Link
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                  to={`/quadra/${res.soccerId}`}
                  className={`${styles.actionButton} ${styles.detailsButton}`}
                >
                  <FaEye /> Ver Detalhes
                </Link>

                {canCancel && (
                  <button
                    style={{ margin: "0" }}
                    className={`${styles.actionButton} ${styles.cancelButton}`}
                    onClick={() => handleCancelClick(res)}
                    disabled={isCancellingId === res.id}
                  >
                    {isCancellingId === res.id ? (
                      <FaSpinner className={styles.spinner} />
                    ) : (
                      <FaTimesCircle />
                    )}
                    Cancelar
                  </button>
                )}

                {canRate && (
                  <button
                    className={`${styles.actionButton} ${styles.rateButton}`}
                    onClick={() => handleRatingClick(res)}
                  >
                    <FaStar /> Avaliar
                  </button>
                )}
                {res.hasBeenRated && (
                  <button
                    className={`${styles.actionButton} ${styles.rateButton}`}
                    disabled
                  >
                    <FaCheck /> Avaliada
                  </button>
                )}
              </div>
            </div>
          );
        })}
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
        onClose={closeGeneralPopup}
        title={popupInfo.title}
        message={popupInfo.message}
      />
      <Popup
        isOpen={isConfirmCancelOpen}
        onClose={() => setIsConfirmCancelOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Confirmar Cancelamento"
        message={`Tem certeza que deseja cancelar esta reserva? ${
          reservationToCancel?.statusPayment === "PAID"
            ? "Como o pagamento já foi efetuado, verifique a política de reembolso (24h+ antecedência)."
            : ""
        }`}
        confirmText="Cancelar"
        cancelText="Não"
      />
      {isRatingModalOpen && reservationToRate && (
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          mode="soccer"
          targetId={reservationToRate.soccerId}
          targetName={reservationToRate.soccerName}
          onRatingSuccess={handleRatingSuccess}
        />
      )}
    </>
  );
};
