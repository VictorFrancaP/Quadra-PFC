// Importando Header e Footer e Popup
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Popup } from "../components/Popup";
import styles from "../css/CadastroRequest.module.css";
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";

// Importando navigate para navegação entre as rotas
import { useNavigate } from "react-router-dom";

// Importando api
import { api } from "../context/AuthContext";

// Importando useState
import { useState } from "react";

// exportando pagina
export const CadastroRequest = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupIsVisible, setPopupIsVisible] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();

  // validando dados
  const validate = () => {
    let isValid = true;

    if (!name) {
      setNameError("O nome é obrigatório!");
      isValid = false;
    } else if (name.length < 3) {
      setNameError("O nome deve ter mais de 2 caracteres!");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!email) {
      setEmailError("O e-mail é obrigatório!");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("O e-mail deve estar em um formato válido!");
      isValid = false;
    } else {
      setEmailError("");
    }

    return isValid;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await api.post("/auth/user/create", {
        name,
        email,
      });

      setPopupMessage(response.data.message);
      setPopupIsVisible(true);
      setName("");
      setEmail("");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err: any) {
      setPopupMessage(err.response.data);
      setPopupIsVisible(true);
    }
  };

  const handleGoogleSubmit = async (e: any) => {
    e.preventDefault();

    window.location.href = `${import.meta.env.VITE_GOOGLESOCIAL}`;
  };

  return (
    <>
      <Header />
      <section className={styles.sectionCadastro}>
        <video
          src="/video-soccer.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="backgroundVideo"
        />

        <div className={`${styles.containerForm} ${styles.fadeIn}`}>
          <h1>Cadastro</h1>
          <p>Encontre as melhoras reservas de quadras da sua região</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.groupForm}>
              <label htmlFor="name">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                style={{ borderColor: nameError ? "red" : "#ccc" }}
              />
              {nameError && <span className={styles.error}>{nameError}</span>}
            </div>

            <div className={styles.groupForm}>
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                style={{ borderColor: emailError ? "red" : "#ccc" }}
              />
              {emailError && <span className={styles.error}>{emailError}</span>}
            </div>

            <button type="submit" className={styles.button}>
              Solicitar Cadastro
            </button>

            <button
              type="button"
              onClick={handleGoogleSubmit}
              className={styles.googleButton}
            >
              <FaGoogle className={styles.icon} /> Google
            </button>

            <p>
              Já tem uma conta? <Link to="/login">Entre aqui</Link>
            </p>
          </form>
        </div>
      </section>
      <Footer />
      <Popup
        isOpen={popupIsVisible}
        onClose={() => setPopupIsVisible(false)}
        title="Cadastro"
        message={popupMessage}
      />
    </>
  );
};
