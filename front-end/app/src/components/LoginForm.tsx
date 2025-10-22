import { useState } from "react";
import { api } from "../context/AuthContext";
import styles from "../css/Login.module.css";
import Soccer from "../assets/imagem-soccer.jpg";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LoginFormProps {
  onLoginSuccess: (data: any) => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/user/login", {
        email,
        password,
      });
      onLoginSuccess(response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data ||
        err.response?.data?.message ||
        "Ocorreu um erro. Tente novamente.";

      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <section className={`${styles.sectionCadastro} ${styles.fadeIn}`}>
        <img src={Soccer} alt="Imagem de fundo do login" />

        <div className={styles.containerForm}>
          <h2>Efetue o seu login</h2>
          <p>Insira as credenciais abaixo para efetuar o login</p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.groupForm}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                required
              />
            </div>
            <div className={styles.groupForm}>
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
              />
            </div>
            {error && <span className={styles.error}>{error}</span>}
            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <div className={styles.link}>
              Nãp tem conta?
              <a href="/user/cadastrar">Crie uma nova conta</a>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};
