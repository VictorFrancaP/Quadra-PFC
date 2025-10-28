import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { api } from "../context/AuthContext";
import { EditOrderModal } from "../components/EditOrder";
import styles from "../css/ViewOrder.module.css";
import { FaEdit, FaSpinner, FaExclamationCircle } from "react-icons/fa";

interface OrderData {
  id: string;
  localName: string;
  description: string;
  cnpj: string;
  fone: string;
  status: "PENDING" | "APPROVED" | "DENIED";
  userId: string;
}

export const ViewOrderPage = () => {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrder = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/auth/order/find");

      setOrder(response.data.order || response.data);
    } catch (err: any) {
      if (
        err.response?.status === 404 ||
        err.response?.data?.message?.toLowerCase().includes("não encontrada")
      ) {
        setError("Você ainda não possui uma solicitação pendente.");
        setOrder(null);
      } else {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data ||
          "Erro ao buscar solicitação.";
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const handleUpdateSuccess = () => {
    setIsModalOpen(false);
    fetchOrder();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loading}>
          <FaSpinner className={styles.spinner} /> Carregando...
        </div>
      );
    }
    if (error && !order) {
      return (
        <div className={styles.error}>
          <FaExclamationCircle /> {error}
        </div>
      );
    }
    if (error && order) {
      console.error("Erro ao re-buscar:", error);
    }
    if (!order) {
      return (
        <div className={styles.error}>Nenhuma solicitação encontrada.</div>
      );
    }

    return (
      <div className={styles.orderCard}>
        <h2>DETALHES DA SUA SOLICITAÇÃO</h2>

        <div className={styles.detailItem}>
          <strong>Status:</strong>
          <span
            className={`${styles.status} ${styles[`status${order.status}`]}`}
          >
            {order.status === "PENDING"
              ? "Pendente"
              : order.status === "APPROVED"
              ? "Aprovada"
              : "Rejeitada"}
          </span>
        </div>
        <div className={styles.detailItem}>
          <strong>Nome do Local:</strong> <span>{order.localName}</span>
        </div>
        <div className={styles.detailItem}>
          <strong>Descrição:</strong> <span>{order.description}</span>
        </div>
        <div className={styles.detailItem}>
          <strong>CNPJ:</strong>
          <span>{order.cnpj}</span>
        </div>
        <div className={styles.detailItem}>
          <strong>Telefone:</strong>
          <span>{order.fone}</span>
        </div>
        {order.status === "PENDING" && (
          <button
            className={styles.editButton}
            onClick={() => setIsModalOpen(true)}
          >
            <FaEdit /> Editar Informações
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>{renderContent()}</div>
      <Footer />
      {isModalOpen && order && (
        <EditOrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentOrder={order}
          onSaveSuccess={handleUpdateSuccess}
        />
      )}
    </>
  );
};
