import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { api } from "../context/AuthContext";
import styles from "../css/ForgotPassword.module.css";
import {
  FaSpinner,
  FaEnvelope,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import Soccer from "../assets/imagem-soccer.jpg";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    try {
      const response = await api.post("/auth/user/forgot-password", {
        email,
      });
      setFeedback({ message: response.data.message, isError: false });
    } catch (err: any) {
      console.error("Erro ao solicitar redefinição:", err.response);
      const errorMessage =
        err.response?.data?.message || err.response?.data || "Ocorreu um erro.";
      setFeedback({ message: errorMessage, isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <section className={`${styles.section} ${styles.fadeIn}`}>
        <img src={Soccer} alt="Imagem de fundo" className="backgroundVideo" />

        <div className={styles.containerForm}>
          {feedback && !isLoading ? (
            <div className={styles.feedbackContainer}>
              {feedback.isError ? (
                <FaExclamationCircle className={styles.iconError} />
              ) : (
                <FaCheckCircle className={styles.iconSuccess} />
              )}
              <h2>
                {feedback.isError
                  ? "Ocorreu um Problema"
                  : "Verifique seu E-mail"}
              </h2>
              <p>{feedback.message}</p>
              <Link to="/login" className={styles.backButton}>
                Voltar para o Login
              </Link>
            </div>
          ) : (
            <>
              <h2>Esqueceu sua senha?</h2>
              <p>
                Não se preocupe. Digite seu e-mail e enviaremos um link para
                você redefinir sua senha.
              </p>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.groupForm}>
                  <label htmlFor="email">E-mail</label>
                  <div className={styles.inputWithIcon}>
                    <FaEnvelope className={styles.inputIcon} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={styles.button}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className={styles.spinner} /> Enviando...
                    </>
                  ) : (
                    "Enviar"
                  )}
                </button>

                <div style={{display: "flex", alignItems: "center", justifyContent: "center"}} className={styles.link}>
                  <p>
                    Lembrou a senha? {" "} {" "}
                    <Link to="/login">Voltar para o Login</Link>
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};
