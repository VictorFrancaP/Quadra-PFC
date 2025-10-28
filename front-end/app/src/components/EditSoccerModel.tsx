import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../context/AuthContext";
import styles from "../css/EditSoccerModal.module.css";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { IMaskInput } from "react-imask";
import axios from "axios";

interface SoccerDetails {
  id: string;
  name: string;
  description: string;
  cep: string;
  address: string;
  city: string;
  state: string;
  cnpj: string;
  fone: string;
  operationDays: string[];
  openHour: string;
  closingHour: string;
  priceHour: number;
  maxDuration: number;
  isActive: boolean;
  ownerPixKey?: string | null;
  observations?: string | null;
  images?: string[];
}

interface UpdateSuccessData {
  name: string;
  description?: string;
  cep?: string;
  address?: string;
  city?: string;
  state?: string;
  fone?: string;
  operationDays?: string[];
  openHour?: string;
  closingHour?: string;
  priceHour?: number;
  maxDuration?: number;
  isActive?: boolean;
  observations?: string | null;
}

interface EditSoccerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSoccer: SoccerDetails;
  onUpdateSuccess: (updatedSoccer: UpdateSuccessData) => void;
}

const weekdays = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sabado",
  "Domingo",
] as const;
type Weekday = (typeof weekdays)[number];

export const EditSoccerModal: React.FC<EditSoccerModalProps> = ({
  isOpen,
  onClose,
  currentSoccer,
  onUpdateSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cep: "",
    address: "",
    city: "",
    state: "",
    operationDays: [] as Weekday[],
    openHour: "",
    closingHour: "",
    priceHour: "",
    maxDuration: "",
    observations: "",
    isActive: true,
    cnpj: "",
    fone: "",
  });

  const [unmaskedCep, setUnmaskedCep] = useState("");
  const [unmaskedDuration, setUnmaskedDuration] = useState("");
  const [unmaskedFone, setUnmaskedFone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cepError, setCepError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && currentSoccer) {
      const formattedDuration = (currentSoccer.maxDuration || 0).toString();

      setFormData({
        name: currentSoccer.name || "",
        description: currentSoccer.description || "",
        cep: currentSoccer.cep || "",
        address: currentSoccer.address || "",
        city: currentSoccer.city || "",
        state: currentSoccer.state || "",
        operationDays: (currentSoccer.operationDays || []) as Weekday[],
        openHour: currentSoccer.openHour || "",
        closingHour: currentSoccer.closingHour || "",
        priceHour: (currentSoccer.priceHour || 0).toString(),
        maxDuration: formattedDuration,
        observations: currentSoccer.observations || "",
        isActive: currentSoccer.isActive,
        cnpj: currentSoccer.cnpj || "",
        fone: currentSoccer.fone || "",
      });

      setUnmaskedCep(currentSoccer.cep?.replace(/\D/g, "") || "");
      setUnmaskedDuration((currentSoccer.maxDuration || 0).toString());
      setUnmaskedFone(currentSoccer.fone?.replace(/\D/g, "") || "");

      setError(null);
      setCepError(null);
    }
  }, [isOpen, currentSoccer]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const inputValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: inputValue }));
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const day = value as Weekday;
    setFormData((prev) => {
      const currentDays = prev.operationDays;
      if (checked) {
        return {
          ...prev,
          operationDays: [...currentDays, day].filter(
            (d, i, self) => self.indexOf(d) === i
          ),
        };
      } else {
        return { ...prev, operationDays: currentDays.filter((d) => d !== day) };
      }
    });
  };

  const SearchCep = async (cepValue: string) => {
    const cepLimpo = cepValue.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      setCepError(null);
      return;
    }
    setCepError("Buscando CEP...");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_VIACEP}/${cepLimpo}/json/`
      );
      if (response.data.erro) {
        setCepError("CEP não encontrado!");
        setFormData((prev) => ({ ...prev, address: "", city: "", state: "" }));
      } else {
        setCepError(null);
        setFormData((prev) => ({
          ...prev,
          address: `${response.data.logradouro || ""}, ${
            response.data.bairro || ""
          }`,
          city: response.data.localidade || "",
          state: response.data.uf || "",
        }));
      }
    } catch (err: any) {
      setCepError("Erro ao buscar o CEP.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const priceNumber = parseFloat(formData.priceHour.replace(",", "."));
    const durationNumber = parseInt(unmaskedDuration, 10);
    if (unmaskedCep.length !== 8) {
      setError("CEP inválido. Deve conter 8 dígitos.");
      setIsLoading(false);
      return;
    }
    if (unmaskedFone.length < 10 || unmaskedFone.length > 11) {
      setError("Telefone inválido. Deve conter 10 ou 11 dígitos.");
      setIsLoading(false);
      return;
    }
    if (isNaN(priceNumber) || priceNumber < 20) {
      setError("Preço por hora inválido (mín. R$ 20,00).");
      setIsLoading(false);
      return;
    }
    if (isNaN(durationNumber) || durationNumber <= 0) {
      setError("Duração máxima inválida.");
      setIsLoading(false);
      return;
    }
    if (formData.operationDays.length === 0) {
      setError("Selecione pelo menos um dia de funcionamento.");
      setIsLoading(false);
      return;
    }
    const updateData = {
      name: formData.name,
      description: formData.description,
      cep: unmaskedCep,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      fone: unmaskedFone,
      operationDays: formData.operationDays,
      openHour: formData.openHour,
      closingHour: formData.closingHour,
      priceHour: priceNumber,
      maxDuration: durationNumber,
      isActive: formData.isActive,
      observations: formData.observations || undefined,
    };

    console.log("Enviando para /auth/soccer/update:", updateData);

    try {
      await api.put("/auth/soccer/update", updateData);
      onUpdateSuccess(updateData as UpdateSuccessData);
      onClose();
    } catch (err: any) {
      console.error("Erro ao atualizar quadra:", err.response);
      let extractedMessage = "Erro ao salvar. Verifique os dados.";
      if (err.response?.data) {
      }
      setError(extractedMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.overlay}>
          <motion.div className={styles.modal}>
            <div className={styles.modalHeader}>
                            <h3>Editar Minha Quadra</h3>
              <button onClick={onClose} className={styles.closeButton}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSave} className={styles.modalForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="editName">Nome da Quadra/Local</label>
                  <input
                    type="text"
                    id="editName"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="editCnpj">CNPJ (Não editável)</label>
                  <IMaskInput
                    mask="00.000.000/0000-00"
                    value={formData.cnpj}
                    id="editCnpj"
                    readOnly
                    className={`${styles.readOnlyInput} ${styles.input}`}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="editCep">CEP</label>
                  <IMaskInput
                    mask="00000-000"
                    value={formData.cep}
                    unmask={true}
                    id="editCep"
                    required
                    placeholder="00000-000"
                    onAccept={(value, mask) => {
                      setFormData((prev) => ({ ...prev, cep: value }));
                      setUnmaskedCep(mask.unmaskedValue);
                      if (mask.unmaskedValue.length === 8)
                        SearchCep(mask.unmaskedValue);
                    }}
                    className={styles.input}
                    style={{ borderColor: cepError ? "red" : "#ccc" }}
                  />
                  {cepError && (
                    <span className={styles.errorMessage}>{cepError}</span>
                  )}
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="editAddress">
                    Endereço (Rua, Número, Bairro)
                  </label>
                  <input
                    type="text"
                    id="editAddress"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="editCity">Cidade</label>
                  <input
                    type="text"
                    id="editCity"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="editState">Estado (UF)</label>
                  <input
                    type="text"
                    id="editState"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    maxLength={2}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Dias de Funcionamento</label>       
                  <div className={styles.checkboxGroup}>
                    {weekdays.map((day) => (
                      <div key={day} className={styles.checkboxItem}>
                        <input
                          type="checkbox"
                          id={`editDay-${day}`}
                          value={day}
                          checked={formData.operationDays.includes(day)}
                          onChange={handleDayChange}
                        />
                        <label htmlFor={`editDay-${day}`}>{day}</label>         
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="editOpenHour">Abertura</label>
                  <IMaskInput
                    mask="00:00"
                    value={formData.openHour}
                    onAccept={(v) =>
                      setFormData((p) => ({ ...p, openHour: v }))
                    }
                    id="editOpenHour"
                    className={styles.input}
                    placeholder="HH:MM"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="editClosingHour">Fechamento</label>
                  <IMaskInput
                    mask="00:00"
                    value={formData.closingHour}
                    onAccept={(v) =>
                      setFormData((p) => ({ ...p, closingHour: v }))
                    }
                    id="editClosingHour"
                    placeholder="HH:MM"
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="editPriceHour">Preço/Hora (R$)</label>{" "}
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    id="editPriceHour"
                    name="priceHour"
                    value={formData.priceHour}
                    onChange={handleChange}
                    placeholder="Ex: 50.00 ou 50,00"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="editMaxDuration">
                    Duração Máx. (minutos)
                  </label>
                  <IMaskInput
                    mask={Number}
                    className={styles.input}
                    scale={0}
                    value={formData.maxDuration}
                    unmask={true}
                    onAccept={(value, mask) => {
                      setFormData((prev) => ({ ...prev, maxDuration: value }));
                      setUnmaskedDuration(mask.unmaskedValue);
                    }}
                    required
                    id="editMaxDuration"
                    placeholder="Ex: 60"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="editFone">Telefone (com DDD)</label>
                  <IMaskInput
                    mask="(00) 00000-0000"
                    value={formData.fone}
                    className={styles.input}
                    unmask={true}
                    id="editFone"
                    required
                    placeholder="(00) 00000-0000"
                    onAccept={(value, mask) => {
                      setFormData((prev) => ({ ...prev, fone: value }));
                      setUnmaskedFone(mask.unmaskedValue);
                    }}
                  />
                </div>
                <div className={styles.formGroup}></div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="editDescription">Descrição</label>
                  <textarea
                    id="editDescription"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="editObservations">
                    Observações (Opcional)
                  </label>
                  <textarea
                    id="editObservations"
                    name="observations"
                    value={formData.observations}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
                <div
                  className={`${styles.formGroup} ${styles.fullWidth} ${styles.toggleGroup}`}
                >
                                    <label>Status da Quadra:</label>           
                  <div className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      id="editIsActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                    />
                    <label htmlFor="editIsActive"></label> 
                    <span>
                      {formData.isActive
                        ? "Ativa (Aceitando reservas)"
                        : "Inativa (Pausada)"}
                    </span>
                  </div>
                </div>
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
