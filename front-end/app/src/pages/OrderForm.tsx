import { useState } from "react";
import { api } from "../context/AuthContext";
import { Popup } from "../components/Popup";
import styles from "../css/Order.module.css";
import { IMaskInput } from "react-imask";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import Bola from '../assets/bola-de-futebol.jpg';

export const Order = () => {
  const [localName, setLocalName] = useState("");
  const [description, setDescription] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [fone, setFone] = useState("");
  const [localNameError, setLocalNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [cnpjError, setCnpjError] = useState("");
  const [foneError, setFoneError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [popupInfo, setPopupInfo] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isError: boolean;
  }>({ isOpen: false, title: "", message: "", isError: false });
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
  const navigate = useNavigate();

  const validate = () => {
    let isValid = true;

    if (!localName) {
      setLocalNameError("O nome do local é obrigatório!");
      isValid = false;
    } else if (localName.length < 3) {
      setLocalNameError(
        "O nome do local deve conter no minino três caracteres!"
      );
      isValid = false;
    } else {
      setLocalNameError("");
    }

    if (!description) {
      setDescriptionError("A descrição é obrigatória!");
    } else {
      setDescriptionError("");
    }

    if (!cnpj) {
      setCnpjError("O CNPJ é obrigatório!");
      isValid = false;
    } else {
      setCnpjError("");
    }

    if (!fone) {
      setFoneError("O telefone é obrigatório!");
      isValid = false;
    } else if (fone.length < 15) {
      setFoneError("Digite um telefone válido!");
      isValid = false;
    } else {
      setFoneError("");
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    closePopup();

    if (!validate()) return;

    try {
      const response = await api.post("/auth/order/create", {
        localName,
        description,
        cnpj,
        fone,
      });
      showPopup(
        "Solicitação Enviada",
        response.data.message || "Sua solicitação foi criada com sucesso!"
      );
      setLocalName("");
      setDescription("");
      setCnpj("");
      setFone("");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err: any) {
      console.error("Erro ao criar solicitação:", err.response);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Ocorreu um erro ao enviar sua solicitação. Tente novamente.";

      showPopup("Erro na Solicitação", errorMessage, true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Header/>
      <section className={`${styles.section} ${styles.fadeIn}`}>
        <img src={Bola} alt="Imagem bola de futebol" />
        <div className={styles.containerForm}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2>Solicitar Acesso de Proprietário</h2>
            <p>Preencha os dados abaixo para análise. Entraremos em contato.</p>
            <div className={styles.groupForm}>
              <label htmlFor="localName">Nome do Local/Estabelecimento</label>
              <input
                type="text"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                placeholder="Nome do local"
                style={{ borderColor: localNameError ? "red" : "#ccc" }}
              />
            </div>
            <div className={styles.groupForm}>
              <label htmlFor="description">Descrição Curta do Local</label>
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Sua descrição"
                style={{ borderColor: descriptionError ? "red" : "#ccc" }}
              ></textarea>
            </div>
            <div className={styles.groupForm}>
              <label htmlFor="cnpj">CNPJ</label>
              <IMaskInput
                mask="00.000.000/0000-00"
                value={cnpj}
                onAccept={(value) => setCnpj(value)}
                placeholder="Seu CNPJ"
                style={{ borderColor: cnpjError ? "red" : "#ccc" }}
              />
            </div>
            <div className={styles.groupForm}>
              <label htmlFor="fone">Telefone</label>
              <IMaskInput
                mask="(00) 00000-0000"
                value={fone}
                onAccept={(value) => setFone(value)}
                placeholder="Seu telefone"
                style={{ borderColor: foneError ? "red" : "#ccc" }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.button}
            >
              {isLoading ? "Enviando..." : "Enviar Solicitação"}
            </button>
          </form>
        </div>
      </section>
      <Footer/>
      <Popup
        isOpen={popupInfo.isOpen}
        onClose={closePopup}
        title={popupInfo.title}
        message={popupInfo.message}
      />
    </>
  );
};
