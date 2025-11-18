import { Link, useSearchParams } from "react-router-dom";
import styles from "../css/Payment.module.css";

export function PaymentPending() {
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  return (
    <div className={`${styles.paymentContainer} ${styles.pending}`}>
      <div className={styles.paymentIcon}>🕒</div>
      <h1 className={styles.paymentTitle}>Pagamento Pendente</h1>
      <p className={styles.paymentMessage}>
        Sua reserva foi registrada e está aguardando a confirmação do pagamento
        (como a compensação de um boleto ou Pix). Avisaremos assim que for
        aprovado. Houve um problema ao processar seu pagamento. Nenhum valor foi
        cobrado. Recomendamos que você feche esta guia!
      </p>
      {reservationId && (
        <p className={styles.reservationId}>ID da Reserva: {reservationId}</p>
      )}
      <Link to="/minhas-reservas" className={styles.paymentCta}>
        Ver Minhas Reservas
      </Link>
    </div>
  );
}
