import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../context/AuthContext";
import type { User } from "../context/AuthContext";
import styles from "../css/EditProfile.module.css";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { IMaskInput } from "react-imask";
import axios from "axios";

interface ProfileData extends User {
  age?: number;
  cep?: string;
  address?: string;
  cpf?: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: ProfileData;
  onUpdateSuccess: (updatedProfile: Partial<ProfileData>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onUpdateSuccess,
}) => {
  const [name, setName] = useState(currentProfile.name);
  const [age, setAge] = useState(
    currentProfile.age ? String(currentProfile.age) : ""
  );
  const [address, setAddress] = useState(currentProfile.address || "");
  const [cep, setCep] = useState(currentProfile.cep || "");
  const [cpf, setCpf] = useState(currentProfile.cpf || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(currentProfile.name);
      setAge(currentProfile.age ? String(currentProfile.age) : "");
      setAddress(currentProfile.address || "");
      setCep(currentProfile.cep || "");
      setCpf(currentProfile.cpf || "");
      setError(null);
    }
  }, [isOpen, currentProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const ageNumber = age ? parseInt(age, 10) : undefined;
    if (age && (isNaN(ageNumber!) || ageNumber! <= 0)) {
      setError("Idade inválida.");
      setIsLoading(false);
      return;
    }
    if (!name || !age || !address || !cep || !cpf) {
      setError("Todos os campos são obrigatórios para completar o perfil.");
      setIsLoading(false);
      return;
    }

    const cepLimpo = cep.replace(/\D/g, "");

    const updatedData = {
      name,
      age: ageNumber,
      address,
      cep: cepLimpo,
      cpf,
    };

    try {
      console.log(updatedData.name);
      await api.put("/auth/user/update", updatedData);

      onUpdateSuccess(updatedData);
      onClose();
    } catch (err: any) {
      console.error("Erro ao atualizar perfil:", err.response);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Erro ao salvar alterações.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const SearchCep = async () => {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_VIACEP}/${cepLimpo}/json/`
      );

      if (response.data === undefined || response.data === null) {
        setError("CEP não encontrado!");
        setAddress("");
      }

      if (response.data.erro) {
        setError("CEP não encontrado!");
        setAddress("");
      }

      setError("");
      const address = `${response.data.logradouro}, ${response.data.bairro} - ${response.data.localidade}/${response.data.uf}`;
      setAddress(address);
    } catch (err: any) {
      setError("Erro ao buscar o CEP. Tente novamente");
      setAddress("");
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
              <h3>Editar Perfil</h3>
              <button onClick={onClose} className={styles.closeButton}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSave} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label htmlFor="editName">Nome</label>
                <input
                  id="editName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="editAge">Idade</label>
                <input
                  id="editAge"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  min="1"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="editCpf">CPF</label>
                <IMaskInput
                  mask="000.000.000-00"
                  value={cpf}
                  onAccept={(value) => setCpf(value)}
                  className={styles.input}
                  placeholder="Seu CPF"
                  required
                  readOnly={!!currentProfile.cpf}
                  style={
                    currentProfile.cpf
                      ? { backgroundColor: "#e9ecef", cursor: "not-allowed" }
                      : {}
                  }
                />
                {currentProfile.cpf && (
                  <small className={styles.readonlyHint}>
                    CPF não pode ser alterado após definido.
                  </small>
                )}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="editCep">CEP</label>
                <IMaskInput
                  mask="00000-000"
                  value={cep}
                  onAccept={(value) => setCep(value)}
                  className={styles.input}
                  placeholder="Seu CEP"
                  onBlur={SearchCep}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="editAddress">Endereço Completo</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Endereço"
                  readOnly
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
                  {isLoading ? (
                    <>
                      <FaSpinner className={styles.spinner} /> Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
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
