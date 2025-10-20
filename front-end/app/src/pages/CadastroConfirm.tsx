// Importando useState para validação de dados
import { useState } from "react";

// Importando styles para estilização com css
import styles from "../css/CadastroConfirm.module.css";

// Importando useParams para recuperar o token de validação de e-mail
import { useParams } from "react-router-dom";

// Importando useNavigate para navegação entre páginas
import { useNavigate } from "react-router-dom";

// Importando mascara para inputs
import { IMaskInput } from "react-imask";

// Importando componentes
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Popup } from "../components/Popup";

// Importando icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// Importando axios para requisição da API
import axios from "axios";

// exportando pagina
export const CadastroConfirm = () => {
  // atributos
  const { token } = useParams();
  const [age, setAge] = useState<number | null>(null);
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");
  const [cpf, setCpf] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupIsVisible, setPopupIsVisible] = useState(false);
  const [ageError, setAgeError] = useState("");
  const [cepError, setCepError] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // array genero
  const genderOptions = ["MALE", "FEMALE", "NOTINFORM"];

  // regex para o cep
  const regexCEP = /\d/g;

  // validando senha
  const validationPassword = (password: string) => ({
    length: password.length >= 7,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[#?!@$%^&*-]/.test(password),
  });

  // validando dados
  const validate = () => {
    let isValid = true;

    const validations = validationPassword(password);
    setPasswordValidation(validations);
    const isPasswordValid = Object.values(validations).every(Boolean);

    if (age === null) {
      setAgeError("A idade é obrigatória!");
      isValid = false;
    } else if (age < 13) {
      setAgeError("A idade mínima para cadastrar é 13 anos!");
      isValid = false;
    } else {
      setAgeError("");
    }

    if (!cep) {
      setCepError("O CEP é obrigatório!");
      isValid = false;
    } else if (!regexCEP.test(cep)) {
      setCepError("O CEP deve conter apenas números");
      isValid = false;
    } else {
      setCepError("");
    }

    if (!cpf) {
      setCpfError("O CPF é obrigatório!");
      isValid = false;
    } else {
      setCpfError("");
    }

    if (!gender) {
      setGenderError("O gênero é obrigatório!");
      isValid = false;
    } else if (!genderOptions.includes(gender)) {
      setGenderError("Selecione um gênero válido!");
      isValid = false;
    } else {
      setGenderError("");
    }

    if (!password) {
      setPasswordError("A senha é obrigatória!");
      isValid = false;
    } else if (!isPasswordValid) {
      setPasswordError("A senha deve conter os requisitos abaixo!");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPassword("A confirmação a senha é obrigatória!");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("As senhas não coincidem!");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const cepLimpo = cep.replace(/\D/g, "");

      const response = await axios.post(
        `${import.meta.env.VITE_CADASTRO}/${token}`,
        {
          age,
          cep: cepLimpo,
          address,
          cpf,
          gender,
          password,
        }
      );

      setPopupMessage(response.data.message);
      setPopupIsVisible(true);
      setAge(null);
      setCep("");
      setAddress("");
      setGender("");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setPopupMessage(err.response.data.message);
      setPopupIsVisible(true);
    }
  };

  const SearchCep = async () => {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length > 8) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_VIACEP}/${cepLimpo}/json/`
      );

      if (response.data.erro) {
        setCepError("CEP não encontrado!");
        setAddress("");
      }

      setCepError("");
      const address = `${response.data.logradouro}, ${response.data.bairro} - ${response.data.localidade}/${response.data.uf}`;
      setAddress(address);
    } catch (err: any) {}
  };

  return (
    <>
      <Header />
      <section className={`${styles.sectionCadastro} ${styles.fadeIn}`}>
        <video
          src="/video-soccer-2.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="backgroundVideo"
        />

        <div className={styles.containerForm}>
          <h1>Finalizar cadastro</h1>
          <p>Encontre as melhoras reservas de quadras da sua região</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.groupForm}>
              <label htmlFor="age">Idade</label>
              <input
                type="number"
                value={age !== null ? age : ""}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setAge(null);
                  }
                  setAge(e.target.valueAsNumber);
                }}
                placeholder="Sua idade"
                style={{ borderColor: ageError ? "red" : "#ccc" }}
              />
              {ageError && <span className={styles.error}>{ageError}</span>}
            </div>

            <div className={styles.groupForm}>
              <label htmlFor="cep">CEP</label>
              <IMaskInput
                mask="00000-000"
                value={cep}
                onAccept={(value) => setCep(value)}
                placeholder="Seu CEP"
                onBlur={SearchCep}
                style={{ borderColor: cepError ? "red" : "#ccc" }}
              />
              {cepError && <span className={styles.error}>{cepError}</span>}
            </div>

            <div className={styles.groupForm}>
              <label htmlFor="address">Endereço</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Endereço"
                readOnly
              />
            </div>

            <div className={styles.groupForm}>
              <label htmlFor="cpf">CPF</label>
              <IMaskInput
                mask="000.000.000-00"
                value={cpf}
                onAccept={(value) => setCpf(value)}
                placeholder="Seu CPF"
                style={{ borderColor: cpfError ? "red" : "#ccc" }}
              />
              {cpfError && <span className={styles.error}>{cpfError}</span>}
            </div>

            <div className={styles.groupForm}>
              <label htmlFor="gender">Gênero</label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{ borderColor: genderError ? "red" : "#ccc" }}
              >
                <option value="">Selecione um gênero</option>
                <option value="MALE">Masculino</option>
                <option value="FEMALE">Feminimo</option>
                <option value="NOTINFORM">Prefiro não informar</option>
              </select>
              {genderError && (
                <span className={styles.error}>{genderError}</span>
              )}
            </div>

            <div className={styles.groupForm}>
              <label htmlFor="password">Senha</label>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    const passwordChange = e.target.value;
                    setPassword(passwordChange);
                    setPasswordValidation(validationPassword(passwordChange));
                  }}
                  placeholder="Sua senha"
                  style={{ borderColor: passwordError ? "red" : "#ccc" }}
                />
                <span
                  className={styles.passwordSpan}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              {passwordError && (
                <span className={styles.error}>{passwordError}</span>
              )}
            </div>

            <div className={styles.groupForm}>
              <label htmlFor="confirm-password">Confirmar senha</label>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    const passwordChange = e.target.value;
                    setConfirmPassword(passwordChange);
                    setPasswordValidation(validationPassword(passwordChange));
                  }}
                  placeholder="Confirme sua senha"
                  style={{ borderColor: confirmPasswordError ? "red" : "#ccc" }}
                />
                <span
                  className={styles.passwordSpan}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              {confirmPasswordError && (
                <span className={styles.error}>{confirmPasswordError}</span>
              )}
            </div>

            <div className={styles.containerSenha}>
              <p>A senha deve conter</p>

              <ul className={styles.passwordCheck}>
                <li
                  style={{ color: passwordValidation.length ? "green" : "red" }}
                >
                  {passwordValidation.length ? "✔️" : "❌"} No minimo 7
                  caracteres
                </li>

                <li
                  style={{ color: passwordValidation.upper ? "green" : "red" }}
                >
                  {passwordValidation.upper ? "✔️" : "❌"} Uma letra maiúscula
                </li>

                <li
                  style={{ color: passwordValidation.lower ? "green" : "red" }}
                >
                  {passwordValidation.lower ? "✔️" : "❌"} Uma letra minuscula
                </li>

                <li
                  style={{ color: passwordValidation.number ? "green" : "red" }}
                >
                  {passwordValidation.number ? "✔️" : "❌"} Um número
                </li>

                <li
                  style={{
                    color: passwordValidation.special ? "green" : "red",
                  }}
                >
                  {passwordValidation.special ? "✔️" : "❌"} Um caracter
                  especial
                </li>
              </ul>
            </div>

            <button type="submit" className={styles.button}>
              Finalizar Cadastro
            </button>
          </form>
        </div>
      </section>
      <Footer />

      <Popup
        isOpen={popupIsVisible}
        onClose={() => setPopupIsVisible(false)}
        title="Finalizar cadastro"
        message={popupMessage}
      />
    </>
  );
};
