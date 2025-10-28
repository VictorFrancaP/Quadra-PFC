import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../context/AuthContext";
import styles from "../css/EditOrder.module.css";
import { FaTimes } from "react-icons/fa";
import { IMaskInput } from "react-imask";

interface OrderData {
  id: string;
  localName: string;
  description: string;
  fone: string;
}

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOrder: OrderData;
  onSaveSuccess: () => void;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({
  isOpen,
  onClose,
  currentOrder,
  onSaveSuccess,
}) => {
  const [localName, setLocalName] = useState(currentOrder.localName);
  const [description, setDescription] = useState(currentOrder.description);
  const [fone, setFone] = useState(currentOrder.fone);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLocalName(currentOrder.localName);
    setDescription(currentOrder.description);
    setFone(currentOrder.fone);
  }, [currentOrder]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await api.put("/auth/order/update", {
        localName,
        description,
        fone,
      });

      onSaveSuccess();
    } catch (err: any) {
      console.error("Erro ao atualizar solicitação:", err.response);
      if (err.response?.data?.message?.includes("limited")) {
        setError("Você só pode atualizar sua solicitação a cada 5 minutos.");
      } else {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data ||
          "Erro ao salvar alterações.";
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
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
              <h3>Editar Solicitação</h3>
              <button onClick={onClose} className={styles.closeButton}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSave} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label htmlFor="editLocalName">Nome do Local</label>
                <input
                  id="editLocalName"
                  type="text"
                  value={localName}
                  onChange={(e) => setLocalName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="editDescription">Descrição</label>
                <textarea
                  id="editDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="editFone">Telefone</label>
                <IMaskInput
                  mask="(00) 00000-0000"
                  value={fone}
                  onAccept={(value) => setFone(value)}
                  className={styles.input}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>

              {error && <p className={styles.errorMessage}>{error}</p>}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={onClose}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={styles.saveButton}
                >
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
