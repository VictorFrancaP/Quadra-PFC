import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Popup } from "../components/Popup";
import { api } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IMaskInput } from "react-imask";
import { FaSpinner } from "react-icons/fa";

import styles from "../css/CreateQuadra.module.css";
import axios from "axios";

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

interface FormData {
  name: string;
  description: string;
  cep: string;
  address: string;
  city: string;
  state: string;
  operationDays: Weekday[];
  openHour: string;
  closingHour: string;
  priceHour: string;
  maxDuration: string;
  ownerPixKey: string;
  observations?: string;
}

export const CreateQuadraForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    cep: "",
    address: "",
    city: "",
    state: "",
    operationDays: [],
    openHour: "",
    closingHour: "",
    priceHour: "",
    maxDuration: "",
    ownerPixKey: "",
    observations: "",
  });
  const [unmaskedCep, setUnmaskedCep] = useState("");
  const [unmaskedPrice, setUnmaskedPrice] = useState("");
  const [unmaskedDuration, setUnmaskedDuration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [popupInfo, setPopupInfo] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isError: boolean;
  }>({ isOpen: false, title: "", message: "", isError: false });
  const [formError, setFormError] = useState<string | null>(null);
  const [cepError, setCepError] = useState<string | null>(null);

  const navigate = useNavigate();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const showPopup = (
    title: string,
    message: string,
    isError: boolean = false
  ) => {
    setPopupInfo({ isOpen: true, title, message, isError });
  };
  const closePopup = () => {
    setPopupInfo({ ...popupInfo, isOpen: false });
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
      console.error("Erro ao buscar CEP:", err);
      setCepError("Erro ao buscar o CEP. Tente novamente.");
      setFormData((prev) => ({ ...prev, address: "", city: "", state: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);
    closePopup();

    if (formData.operationDays.length === 0) {
      setFormError("Selecione pelo menos um dia de funcionamento.");
      setIsLoading(false);
      return;
    }
    const priceNumber = parseFloat(unmaskedPrice) / 100;
    const durationNumber = parseInt(unmaskedDuration, 10);

    if (isNaN(priceNumber) || priceNumber < 0) {
      setFormError("Preço por hora inválido ou menor que R$ 20,00.");
      setIsLoading(false);
      return;
    }
    if (isNaN(durationNumber) || durationNumber <= 0) {
      setFormError("Duração máxima inválida.");
      setIsLoading(false);
      return;
    }
    if (unmaskedCep.length !== 8) {
      setFormError("CEP inválido.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/soccer/create", {
        name: formData.name,
        description: formData.description,
        cep: unmaskedCep,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        operationDays: formData.operationDays,
        openHour: formData.openHour,
        closingHour: formData.closingHour,
        priceHour: priceNumber,
        maxDuration: durationNumber,
        ownerPixKey: formData.ownerPixKey,
        observations: formData.observations || undefined,
      });

      showPopup(
        "Quadra Cadastrada",
        response.data.message || "Sua quadra foi cadastrada com sucesso!"
      );
      setFormData({
        name: "",
        description: "",
        cep: "",
        address: "",
        city: "",
        state: "",
        operationDays: [],
        openHour: "",
        closingHour: "",
        priceHour: "",
        maxDuration: "",
        ownerPixKey: "",
        observations: "",
      });
      setUnmaskedCep("");
      setUnmaskedPrice("");
      setUnmaskedDuration("");
      setCepError(null);

      setTimeout(() => {
        closePopup();
        navigate("/");
      }, 3000);
    } catch (err: any) {
      console.error("Erro ao cadastrar quadra:", err.response);
      let extractedMessage = "Ocorreu um erro desconhecido ao cadastrar.";
      if (err.response?.data) {
        const responseData = err.response.data;
        if (responseData.message && typeof responseData.message === "string") {
          extractedMessage = responseData.message;
          if (responseData.errors && Array.isArray(responseData.errors)) {
            extractedMessage += ": " + responseData.errors.join("; ");
          }
        } else if (responseData.errors) {
          if (typeof responseData.errors === "string") {
            extractedMessage = responseData.errors;
          } else if (Array.isArray(responseData.errors)) {
            extractedMessage = responseData.errors.join("; ");
          }
        } else if (typeof responseData === "string") {
          extractedMessage = responseData;
        }
      } else if (err.request) {
        extractedMessage = "Não foi possível conectar ao servidor.";
      } else {
        extractedMessage = err.message || extractedMessage;
      }

      showPopup("Erro no Cadastro", extractedMessage, true);
      setFormError(extractedMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>
        <form onSubmit={handleSubmit} className={styles.quadraForm}>
          <h2 style={{ fontFamily: `"Montserrat", sans-serif` }}>
            Cadastrar Nova Quadra
          </h2>
          <p style={{ fontFamily: `"Montserrat", sans-serif` }}>
            Preencha os detalhes da sua quadra.
          </p>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nome da Quadra/Local</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Nome do local"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cep">CEP</label>
              <IMaskInput
                mask="00000-000"
                value={formData.cep}
                unmask={true}
                className={styles.input}
                placeholder="Seu CEP"
                required
                onAccept={(value, mask) => {
                  setFormData((prev) => ({ ...prev, cep: value }));
                  const unmasked = mask.unmaskedValue;
                  setUnmaskedCep(unmasked);
                  if (unmasked.length === 8) {
                    SearchCep(unmasked);
                  } else {
                    setCepError(null);
                  }
                }}
                style={{ borderColor: cepError ? "red" : "#ccc" }}
              />
              {cepError && (
                <span className={styles.errorMessage}>{cepError}</span>
              )}
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="address">Endereço (Rua, Número, Bairro)</label>
              <input
                type="text"
                className={styles.input}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Preenchido pelo CEP, adicione o número"
                readOnly
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="city">Cidade</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Cidade"
                name="city"
                value={formData.city}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="state">Estado</label>
              <input
                type="text"
                className={styles.input}
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                maxLength={2}
                placeholder="Estado"
                readOnly
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Dias de Funcionamento</label>
              <div className={styles.checkboxGroup}>
                {weekdays.map((day) => (
                  <div key={day} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      id={`day-${day}`}
                      value={day}
                      style={{ fontFamily: `"Montserrat", sans-serif` }}
                      checked={formData.operationDays.includes(day)}
                      onChange={handleDayChange}
                    />
                    <label htmlFor={`day-${day}`}>{day}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="openHour">Horário de Abertura</label>
              <IMaskInput
                mask="00:00"
                value={formData.openHour}
                onAccept={(value) =>
                  setFormData((prev) => ({ ...prev, openHour: value }))
                }
                className={styles.input}
                placeholder="09:00"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="closingHour">Horário de Fechamento</label>
              <IMaskInput
                mask="00:00"
                value={formData.closingHour}
                onAccept={(value) =>
                  setFormData((prev) => ({ ...prev, closingHour: value }))
                }
                className={styles.input}
                placeholder="22:00"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="priceHour">Preço por Hora (R$)</label>
              <IMaskInput
                mask={Number}
                radix="."
                mapToRadix={[","]}
                scale={2}
                padFractionalZeros={true}
                thousandsSeparator="."
                value={formData.priceHour}
                unmask={true}
                onAccept={(value, mask) => {
                  setFormData((prev) => ({ ...prev, priceHour: value }));
                  setUnmaskedPrice(mask.unmaskedValue);
                }}
                placeholder="50,00"
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="maxDuration">Duração Máx. (horas)</label>
              <IMaskInput
                mask={Number}
                scale={0}
                value={formData.maxDuration}
                unmask={true}
                onAccept={(value, mask) => {
                  setFormData((prev) => ({ ...prev, maxDuration: value }));
                  setUnmaskedDuration(mask.unmaskedValue);
                }}
                placeholder="Ex: 3"
                required
                className={styles.input}
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="ownerPixKey">Chave Pix (para recebimento)</label>
              <input
                type="text"
                id="ownerPixKey"
                name="ownerPixKey"
                value={formData.ownerPixKey}
                onChange={handleChange}
                placeholder="Sua chave pix (CPF, TELEFONE)"
                required
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="description">Descrição Detalhada</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Detalhes sobre a estrutura, tipos de quadra, etc."
              />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="observations">Observações (Opcional)</label>
              <textarea
                id="observations"
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                rows={3}
                placeholder="Instruções de acesso, regras específicas, etc."
              />
            </div>
          </div>{" "}
          {formError && <p className={styles.formError}>{formError}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? (
              <>
                <FaSpinner className={styles.spinner} /> Cadastrando...
              </>
            ) : (
              "Cadastrar Quadra"
            )}
          </button>
        </form>
      </div>
      <Footer />
      <Popup
        isOpen={popupInfo.isOpen}
        onClose={closePopup}
        title={popupInfo.title}
        message={popupInfo.message}
      />
    </>
  );
};
