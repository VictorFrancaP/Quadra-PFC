import { useState } from "react";
import { api, useAuth } from "../context/AuthContext";
import type { User } from "../context/AuthContext";

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
    <div className="auth-form">
      <h3>Verificação de Duas Etapas</h3>
      <p>
        Olá, {user.name}. Por segurança, digite o código de 6 dígitos do seu
        aplicativo autenticador.
      </p>
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
        {loading ? "Verificando..." : "Verificar e Entrar"}
      </button>
    </div>
  );
};
