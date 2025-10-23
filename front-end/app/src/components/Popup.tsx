import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import styles from "../css/Popup.module.css";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) => {
  const isConfirmation = !!onConfirm;
  const Icon = isConfirmation ? FaExclamationTriangle : FaCheckCircle;
  const iconStyle = isConfirmation ? styles.iconWarning : styles.iconSuccess;

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
            className={styles.popup}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <div className={styles.popupHeader}>
              <Icon className={`${styles.icon} ${iconStyle}`} />
              <h3>{title}</h3>
              <button className={styles.closeButton} onClick={onClose}>
                <FaTimes />
              </button>
            </div>
            <div className={styles.popupMessage}>
              <p>{message}</p>
            </div>
            <div className={styles.popupActions}>
              {isConfirmation ? (
                <>
                  <button
                    className={`${styles.popupButton} ${styles.cancelButton}`}
                    onClick={onClose}
                  >
                    {cancelText}
                  </button>
                  <button
                    className={`${styles.popupButton} ${styles.confirmButton}`}
                    onClick={onConfirm}
                  >
                    {confirmText}
                  </button>
                </>
              ) : (
                <button
                  className={`${styles.popupButton} ${styles.confirmButton}`}
                  onClick={onClose}
                >
                  Fechar
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
