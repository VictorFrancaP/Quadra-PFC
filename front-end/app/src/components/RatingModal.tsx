import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../context/AuthContext";
import styles from "../css/RatingModal.module.css"; // Crie este CSS (fornecerei abaixo)
import { FaTimes, FaSpinner, FaStar } from "react-icons/fa";

// Interface para o componente de estrelas
interface StarRatingProps {
  rating: number;
  onRatingChange: (rate: number) => void;
  disabled?: boolean;
}

// Componente de Estrelas (interno)
const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  disabled = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  return (
    <div
      className={`${styles.starContainer} ${disabled ? styles.disabled : ""}`}
    >
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const isFilled = starIndex <= (hoverRating || rating);
        return (
          <FaStar
            key={starIndex}
            className={isFilled ? styles.starFilled : styles.starEmpty}
            onClick={() => !disabled && onRatingChange(starIndex)}
            onMouseEnter={() => !disabled && setHoverRating(starIndex)}
            onMouseLeave={() => !disabled && setHoverRating(0)}
          />
        );
      })}
    </div>
  );
};

// --- Props do Modal ---
interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  // 'targetId' será o soccerId ou o ratedUserId
  targetId: string;
  // 'mode' define qual API chamar
  mode: "soccer" | "user";
  targetName?: string; // Nome da quadra ou do usuário
  onRatingSuccess: (ratingData: any) => void;
}

// --- Componente Modal ---
export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  targetId,
  mode,
  targetName,
  onRatingSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reseta o estado quando o modal fecha
  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setComments("");
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (rating === 0) {
      setError("Por favor, selecione de 1 a 5 estrelas.");
      return;
    }
    if (!comments.trim() && mode === "soccer") {
      setError("Por favor, deixe um comentário.");
      return;
    }

    setIsLoading(true);

    try {
      // Determina a URL da API e o payload com base no 'mode'
      let apiUrl = "";
      let payload: any = { rating, comments };

      if (mode === "soccer") {
        apiUrl = `/auth/rating/create/soccer/${targetId}`;
        // payload (já está correto, só rating e comments)
      } else {
        // mode === 'user'
        apiUrl = `/auth/rating/create/user/${targetId}`;
        // (O backend para avaliar usuário também espera 'comments'?)
        // Se não, ajuste o payload:
        // payload = { rating, comments: comments || undefined };
      }

      const response = await api.post(apiUrl, payload);

      onRatingSuccess(response.data); // Chama o callback da página pai
      onClose(); // Fecha o modal
    } catch (err: any) {
      console.error("Erro ao enviar avaliação:", err.response);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Não foi possível enviar sua avaliação.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const title =
    mode === "soccer"
      ? `Avaliar Quadra ${targetName ? `: ${targetName}` : ""}`
      : `Avaliar Usuário ${targetName ? `: ${targetName}` : ""}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <div className={styles.modalHeader}>
              <h3>{title}</h3>
              <button onClick={onClose} className={styles.closeButton}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Sua Avaliação (1-5 estrelas)</label>
                <StarRating rating={rating} onRatingChange={setRating} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="comments">Comentário</label>
                <textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={
                    mode === "soccer"
                      ? "Conte como foi sua experiência na quadra..."
                      : "Deixe um feedback sobre o usuário..."
                  }
                  rows={4}
                  required={mode === "soccer"} // Comentário obrigatório só para quadra (exemplo)
                />
              </div>
              {error && <p className={styles.errorMessage}>{error}</p>}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={onClose}
                  className={styles.cancelButton}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={styles.saveButton}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className={styles.spinner} /> Enviando...
                    </>
                  ) : (
                    "Enviar Avaliação"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
