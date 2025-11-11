import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaRegStar, FaTimes } from "react-icons/fa";
import styles from "../css/RatingModal.module.css";
import { api } from "../context/AuthContext";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  soccerId: string;
  onRated: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  soccerId,
  onRated,
}) => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await api.post(
        `/auth/rating/create/soccer/${soccerId}`,
        {
          rating,
          comments,
        }
      );
      onRated();
      onClose();
    } catch (err: any) {
      setError(err.response.data);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className={styles.modalHeader}>
              <h3>Avaliar Quadra</h3>
              <button onClick={onClose} className={styles.closeButton}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalForm}>
              <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    onClick={() => setRating(i + 1)}
                    style={{ cursor: "pointer", marginRight: 4 }}
                  >
                    {i < rating ? <FaStar /> : <FaRegStar />}
                  </span>
                ))}
              </div>

              <textarea
                className={styles.textarea}
                placeholder="Deixe um comentário"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  marginBottom: "1rem",
                  fontFamily: `"Montserrat", sans-serif`,
                }}
              />

              {error && <p className={styles.errorMessage}>{error}</p>}

              <div className={styles.modalActions}>
                <button
                  onClick={onClose}
                  className={styles.cancelButton}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className={styles.saveButton}
                  disabled={isSubmitting || rating === 0}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
