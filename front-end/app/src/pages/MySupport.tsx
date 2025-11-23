import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { api } from "../context/AuthContext";
import styles from "../css/MySupport.module.css";
import { FaSpinner, FaExclamationCircle, FaInbox } from "react-icons/fa";

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: string;
  created_at: Date;
  userEmail: string;
}

export const MySupportTicketPage = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyTickets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<SupportTicket[]>("/auth/support/find");
        
        const validTickets = response.data.filter(t => t && t.id);
        validTickets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        setTickets(validTickets);

        if (validTickets.length === 0) {
          setError("Você não possui nenhum chamado de suporte em aberto ou histórico.");
        }
      } catch (err: any) {
        console.error("Erro ao carregar chamados:", err);
        
        let errorMessage = 
          err.response?.data?.message ||
          err.response?.data ||
          "Erro ao carregar chamados.";
        if (
          typeof errorMessage === "string" &&
          (errorMessage.includes("nenhum chamado encontrado") || 
            err.response?.status === 404) 
        ) {
          setError("Você não possui nenhum chamado de suporte em aberto.");
          setTickets([]);
        } else {
          setError(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyTickets();
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status.toUpperCase()) {
      case "OPEN":
        return { text: "Em Aberto", className: styles.open };
      case "CLOSED":
        return { text: "Fechado", className: styles.resolved };
      case "IN_PROGRESS":
        return { text: "Em progresso", className: styles.notresolved };
      default:
        return { text: status, className: "" };
    }
  };

  const renderTicketCard = (ticket: SupportTicket) => {
    const statusInfo = getStatusInfo(ticket.status);
    return (
      <div key={ticket.id} className={styles.ticketCard}>
        <div className={styles.ticketHeader}>
          <span className={styles.ticketSubject}>{ticket.subject}</span>
          <span className={`${styles.ticketStatus} ${statusInfo.className}`}>
            {statusInfo.text}
          </span>
        </div>
        <div className={styles.ticketInfo}>
          <strong>De:</strong> {ticket.userEmail}
        </div>
        <div className={styles.ticketInfo}>
          <strong>Aberto em:</strong>{" "}
          {new Date(ticket.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>
        <p className={styles.ticketMessage}>{ticket.message}</p>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.centeredMessage}>
          <FaSpinner className={styles.spinner} />
          <span>Carregando seus chamados...</span>
        </div>
      );
    }
    if (error && tickets.length === 0) {
      return (
        <div className={styles.centeredMessage}>
          {error.includes("não possui") ? (
            <FaInbox size={40} />
          ) : (
            <FaExclamationCircle color="#a4262c" />
          )}
          <span>{error}</span>
        </div>
      );
    }

    if (tickets.length > 0) {
      return (
        <div className={styles.ticketsList}>
          {tickets.map(renderTicketCard)}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>
        <div className={styles.supportContainer}>
          <h2>Meus Chamados de Suporte</h2>
          {renderContent()}
        </div>
      </div>
      <Footer />
    </>
  );
};