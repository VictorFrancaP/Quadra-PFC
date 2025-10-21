import { useState } from "react";
import { api } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onLoginSuccess: (data: any) => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
    <form onSubmit={handleSubmit} className="auth-form">
      <h3>Entre na sua Conta</h3>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button type="submit" disabled={loading} className="auth-button primary">
        {loading ? "Entrando..." : "Entrar"}
      </button>
      <p className="auth-switch">
        Não tem uma conta?
        <span onClick={() => navigate("/register")}>Crie uma agora</span>     {" "}
      </p>
         {" "}
    </form>
  );
};
