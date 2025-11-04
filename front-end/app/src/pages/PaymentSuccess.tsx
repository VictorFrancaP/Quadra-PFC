import { useSearchParams } from "react-router-dom";
import styles from "../css/Payment.module.css";

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  return (
    <div className={`${styles.paymentContainer} ${styles.success}`}>
      <div className={styles.paymentIcon}>✅</div>
      <h1 className={styles.paymentTitle}>Pagamento Aprovado!</h1>
      <p className={styles.paymentMessage}>
        Sua reserva foi confirmada com sucesso. Recomendamos que você feche esta
        guia!
      </p>
      {reservationId && (
        <p className={styles.reservationId}>ID da Reserva: {reservationId}</p>
      )}
    </div>
  );
}
