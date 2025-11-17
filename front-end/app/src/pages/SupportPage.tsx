import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { api } from "../context/AuthContext";
import styles from "../css/SupportPage.module.css";
import {
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

export const SupportPage = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!subject.trim() || !message.trim()) {
      setError("Por favor, preencha o assunto e a mensagem.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/support/create", {
        subject,
        message,
      });

      setSuccessMessage(
        response.data.message || "Chamado enviado com sucesso!"
      );
      setSubject("");
      setMessage("");
    } catch (err: any) {
      let errorMessage = "Ocorreu um erro ao enviar seu chamado.";

      if (err.response?.data) {
        if (
          typeof err.response.data === "object" &&
          err.response.data.message
        ) {
          errorMessage = err.response.data.message;

        } else if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        }
      }
      if (
        errorMessage.includes("suporte já encontrado") ||
        errorMessage.includes("SupportFoundError")
      ) {
        setError(
          "Você já possui um chamado em aberto. Por favor, aguarde a resposta da nossa equipe."
        );
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>
        <div className={styles.supportCard}>
          <h2>Central de Ajuda</h2>
          <p>
            Tem algum problema ou dúvida? Preencha o formulário abaixo e nossa
            equipe entrará em contato o mais breve possível.
          </p>

          <form onSubmit={handleSubmit} className={styles.supportForm}>
            {successMessage && (
              <div className={`${styles.message} ${styles.success}`}>
                <FaCheckCircle />
                <span>{successMessage}</span>
              </div>
            )}

            {error && (
              <div className={`${styles.message} ${styles.error}`}>
                <FaExclamationTriangle />
                <span>{error}</span>
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="subject">Assunto</label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Problema com reserva, Dúvida de pagamento"
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Mensagem</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                placeholder="Descreva seu problema ou dúvida em detalhes..."
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              style={{ fontFamily: `"Montserrat", sans-serif`}}
              disabled={isLoading}
            >
              {isLoading ? (
                <FaSpinner className={styles.spinner} />
              ) : (
                "Enviar"
              )}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};
