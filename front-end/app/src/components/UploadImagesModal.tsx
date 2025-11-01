import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../context/AuthContext";
import styles from "../css/UploadImagesModal.module.css";
import { FaTimes, FaSpinner, FaUpload, FaTrash } from "react-icons/fa";
import { Popup } from "./Popup";

interface UploadImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  soccerId: string;
  currentImageCount: number;
  maxTotalImages?: number;
  maxFilesPerUpload?: number;
  onUploadSuccess: (newImageUrls: string[]) => void;
}

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_FILE_SIZE = 8 * 1024 * 1024;

export const UploadImagesModal: React.FC<UploadImagesModalProps> = ({
  isOpen,
  onClose,
  soccerId,
  currentImageCount,
  maxTotalImages = 10,
  maxFilesPerUpload = 5,
  onUploadSuccess,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [popupInfo, setPopupInfo] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isError: boolean;
  }>({ isOpen: false, title: "", message: "", isError: false });

  useEffect(() => {
    if (!isOpen) {
      setSelectedFiles([]);
      setFileError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (filesArray.length > maxFilesPerUpload) {
        setFileError(
          `Você só pode enviar ${maxFilesPerUpload} imagens por vez.`
        );
        return;
      }

      if (
        currentImageCount + selectedFiles.length + filesArray.length >
        maxTotalImages
      ) {
        setFileError(
          `Limite total de ${maxTotalImages} imagens por quadra excedido.`
        );
        return;
      }

      let invalidFiles = false;
      for (const file of filesArray) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          invalidFiles = true;
          setFileError(
            `Tipo de arquivo inválido: ${file.name}. Use PNG, JPG ou WEBP.`
          );
          break;
        }
        if (file.size > MAX_FILE_SIZE) {
          invalidFiles = true;
          setFileError(`Arquivo muito grande: ${file.name}. Limite de 8MB.`);
          break;
        }
      }

      if (invalidFiles) return;

      setSelectedFiles((prev) => [...prev, ...filesArray]);
      e.target.value = "";
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setFileError("Selecione pelo menos uma imagem para enviar.");
      return;
    }

    setIsLoading(true);
    setFileError(null);
    closePopup();

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await api.post(
        `/auth/soccer/images/${soccerId}`,
        formData,
        {}
      );
      onUploadSuccess(response.data.images);
    } catch (err: any) {
      console.error("Erro no upload das imagens:", err.response);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Erro ao enviar imagens.";
      showPopup("Erro no Upload", errorMessage, true);
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => setPopupInfo({ ...popupInfo, isOpen: false });
  const showPopup = (
    title: string,
    message: string,
    isError: boolean = false
  ) => {
    setPopupInfo({ isOpen: true, title, message, isError });
  };

  return (
    <>
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
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <div className={styles.modalHeader}>
                <h3>Adicionar Imagens da Quadra</h3>
                <button onClick={onClose} className={styles.closeButton}>
                  <FaTimes />
                </button>
              </div>

              <div className={styles.modalBody}>
                <label htmlFor="file-upload" className={styles.fileUploadLabel}>
                  <FaUpload /> Selecionar Imagens
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                  disabled={isLoading}
                />
                <p className={styles.fileInfo}>
                  Imagens atuais: {currentImageCount}. Pode adicionar mais
                  {maxTotalImages - (currentImageCount + selectedFiles.length)}.
                  (Máx: 5 por vez)
                </p>

                <div className={styles.previewContainer}>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className={styles.previewItem}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${file.name}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        title="Remover"
                        disabled={isLoading}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>

                {fileError && (
                  <p className={styles.errorMessage}>{fileError}</p>
                )}
              </div>

              <div className={styles.modalActions}>
                <button
                  onClick={onClose}
                  className={styles.cancelButton}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpload}
                  className={styles.uploadButton}
                  disabled={isLoading || selectedFiles.length === 0}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className={styles.spinner} /> Enviando...
                    </>
                  ) : (
                    "Enviar Imagens"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Popup
        isOpen={popupInfo.isOpen}
        onClose={closePopup}
        title={popupInfo.title}
        message={popupInfo.message}
      />
    </>
  );
};
