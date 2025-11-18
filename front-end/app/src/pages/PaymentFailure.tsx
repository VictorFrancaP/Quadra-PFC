import { Link, useSearchParams } from "react-router-dom";
import styles from "../css/Payment.module.css";

export function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  return (
    <div className={`${styles.paymentContainer} ${styles.failure}`}>
      <div className={styles.paymentIcon}>❌</div>
      <h1 className={styles.paymentTitle}>Falha no Pagamento</h1>
      <p className={styles.paymentMessage}>
        Houve um problema ao processar seu pagamento. Nenhum valor foi cobrado.
        Recomendamos que você feche esta guia!
      </p>
      {reservationId && (
        <p className={styles.reservationId}>ID da Reserva: {reservationId}</p>
      )}
    </div>
  );
}
