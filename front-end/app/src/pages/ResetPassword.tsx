import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { api } from "../context/AuthContext";
import styles from "../css/ResetPassword.module.css";
import Soccer from "../assets/imagem-soccer.jpg";

const validationPassword = (password: string) => ({
  length: password.length >= 7,
  upper: /[A-Z]/.test(password),
  lower: /[a-z]/.test(password),
  number: /[0-9]/.test(password),
  special: /[#?!@$%^&*-]/.test(password),
});

export const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const validate = (): boolean => {
    setError(null);
    const validations = validationPassword(password);
    setPasswordValidation(validations);

    if (Object.values(validations).some((v) => !v)) {
      setError("A senha deve atender a todos os requisitos.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setError(null);

    try {
      await api.put(`/auth/user/reset-password/${token}`, {
        password,
      });

      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      console.error("Erro ao redefinir senha:", err.response);
      const errorMessage =
        err.response?.data?.message || err.response?.data || "Ocorreu um erro.";

      if (errorMessage.includes("expirado")) {
        setError(
          "Seu link de redefinição expirou. Por favor, solicite um novo."
        );
      } else if (errorMessage.includes("inválido")) {
        setError("O link de redefinição é inválido ou já foi usado.");
      } else if (errorMessage.includes("mesma")) {
        setError("A nova senha não pode ser igual à senha anterior.");
      } else {
        setError(errorMessage);
      }
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
          {isSuccess ? (
            <div className={styles.feedbackContainer}>
              <FaCheckCircle className={styles.iconSuccess} />
              <h2>Senha Redefinida!</h2>
              <p>
                Sua senha foi alterada com sucesso. Você será redirecionado para
                o login...
              </p>
            </div>
          ) : (
            <>
              <h2>Redefinir sua Senha</h2>
              <p>
                Digite sua nova senha abaixo. Ela deve atender aos requisitos.
              </p>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.groupForm}>
                  <label htmlFor="password">Nova Senha</label>
                  <div className={styles.passwordContainer}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordValidation(
                          validationPassword(e.target.value)
                        );
                      }}
                      placeholder="Sua nova senha"
                      required
                    />
                    <span
                      className={styles.passwordSpan}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </span>
                  </div>
                </div>
                <div className={styles.groupForm}>
                  <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                  <div className={styles.passwordContainer}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme a senha"
                      required
                    />
                    <span
                      className={styles.passwordSpan}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </span>
                  </div>
                </div>
                <div className={styles.containerSenha}>
                  <p>A senha deve conter:</p>
                  <ul className={styles.passwordCheck}>
                    <li
                      style={{
                        color: passwordValidation.length ? "green" : "red",
                      }}
                    >
                      {passwordValidation.length ? "✅" : "❌"} No mínimo 7
                      caracteres
                    </li>
                    <li
                      style={{
                        color: passwordValidation.upper ? "green" : "red",
                      }}
                    >
                      {passwordValidation.upper ? "✅" : "❌"} Uma letra
                      maiúscula
                    </li>
                    <li
                      style={{
                        color: passwordValidation.lower ? "green" : "red",
                      }}
                    >
                      {passwordValidation.lower ? "✅" : "❌"} Uma letra
                      minúscula
                    </li>
                    <li
                      style={{
                        color: passwordValidation.number ? "green" : "red",
                      }}
                    >
                      {passwordValidation.number ? "✅" : "❌"} Um número
                    </li>
                    <li
                      style={{
                        color: passwordValidation.special ? "green" : "red",
                      }}
                    >
                      {passwordValidation.special ? "✅" : "❌"} Um caractere
                      especial
                    </li>
                  </ul>
                </div>
                {error && (
                  <p className={styles.errorMessage}>
                    <FaExclamationCircle /> {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={styles.button}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className={styles.spinner} /> Salvando...
                    </>
                  ) : (
                    "Redefinir Senha"
                  )}
                </button>

                <div className={styles.link}>
                  <p>
                    Lembrou? <Link to="/login">Voltar para o Login</Link>
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
