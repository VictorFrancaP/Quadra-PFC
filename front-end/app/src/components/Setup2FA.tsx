import { useState, useEffect } from "react";
import { api, useAuth } from "../context/AuthContext";
import { QRCodeSVG } from "qrcode.react";
import type { User } from "../context/AuthContext";

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
      setLoading(false);
    }
  };

  if (error && !qrCodeUrl) {
    return <p className="error-message">{error}</p>;
  }

  if (!qrCodeUrl) {
    return <p>Carregando configuração de segurança...</p>;
  }

  return (
    <div className="auth-form">
      <h3>Configure sua Autenticação</h3>
      <p>
        Este é seu primeiro acesso. Escaneie o QR Code abaixo com seu app
        autenticador (Google, Microsoft, Authy, etc).
      </p>
      <div className="qr-code-container">
        <QRCodeSVG value={qrCodeUrl} size={200} />
      </div>
      <p>Após escanear, digite o código de 6 dígitos gerado:</p>
      <div className="form-group">
        <label htmlFor="otp-code">Código de 6 dígitos</label>
        <input
          id="otp-code"
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="123456"
          maxLength={6}
          className="otp-input"
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button
        onClick={handleVerify}
        disabled={loading || otp.length < 6}
        className="auth-button primary"
      >
        {loading ? "Verificando..." : "Ativar e Entrar"}
      </button>
    </div>
  );
};
