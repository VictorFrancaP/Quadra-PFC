import React from 'react';
import styles from '../css/PolicyModal.module.css';

interface PolicyModalProps {
  title: string;
  content: React.ReactNode;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ title, content, onClose }) => {
  
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={handleContentClick}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          {content}
        </div>
      </div>
    </div>
  );
};