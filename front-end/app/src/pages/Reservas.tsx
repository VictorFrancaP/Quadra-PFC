import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { api } from "../context/AuthContext";
import styles from "../css/ReservationsPage.module.css";
import {
  FaSpinner,
  FaExclamationCircle,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaClipboardList,
} from "react-icons/fa";

interface OwnerReservation {
  id: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  duration: number;
  statusPayment: string;
  statusPayout: string;
  user: { id: string; name: string; email: string };
  soccerId: string;
}

export const SoccerOwnerReservationsPage = () => {
  const [reservations, setReservations] = useState<OwnerReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<OwnerReservation[]>(
          "/auth/reservation/find"
        );
        const sortedReservations = (response.data || []).sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        setReservations(sortedReservations);
      } catch (err: any) {
        console.error(
          "Erro ao buscar reservas da quadra:",
          err.response || err
        );
        const errorMessage =
          err.response?.data?.message || "Erro ao carregar reservas.";
        if (
          errorMessage.includes("quadra não encontrada") ||
          errorMessage.includes("reservas não encontradas")
        ) {
          setError(
            "Sua quadra ainda não possui reservas ou não foi encontrada no sistema."
          );
        } else {
          setError(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleDateString("pt-BR");
  const formatTime = (isoString: string) =>
    new Date(isoString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  const getStatusInfo = (
    paymentStatus: string,
    payoutStatus: string
  ): { text: string; className: string } => {
    if (paymentStatus === "CANCELLED")
      return { text: "CANCELADA", className: styles.statusCancelled };
    if (paymentStatus === "PENDING_PAYMENT")
      return {
        text: "AGUARDANDO PAGAMENTO",
        className: styles.statusPendingPayment,
      };
    if (paymentStatus === "CONFIRMED")
      return { text: "PAGA E CONFIRMADA", className: styles.statusConfirmed };
    return { text: "STATUS DESCONHECIDO", className: styles.statusOther };
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingMessage}>
          <FaSpinner className={styles.spinner} /> Carregando reservas...
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
    if (reservations.length === 0) {
      return (
        <div className={styles.centeredMessage}>
          <p>Sua quadra ainda não possui reservas.</p>
        </div>
      );
    }

    return (
      <div className={styles.reservationsList}>
        {reservations.map((res) => {
          const statusInfo = getStatusInfo(res.statusPayment, res.statusPayout);
          const isPending = res.statusPayment === "PENDING_PAYMENT";
          return (
            <div key={res.id} className={styles.reservationItem}>
              <div className={styles.reservationDetails}>
                <p>
                  <FaUser /> Cliente:
                  <strong>{res.user?.name || "Cliente Não Encontrado"}</strong>
                </p>
                <p>
                  <FaCalendarAlt /> Data:
                  <strong>{formatDate(res.startTime)}</strong>
                </p>
                <p>
                  <FaClock /> Horário:
                  <strong>
                    {formatTime(res.startTime)} ({res.duration}h)
                  </strong>
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

                <p className={styles.fullWidth}>
                  E-mail: <strong>{res.user?.email || "N/A"}</strong>
                </p>
              </div>

              <div className={styles.reservationStatus}>
                <span
                  className={`${styles.statusBadge} ${statusInfo.className}`}
                >
                  {statusInfo.text}
                </span>
                {isPending && (
                  <button className={styles.confirmButton}>
                    Confirmar Pagamento
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
      <div className={styles.pageContainer}>
        <h1>
          <FaClipboardList /> Reservas Recebidas
        </h1>
        {renderContent()}
      </div>
      <Footer />
    </>
  );
};
