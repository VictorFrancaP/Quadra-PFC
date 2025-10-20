import { motion } from "framer-motion";
import styles from "../css/Popup.module.css";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <motion.div
        className={styles.popup}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClose}>Fechar</button>
      </motion.div>
    </div>
  );
};
