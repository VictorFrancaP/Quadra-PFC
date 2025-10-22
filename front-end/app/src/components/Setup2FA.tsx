import { useState, useEffect } from "react";
import { api, useAuth } from "../context/AuthContext";
import { QRCodeSVG } from "qrcode.react";
import type { User } from "../context/AuthContext";
import Soccer from "../assets/soccer-3.jpg";
import styles from "../css/Setup2FA.module.css";

interface Setup2FAProps {
  user: User;
  tempToken: string;
}

export const Setup2FA = ({ user, tempToken }: Setup2FAProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn } = useAuth();

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await api.post(
          "/auth/user/setup-2fa",
          {},
          {
            headers: { Authorization: `Bearer ${tempToken}` },
          }
        );

        const originalUrl = response.data.otpAuthUrl;

        if (typeof originalUrl !== "string") {
          setError("Resposta inesperada do servidor ao buscar QR Code.");
          return;
        }

        let cleanedUrl = originalUrl;
        try {
          const parts = originalUrl.split("?");
          if (parts.length === 2) {
            const baseUrl = parts[0];
            const params = new URLSearchParams(parts[1]);

            params.delete("period");
            params.delete("digits");
            params.delete("algorithm");
            params.delete("issuer");

            cleanedUrl = `${baseUrl}?${params.toString()}`;
          }
        } catch (e) {
          console.error("Não foi possível limpar a URL, usando a original.", e);
        }
        setQrCodeUrl(cleanedUrl);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data ||
          "Não foi possível carregar o QR Code. Tente logar novamente.";
        setError(errorMessage);
      }
    };

    fetchQRCode();
  }, [tempToken]);

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
      setOtp("");
      setLoading(false);
    }
  };

  if (error && !qrCodeUrl) {
    return <p className={styles.error}>{error}</p>;
  }

  if (!qrCodeUrl) {
    return <p>Carregando configuração de segurança...</p>;
  }

  return (
    <>
      <section className={`${styles.sectionCadastro} ${styles.fadeIn}`}>
        <img src={Soccer} alt="Imagem bola de futebol" />
        <div className={styles.containerForm}>
          <h2>Configure sua Autenticação</h2>
          <p>
            Este é seu primeiro acesso. Escaneie o QR Code abaixo com seu app
            autenticador (Google ou Microsoft).
          </p>
          <div className={styles.qrcode}>
            <QRCodeSVG value={qrCodeUrl} size={200} />
          </div>
          <p>Após escanear, digite o código de 6 dígitos gerado:</p>
          <div className={styles.groupForm}>
            <label htmlFor="otp-code">Código de 6 dígitos</label>
            <input
              id="otp-code"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Seu codigo"
              maxLength={6}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button
            onClick={handleVerify}
            disabled={loading || otp.length < 6}
            className={styles.button}
          >
            {loading ? "Verificando..." : "Ativar e Entrar"}
          </button>
          <div className={styles.link}>
            <a
              href="https://play.google.com/store/apps/details?id=com.azure.authenticator&hl=pt_BR&pli=1"
              target="_blank"
            >
              Baixar autenticador
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
