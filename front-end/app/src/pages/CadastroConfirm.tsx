import { useState } from "react";
import styles from "../css/CadastroConfirm.module.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IMaskInput } from "react-imask";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Popup } from "../components/Popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { api } from "../context/AuthContext";
import axios from "axios";
import { TermsModal } from "../components/TermsModal";

export const CadastroConfirm = () => {
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
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const genderOptions = ["MALE", "FEMALE", "NOTINFORM"];
  const regexCEP = /\d/g;

  const validationPassword = (password: string) => ({
    length: password.length >= 7,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[#?!@$%^&*-]/.test(password),
  });

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
      setConfirmPasswordError("A confirmação da senha é obrigatória!");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("As senhas não coincidem!");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (!acceptedTerms) {
      setPopupMessage(
        "Você deve aceitar os Termos de Uso para finalizar o cadastro."
      );
      setPopupIsVisible(true);
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const cepLimpo = cep.replace(/\D/g, "");

      const response = await api.post(`/auth/user/create-account/${token}`, {
        age,
        cep: cepLimpo,
        address,
        cpf,
        gender,
        password,
      });

      setPopupMessage(response.data.message);
      setPopupIsVisible(true);
      setAge(null);
      setCep("");
      setCpf("");
      setAddress("");
      setGender("");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setPopupMessage(err.response.data);
      setPopupIsVisible(true);
    }
  };

  const SearchCep = async () => {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      setCepError("");
      return;
    }

    setCepError("Buscando CEP...");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_VIACEP}/${cepLimpo}/json/`
      );

      if (response.data.erro) {
        setCepError("CEP não encontrado!");
        setAddress("");
        return;
      }
      setCepError("");
      const logradouro = response.data.logradouro || "";
      const bairro = response.data.bairro || "";
      const localidade = response.data.localidade || "";
      const uf = response.data.uf || "";
      const addressParts = [logradouro, bairro].filter(Boolean);
      const cityStateParts = [localidade, uf].filter(Boolean);
      let finalAddress = addressParts.join(", ");
      if (finalAddress && cityStateParts.length > 0) {
        finalAddress += ` - ${cityStateParts.join("/")}`;
      } else if (cityStateParts.length > 0) {
        finalAddress = cityStateParts.join("/");
      }

      setAddress(finalAddress);
    } catch (err: any) {
      console.error("Erro ao buscar o CEP:", err);
      setCepError("Erro ao buscar o CEP. Tente novamente.");
      setAddress("");
    }
  };

  const handleCloseTerms = () => {
    setTermsModalVisible(false);
  };

  const handleAcceptTerms = () => {
    setAcceptedTerms(true);
    setTermsModalVisible(false);
  };

  return (
    <>
      <Header />

      {termsModalVisible && (
        <TermsModal
          onAccept={handleAcceptTerms}
          onClose={handleCloseTerms}
          termsContent={`Estes Termos de Uso (“Termos”) constituem um contrato vinculante entre você
(“Usuário”) e a Quadra Marcada, plataforma digital que conecta jogadores e
locadores de quadras esportivas, permitindo reservas, organização de partidas
e interação entre os usuários.
Ao acessar e utilizar a Plataforma, você declara que leu, compreendeu e
concorda integralmente com os presentes Termos. Caso não concorde,
recomendamos que não utilize a Plataforma.
1. Definições
Para os fins destes Termos, consideram-se:
• Plataforma: sistema disponibilizado pela Quadra Marcada por meio de
website.
• Usuário: qualquer pessoa física que se cadastre para utilizar os serviços
da Plataforma.
• Locador: pessoa física ou jurídica responsável pela disponibilização de
quadras para locação dentro da Plataforma.
2. Propriedade Intelectual
Todos os direitos relativos à Plataforma, incluindo software, banco de dados,
interface, layout, marca, logotipo, conteúdos e funcionalidades, pertencem
exclusivamente à Quadra Marcada.
É concedida ao Usuário apenas uma licença de uso, pessoal, não exclusiva e
intransferível, para utilização da Plataforma, vedada qualquer reprodução,
distribuição ou modificação sem autorização expressa.
3. Cadastro e Responsabilidade do Usuário
3.1. O Usuário é responsável por fornecer informações verdadeiras, completas
e atualizadas no momento do cadastro.
3.2. O Usuário assume integral responsabilidade civil e criminal pelas
informações prestadas e pelo uso de sua conta.
3.3. O Usuário declara estar ciente de que seus dados pessoais serão tratados
em conformidade com a Lei nº 13.709/2018 (LGPD) e com a Política de
Privacidade da Plataforma.
4. Comunicação e Notificações
O Usuário autoriza o recebimento de comunicações por e-mail, SMS ou
notificações via aplicativo para:
• Confirmação de reservas;
• Informações sobre alterações ou cancelamentos;
• Divulgação de atualizações, melhorias e promoções da Plataforma.
5. Pagamentos
5.1. Os pagamentos referentes às reservas são realizados diretamente entre o
Usuário e o Locador da quadra, por meio das plataformas de pagamento
parceiras.
5.2. A Quadra Marcada não realiza a gestão financeira das transações, não
sendo responsável por inadimplências, estornos ou divergências financeiras
entre Usuário e Locador.
6. Reservas e Cancelamentos
6.1. As políticas de reserva, alteração e cancelamento são definidas pelo
Locador da quadra, não tendo a Quadra Marcada responsabilidade sobre
disponibilidade, qualidade ou cumprimento do serviço prestado.
6.2. A Plataforma atua unicamente como intermediadora tecnológica entre
Usuário e Locador.
7. Dados Pessoais e Privacidade
O uso da plataforma requer o fornecimento de dados pessoais, como nome, telefone, e-mail, CPF, endereço e informações de pagamento. Todos os dados serão tratados conforme as diretrizes da LGPD, garantindo segurança, privacidade e controle pelo titular.
8. Cancelamento e Encerramento de Conta
O Quadra Marcada poderá suspender ou encerrar o acesso do usuário em casos de:
- Uso indevido da plataforma;
- Descumprimento dos termos;
- Atividades fraudulentas ou que infrinjam leis.
Em caso de exclusão da conta, haverá uma retenção mínima dos dados do usuário por um período de 7 dias, para casos de depredação dos locais alugados, após esse período os dados serão anonimizados dentro do nosso banco de dados, impossibilitando da visualização dessas informações.
9. Limitação de Responsabilidade
9.1. A Quadra Marcada não garante a disponibilidade ininterrupta da Plataforma,
estando sujeita a falhas técnicas ou de terceiros.
9.2. A Quadra Marcada não é responsável pela conduta de Locadores ou
Jogadores, nem pela qualidade, segurança ou adequação das quadras
reservadas.
10. Disposições Finais
10.1. Estes Termos poderão ser alterados a qualquer tempo, sendo a versão
atualizada disponibilizada na Plataforma.
11. Contato
Para dúvidas, sugestões ou solicitações, o Usuário pode entrar em contato
através do e-mail:
 alugueldequadrasmarcada@gmail.com
 
 A Quadra Marcada é uma plataforma web destinada ao aluguel de quadras, cujo
objetivo é facilitar a organização de amistosos e a conexão entre jogadores e
proprietários de quadras esportivas.
Nesse contexto, como a sua privacidade é muito importante para nós, esta
Política de Privacidade (“Política”) tem como objetivo informar a você, seja
Visitante ou Usuário (“Você” ou “Usuário”), como a Quadra Marcada trata os
seus Dados Pessoais, ou seja, como eles são coletados, utilizados,
armazenados, protegidos e eventualmente compartilhados, em total
conformidade com a Lei nº 13.709/2018 – Lei Geral de Proteção de Dados
(LGPD).
O CONHECIMENTO E ACEITE DESTA POLÍTICA DE PRIVACIDADE É
INDISPENSÁVEL PARA QUE VOCÊ POSSA ACESSAR A NOSSA
PLATAFORMA, REALIZAR CADASTRO E UTILIZAR OS SERVIÇOS.
CASO VOCÊ NÃO CONCORDE COM OS TERMOS DESTA POLÍTICA, POR
FAVOR, NÃO UTILIZE A PLATAFORMA.
1) QUAIS DADOS PESSOAIS COLETAMOS?
A Quadra Marcada coleta apenas os dados pessoais estritamente necessários
para viabilizar o uso da plataforma, conforme listado abaixo:
• Dados cadastrais: nome, CPF, e-mail, telefone, data de nascimento e
endereço;
• Dados financeiros: informações sobre confirmações de pagamento para
processar reservas;
• Dados de navegação: endereço IP, cookies, dispositivo e
geolocalização.
2) PARA QUAIS FINALIDADES UTILIZAMOS OS DADOS PESSOAIS?
Os dados pessoais coletados são tratados para as seguintes finalidades:
• Realizar cadastro e autenticação do usuário;
• Permitir reservas de quadras e comunicação entre jogadores e locadores;
• Processar confirmações de pagamentos;
• Enviar notificações relacionadas a reservas, alterações, cancelamentos e
promoções;
• Garantir a segurança da plataforma, prevenir fraudes e cumprir
obrigações legais.
3) COM QUEM COMPARTILHAMOS SEUS DADOS?
Todas as informações coletadas pela Quadra Marcada são confidenciais. Seus
dados pessoais podem ser compartilhados apenas nos seguintes casos:
• Proprietários de quadras, para viabilizar a reserva;
• Processadores de pagamento, para efetivar transações financeiras;
• Serviços de suporte e infraestrutura tecnológica, como provedores de
e-mail, hospedagem e monitoramento.
Em nenhuma hipótese os dados pessoais coletados serão vendidos. O
compartilhamento será sempre limitado ao estritamente necessário para
viabilizar os serviços oferecidos.
4) COMO PROTEGEMOS SEUS DADOS?
A Quadra Marcada adota medidas técnicas e organizacionais para proteger os
dados pessoais contra acessos não autorizados, perda, destruição ou
divulgação indevida.
• Criptografia e hash de senhas;
• Controle de acesso e autenticação;
• Backups periódicos;
• Monitoramento contínuo da infraestrutura.
Ainda assim, cabe ao usuário a responsabilidade de manter o sigilo de seu login
e senha, bem como utilizar dispositivos seguros ao acessar a plataforma.
5) DIREITOS DOS TITULARES
Nos termos da LGPD, você possui os seguintes direitos:
• Confirmar se seus dados estão sendo tratados;
• Acessar, corrigir e atualizar seus dados pessoais;
• Solicitar exclusão ou anonimização dos dados;
• Solicitar portabilidade dos dados para outro serviço;
• Revogar o consentimento previamente concedido.
Caso você possua alguma dúvida de como exercer esses direitos, basta enviar
uma mensagem ao nosso Encarregado de Proteção de Dados (DPO) pelo email:
 alugueldequadrasmarcada@gmail.com
6) USO DE COOKIES
Utilizamos cookies para melhorar sua experiência de navegação, oferecer
funcionalidades personalizadas e gerar estatísticas de uso da plataforma. O
usuário poderá configurar seu navegador para recusar cookies, mas algumas
funcionalidades podem ser prejudicadas.
7) TRANSFERÊNCIA INTERNACIONAL DE DADOS
Caso haja necessidade de transferência de dados pessoais para servidores
localizados fora do Brasil, garantimos que ela ocorrerá apenas para países que
ofereçam grau de proteção adequado ou mediante observância dos requisitos
legais previstos na LGPD.
8) ARMAZENAMENTO E PRAZO DE RETENÇÃO
Os dados pessoais serão armazenados apenas pelo período de 7/10/15/30 dias, para fornecer os dados e suporte necessário aos locadores em caso de possíveis depredações do local alugado, necessário para cumprir as finalidades descritas nesta Política. Após esse período, os dados serão eliminados, salvo em casos de obrigação legal ou regulatória que justifique sua retenção.
9) ALTERAÇÕES NESTA POLÍTICA
Esta Política de Privacidade poderá ser alterada a qualquer momento para refletir
melhorias no serviço ou ajustes necessários ao cumprimento da legislação. Em
caso de alterações relevantes, os usuários serão notificados.
10) CONTATO
Em caso de dúvidas ou solicitações relativas à privacidade e proteção de dados,
entre em contato com o nosso Encarregado de Proteção de Dados (DPO):
 alugueldequadrasmarcada@gmail.com
 
 Termos de Uso para Locadores – Quadra Marcada 12/2025
Por favor, leia atentamente todas as condições especificadas a seguir referentes
à disponibilização e contratação dos serviços de locação de quadras esportivas
por meio da plataforma Quadra Marcada, conforme abaixo descritas.
Estes Termos Gerais de Contratação (“Termos”) complementam e fazem parte
dos Termos de Uso da plataforma Quadra Marcada (que significa, para fins
deste Contrato, nossa plataforma, o site), sendo aplicáveis quando o proprietário
(“Locador”) oferece seus espaços esportivos para locação por meio do sistema.
Portanto, estes Termos também constituem um contrato vinculante (“Contrato”)
entre você (“Locador”) e a Quadra Marcada.
A Plataforma poderá alterar estes Termos a qualquer momento, sem aviso
prévio, sendo responsabilidade do Locador manter-se atualizado. Sempre que
possível, a Plataforma comunicará alterações por meio do próprio sistema ou por
e-mail cadastrado.
1. Aceite do Termo
Ao cadastrar e disponibilizar sua quadra esportiva na Quadra Marcada, o
Locador declara que leu, entendeu e concorda integralmente com este Termo,
vinculando-se às suas regras e responsabilidades.
2. Uso e Disponibilidade das Quadras
2.1. O Locador compromete-se a fornecer informações corretas e atualizadas
sobre suas quadras, incluindo: nome da quadra, tipo, capacidade, endereço,
valor da locação, telefone, e-mail, formas de pagamento aceitas e condições de
uso e imagens da quadra.
2.2. O Locador é responsável por garantir que o espaço esteja em condições
adequadas de uso e em conformidade com normas de segurança.
2.3. A disponibilidade de horários deverá ser atualizada pelo Locador na
plataforma. Reservas confirmadas não poderão ser alteradas unilateralmente
sem comunicação prévia ao usuário.
3. Regras de Uso e Responsabilidades
3.1. O Locador é responsável por zelar pela conservação e segurança das
quadras e instalações oferecidas.
3.2. Eventuais danos causados pelos usuários deverão ser comunicados à
Plataforma para registro e tratativa, de modo que serão aplicadas internamente
punições ao usuário, a Quadra Marcada não se responsabiliza por valores de
reforma.
3.3. O Locador não poderá utilizar a Plataforma para fins diferentes da locação
de quadras, incluindo, mas não se limitando, à revenda de horários, sublocação
irregular ou atividades ilícitas.
4. Política de Cancelamento
4.1. O Locador poderá cancelar uma reserva confirmada apenas em casos de
força maior (ex.: condições climáticas extremas, indisponibilidade estrutural).
4.2. Em caso de cancelamento, o Locador deverá informar imediatamente ao
usuário e à Plataforma, que poderá intermediar a realocação do horário ou o
reembolso do valor pago, quando aplicável.
5. Preço e Forma de Pagamento
5.1. Os valores de locação serão definidos pelo próprio Locador, observando as
condições de mercado.
5.2. O pagamento poderá ser realizado de forma online (via intermediadores
autorizados pela Plataforma) ou diretamente no local, conforme configurado pelo
Locador.
5.3. Em caso de pagamento online, a Plataforma poderá reter taxas
administrativas para manutenção e operação do sistema.
6. Proteção de Dados
6.1. O Locador declara estar ciente de que os dados fornecidos serão tratados
conforme a Lei nº 13.709/2018 (LGPD), com finalidade exclusiva de
operacionalizar as reservas, processar pagamentos e garantir a comunicação
entre Locador e Usuários.
6.2. O Locador deverá respeitar as regras de confidencialidade e não poderá
utilizar dados dos usuários para outros fins além da prestação do serviço.
7. Responsabilidade da Plataforma
7.1. A Plataforma atua exclusivamente como intermediadora digital, não sendo
responsável pela efetiva prestação do serviço de locação ou pelas condições
físicas das quadras.
7.2. A Plataforma se compromete a disponibilizar o suporte necessário para que
o Locador possa anunciar e gerenciar suas quadras.
8. Rescisão
8.1. O descumprimento das obrigações previstas neste Termo poderá ensejar a
exclusão do Locador da plataforma, sem prejuízo das medidas legais cabíveis.
9. Foro
Caso exista algum problema ou conflito relacionado a estes Termos, o local
responsável para resolver a questão será sempre o fórum da cidade onde o
Usuário mora, conforme previsto pelo Código de Defesa do Consumidor.`}
        />
      )}

      <section className={`${styles.section} ${styles.fadeIn}`}>
        <video
          src="/video-soccer-2.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="backgroundVideo"
        />

        <div className={styles.containerForm}>
          <h2>Finalizar cadastro</h2>
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

            <div className={`${styles.groupForm} ${styles.groupForm}`}>
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
                  {passwordValidation.length ? "✅" : "❌"} No minimo 7
                  caracteres
                </li>
                <li
                  style={{ color: passwordValidation.upper ? "green" : "red" }}
                >
                  {passwordValidation.upper ? "✅" : "❌"} Uma letra maiúscula
                </li>
                <li
                  style={{ color: passwordValidation.lower ? "green" : "red" }}
                >
                  {passwordValidation.lower ? "✅" : "❌"} Uma letra minuscula
                </li>
                <li
                  style={{ color: passwordValidation.number ? "green" : "red" }}
                >
                  {passwordValidation.number ? "✅" : "❌"} Um número
                </li>
                <li
                  style={{
                    color: passwordValidation.special ? "green" : "red",
                  }}
                >
                  {passwordValidation.special ? "✅" : "❌"} Um caracter
                  especial
                </li>
              </ul>
            </div>
            <div
              className={styles.groupForm}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: "15px",
              }}
            >
              <input
                type="checkbox"
                id="terms-check"
                checked={acceptedTerms}
                required
                onChange={() => setAcceptedTerms(!acceptedTerms)}
                style={{ width: "auto", marginRight: "10px" }}
              />
              <label
                htmlFor="terms-check"
                style={{ margin: 0, fontSize: "0.9em" }}
              >
                Eu li e aceito os&nbsp;
                <span
                  onClick={() => setTermsModalVisible(true)}
                  style={{
                    color: "#28a745",
                    cursor: "pointer",
                    fontWeight: "bold",
                    textDecoration: "underline",
                  }}
                >
                  Termos de Uso, Politica de Privacidade e Termos de Locador
                </span>
              </label>
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
