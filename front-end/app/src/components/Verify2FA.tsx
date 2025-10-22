import { useState } from "react";
import { api, useAuth } from "../context/AuthContext";
import type { User } from "../context/AuthContext";
import styles from "../css/Verify2FA.module.css";
import Soccer from "../assets/soccer-2.jpg";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface Verify2FAProps {
  user: User;
}

export const Verify2FA = ({ user }: Verify2FAProps) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();

  const handleVerify = async () => {
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError("O código deve ser exatamente 6 dígitos numéricos.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`/auth/user/verify-2fa/${user.id}`, {
        token: otp,
      });

      const { accessToken } = response.data;
      signIn(accessToken, user);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Código 2FA inválido."
      );
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <section className={`${styles.sectionCadastro} ${styles.fadeIn}`}>
        <img src={Soccer} alt="Imagem bola de futebol" />

        <div className={styles.containerForm}>
          <h2>Verificação de Duas Etapas</h2>
          <p>
            Olá, {user.name}. Por segurança, digite o código de 6 dígitos do seu
            aplicativo autenticador.
          </p>
          <div className={styles.groupForm}>
            <label htmlFor="otp-code">Código de 6 dígitos</label>
            <input
              id="otp-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Seu código"
              maxLength={6}
              className="otp-input"
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button
            onClick={handleVerify}
            disabled={loading || otp.length < 6}
            className={styles.button}
          >
            {loading ? "Verificando..." : "Verificar e Entrar"}
          </button>
          <div className={styles.link}>
            Está com problemas?
            <a href="/user/ajuda">Ajuda</a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
