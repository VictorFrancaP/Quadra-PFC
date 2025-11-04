import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../context/AuthContext";
import styles from "../css/ChangePicture.module.css";
import { FaTimes, FaSpinner, FaCheck } from "react-icons/fa";

interface ChangePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: (newImageUrl: string) => void;
  currentImageUrl: string | undefined | null;
}

export const ChangePictureModal: React.FC<ChangePictureModalProps> = ({
  isOpen,
  onClose,
  onSaveSuccess,
  currentImageUrl,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    currentImageUrl || null
  );

  useEffect(() => {
    if (isOpen) {
      const fetchImages = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await api.get<string[]>("/auth/user/images");
          setImages(response.data);
        } catch (err: any) {
          console.error("Erro ao buscar imagens de perfil:", err.response);
          setError("Não foi possível carregar as imagens.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchImages();
    } else {
      setSelectedImage(currentImageUrl || null);
    }
  }, [isOpen, currentImageUrl]);

  const handleSave = async () => {
    if (!selectedImage) {
      setError("Por favor, selecione uma imagem.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await api.put("/auth/user/update", {
        profileImage: selectedImage,
      });

      onSaveSuccess(selectedImage);
      onClose();
    } catch (err: any) {
      console.error("Erro ao salvar imagem:", err.response);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Erro ao salvar seleção.";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
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
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className={styles.modalHeader}>
              <h3>Alterar Imagem de Perfil</h3>
              <button onClick={onClose} className={styles.closeButton}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              {isLoading ? (
                <div className={styles.feedbackMessage}>
                  <FaSpinner className={styles.spinner} /> Carregando...
                </div>
              ) : error ? (
                <div className={styles.errorMessage}>{error}</div>
              ) : (
                <div className={styles.imageGrid}>
                  {images.map((url) => (
                    <div
                      key={url}
                      className={`${styles.imageOption} ${
                        selectedImage === url ? styles.selected : ""
                      }`}
                      onClick={() => !isSaving && setSelectedImage(url)}
                    >
                      <img src={url} alt="Imagem de perfil" />
                      {selectedImage === url && (
                        <div className={styles.checkIcon}>
                          <FaCheck />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.modalActions}>
              <button
                onClick={onClose}
                className={styles.cancelButton}
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className={styles.saveButton}
                disabled={!selectedImage || isSaving}
              >
                {isSaving ? (
                  <>
                    <FaSpinner className={styles.spinner} /> Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
