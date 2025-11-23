import styles from "../css/Footer.module.css";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "../../public/logo.png";
import { useState } from "react";
import { PolicyModal } from "./PolicyModal";

type ModalContent = "termos" | "politica" | null;

export const Footer = () => {
  const ano = new Date().getFullYear();

  const [activeModal, setActiveModal] = useState<ModalContent>(null);

  const openModal = (type: ModalContent) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const getModalContent = (type: ModalContent) => {
    if (type === "termos") {
      return {
        title: "Termos de Uso",
        text: (
          <>
                        <h3>1. Termos de uso (Usuário)</h3>
            <p>
              Estes Termos de Uso (“Termos”) constituem um contrato vinculante
              entre você (“Usuário”) e a Quadra Marcada, plataforma digital que
              conecta jogadores e locadores de quadras esportivas, permitindo
              reservas, organização de partidas e interação entre os usuários.
              Ao acessar e utilizar a Plataforma, você declara que leu,
              compreendeu e concorda integralmente com os presentes Termos. Caso
              não concorde, recomendamos que não utilize a Plataforma. 1.
              Definições Para os fins destes Termos, consideram-se: •
              Plataforma: sistema disponibilizado pela Quadra Marcada por meio
              de website. • Usuário: qualquer pessoa física que se cadastre para
              utilizar os serviços da Plataforma. • Locador: pessoa física ou
              jurídica responsável pela disponibilização de quadras para locação
              dentro da Plataforma. 2. Propriedade Intelectual Todos os direitos
              relativos à Plataforma, incluindo software, banco de dados,
              interface, layout, marca, logotipo, conteúdos e funcionalidades,
              pertencem exclusivamente à Quadra Marcada. É concedida ao Usuário
              apenas uma licença de uso, pessoal, não exclusiva e
              intransferível, para utilização da Plataforma, vedada qualquer
              reprodução, distribuição ou modificação sem autorização expressa.
              3. Cadastro e Responsabilidade do Usuário 3.1. O Usuário é
              responsável por fornecer informações verdadeiras, completas e
              atualizadas no momento do cadastro. 3.2. O Usuário assume integral
              responsabilidade civil e criminal pelas informações prestadas e
              pelo uso de sua conta. 3.3. O Usuário declara estar ciente de que
              seus dados pessoais serão tratados em conformidade com a Lei nº
              13.709/2018 (LGPD) e com a Política de Privacidade da Plataforma.
              4. Comunicação e Notificações O Usuário autoriza o recebimento de
              comunicações por e-mail, SMS ou notificações via aplicativo para:
              • Confirmação de reservas; • Informações sobre alterações ou
              cancelamentos; • Divulgação de atualizações, melhorias e promoções
              da Plataforma. 5. Pagamentos 5.1. Os pagamentos referentes às
              reservas são realizados diretamente entre o Usuário e o Locador da
              quadra, por meio das plataformas de pagamento parceiras. 5.2. A
              Quadra Marcada não realiza a gestão financeira das transações, não
              sendo responsável por inadimplências, estornos ou divergências
              financeiras entre Usuário e Locador. 6. Reservas e Cancelamentos
              6.1. As políticas de reserva, alteração e cancelamento são
              definidas pelo Locador da quadra, não tendo a Quadra Marcada
              responsabilidade sobre disponibilidade, qualidade ou cumprimento
              do serviço prestado. 6.2. A Plataforma atua unicamente como
              intermediadora tecnológica entre Usuário e Locador. 7. Dados
              Pessoais e Privacidade 7.1. O uso da Plataforma exige o
              fornecimento de dados pessoais como nome, CPF, telefone, e-mail,
              endereço e informações de pagamento. 7.2. Os dados serão tratados
              em conformidade com a LGPD, garantindo confidencialidade,
              segurança e o direito do titular de acessá-los, corrigi-los ou
              solicitar sua exclusão. 7.3. Em caso de exclusão da conta, os
              dados pessoais serão excluídos em nossa base, de forma a
              impossibilitar a identificação do titular. Mantendo apenas
              informações como datas de transações e idade para fins
              profissionais. 8. Cancelamento e Encerramento de Conta A Quadra
              Marcada poderá suspender ou encerrar o acesso do Usuário em casos
              de: • Uso indevido da Plataforma; • Descumprimento destes Termos;
              • Atividades fraudulentas ou ilícitas. 9. Limitação de
              Responsabilidade 9.1. A Quadra Marcada não garante a
              disponibilidade ininterrupta da Plataforma, estando sujeita a
              falhas técnicas ou de terceiros. 9.2. A Quadra Marcada não é
              responsável pela conduta de Locadores ou Jogadores, nem pela
              qualidade, segurança ou adequação das quadras reservadas. 10.
              Disposições Finais 10.1. Estes Termos poderão ser alterados a
              qualquer tempo, sendo a versão atualizada disponibilizada na
              Plataforma. 11. Contato Para dúvidas, sugestões ou solicitações, o
              Usuário pode entrar em contato através do e-mail:
              alugueldequadrasmarcada@gmail.com
            </p>
                        <h3>2. Termos de uso (Locador)</h3>
            <p>
              Termos de Uso para Locadores – Quadra Marcada 12/2025 Por favor,
              leia atentamente todas as condições especificadas a seguir
              referentes à disponibilização e contratação dos serviços de
              locação de quadras esportivas por meio da plataforma Quadra
              Marcada, conforme abaixo descritas. Estes Termos Gerais de
              Contratação (“Termos”) complementam e fazem parte dos Termos de
              Uso da plataforma Quadra Marcada (que significa, para fins deste
              Contrato, nossa plataforma, o site), sendo aplicáveis quando o
              proprietário (“Locador”) oferece seus espaços esportivos para
              locação por meio do sistema. Portanto, estes Termos também
              constituem um contrato vinculante (“Contrato”) entre você
              (“Locador”) e a Quadra Marcada. A Plataforma poderá alterar estes
              Termos a qualquer momento, sem aviso prévio, sendo
              responsabilidade do Locador manter-se atualizado. Sempre que
              possível, a Plataforma comunicará alterações por meio do próprio
              sistema ou por e-mail cadastrado. 1. Aceite do Termo Ao cadastrar
              e disponibilizar sua quadra esportiva na Quadra Marcada, o Locador
              declara que leu, entendeu e concorda integralmente com este Termo,
              vinculando-se às suas regras e responsabilidades. 2. Uso e
              Disponibilidade das Quadras 2.1. O Locador compromete-se a
              fornecer informações corretas e atualizadas sobre suas quadras,
              incluindo: nome da quadra, tipo, capacidade, endereço, valor da
              locação, telefone, e-mail, formas de pagamento aceitas e condições
              de uso e imagens da quadra. 2.2. O Locador é responsável por
              garantir que o espaço esteja em condições adequadas de uso e em
              conformidade com normas de segurança. 2.3. A disponibilidade de
              horários deverá ser atualizada pelo Locador na plataforma.
              Reservas confirmadas não poderão ser alteradas unilateralmente sem
              comunicação prévia ao usuário. 3. Regras de Uso e
              Responsabilidades 3.1. O Locador é responsável por zelar pela
              conservação e segurança das quadras e instalações oferecidas. 3.2.
              Eventuais danos causados pelos usuários deverão ser comunicados à
              Plataforma para registro e tratativa, de modo que serão aplicadas
              internamente punições ao usuário, a Quadra Marcada não se
              responsabiliza por valores de reforma. 3.3. O Locador não poderá
              utilizar a Plataforma para fins diferentes da locação de quadras,
              incluindo, mas não se limitando, à revenda de horários, sublocação
              irregular ou atividades ilícitas. 4. Política de Cancelamento 4.1.
              O Locador poderá cancelar uma reserva confirmada apenas em casos
              de força maior (ex.: condições climáticas extremas,
              indisponibilidade estrutural). 4.2. Em caso de cancelamento, o
              Locador deverá informar imediatamente ao usuário e à Plataforma,
              que poderá intermediar a realocação do horário ou o reembolso do
              valor pago, quando aplicável. 5. Preço e Forma de Pagamento 5.1.
              Os valores de locação serão definidos pelo próprio Locador,
              observando as condições de mercado. 5.2. O pagamento poderá ser
              realizado de forma online (via intermediadores autorizados pela
              Plataforma) ou diretamente no local, conforme configurado pelo
              Locador. 5.3. Em caso de pagamento online, a Plataforma poderá
              reter taxas administrativas para manutenção e operação do sistema.
              6. Proteção de Dados 6.1. O Locador declara estar ciente de que os
              dados fornecidos serão tratados conforme a Lei nº 13.709/2018
              (LGPD), com finalidade exclusiva de operacionalizar as reservas,
              processar pagamentos e garantir a comunicação entre Locador e
              Usuários. 6.2. O Locador deverá respeitar as regras de
              confidencialidade e não poderá utilizar dados dos usuários para
              outros fins além da prestação do serviço. 7. Responsabilidade da
              Plataforma 7.1. A Plataforma atua exclusivamente como
              intermediadora digital, não sendo responsável pela efetiva
              prestação do serviço de locação ou pelas condições físicas das
              quadras. 7.2. A Plataforma se compromete a disponibilizar o
              suporte necessário para que o Locador possa anunciar e gerenciar
              suas quadras. 8. Rescisão 8.1. O descumprimento das obrigações
              previstas neste Termo poderá ensejar a exclusão do Locador da
              plataforma, sem prejuízo das medidas legais cabíveis. 9. Foro Caso
              exista algum problema ou conflito relacionado a estes Termos, o
              local responsável para resolver a questão será sempre o fórum da
              cidade onde o Usuário mora, conforme previsto pelo Código de
              Defesa do Consumidor.
            </p>
          </>
        ),
      };
    } else if (type === "politica") {
      return {
        title: "Política de Privacidade",
        text: (
          <>
                        <h3>Politica de Privacidade</h3>
            <p>
              A Quadra Marcada é uma plataforma web destinada ao aluguel de
              quadras, cujo objetivo é facilitar a organização de amistosos e a
              conexão entre jogadores e proprietários de quadras esportivas.
              Nesse contexto, como a sua privacidade é muito importante para
              nós, esta Política de Privacidade (“Política”) tem como objetivo
              informar a você, seja Visitante ou Usuário (“Você” ou “Usuário”),
              como a Quadra Marcada trata os seus Dados Pessoais, ou seja, como
              eles são coletados, utilizados, armazenados, protegidos e
              eventualmente compartilhados, em total conformidade com a Lei nº
              13.709/2018 – Lei Geral de Proteção de Dados (LGPD). O
              CONHECIMENTO E ACEITE DESTA POLÍTICA DE PRIVACIDADE É
              INDISPENSÁVEL PARA QUE VOCÊ POSSA ACESSAR A NOSSA PLATAFORMA,
              REALIZAR CADASTRO E UTILIZAR OS SERVIÇOS. CASO VOCÊ NÃO CONCORDE
              COM OS TERMOS DESTA POLÍTICA, POR FAVOR, NÃO UTILIZE A PLATAFORMA.
              1) QUAIS DADOS PESSOAIS COLETAMOS? A Quadra Marcada coleta apenas
              os dados pessoais estritamente necessários para viabilizar o uso
              da plataforma, conforme listado abaixo: • Dados cadastrais: nome,
              CPF, e-mail, telefone, data de nascimento e endereço; • Dados
              financeiros: informações sobre confirmações de pagamento para
              processar reservas; • Dados de navegação: endereço IP, cookies,
              dispositivo e geolocalização. 2) PARA QUAIS FINALIDADES UTILIZAMOS
              OS DADOS PESSOAIS? Os dados pessoais coletados são tratados para
              as seguintes finalidades: • Realizar cadastro e autenticação do
              usuário; • Permitir reservas de quadras e comunicação entre
              jogadores e locadores; • Processar confirmações de pagamentos; •
              Enviar notificações relacionadas a reservas, alterações,
              cancelamentos e promoções; • Garantir a segurança da plataforma,
              prevenir fraudes e cumprir obrigações legais. 3) COM QUEM
              COMPARTILHAMOS SEUS DADOS? Todas as informações coletadas pela
              Quadra Marcada são confidenciais. Seus dados pessoais podem ser
              compartilhados apenas nos seguintes casos: • Proprietários de
              quadras, para viabilizar a reserva; • Processadores de pagamento,
              para efetivar transações financeiras; • Serviços de suporte e
              infraestrutura tecnológica, como provedores de e-mail, hospedagem
              e monitoramento. Em nenhuma hipótese os dados pessoais coletados
              serão vendidos. O compartilhamento será sempre limitado ao
              estritamente necessário para viabilizar os serviços oferecidos. 4)
              COMO PROTEGEMOS SEUS DADOS? A Quadra Marcada adota medidas
              técnicas e organizacionais para proteger os dados pessoais contra
              acessos não autorizados, perda, destruição ou divulgação indevida.
              • Criptografia e hash de senhas; • Controle de acesso e
              autenticação; • Backups periódicos; • Monitoramento contínuo da
              infraestrutura. Ainda assim, cabe ao usuário a responsabilidade de
              manter o sigilo de seu login e senha, bem como utilizar
              dispositivos seguros ao acessar a plataforma. 5) DIREITOS DOS
              TITULARES Nos termos da LGPD, você possui os seguintes direitos: •
              Confirmar se seus dados estão sendo tratados; • Acessar, corrigir
              e atualizar seus dados pessoais; • Solicitar exclusão ou
              anonimização dos dados; • Solicitar portabilidade dos dados para
              outro serviço; • Revogar o consentimento previamente concedido.
              Caso você possua alguma dúvida de como exercer esses direitos,
              basta enviar uma mensagem ao nosso Encarregado de Proteção de
              Dados (DPO) pelo email: alugueldequadrasmarcada@gmail.com 6) USO
              DE COOKIES Utilizamos cookies para melhorar sua experiência de
              navegação, oferecer funcionalidades personalizadas e gerar
              estatísticas de uso da plataforma. O usuário poderá configurar seu
              navegador para recusar cookies, mas algumas funcionalidades podem
              ser prejudicadas. 7) TRANSFERÊNCIA INTERNACIONAL DE DADOS Caso
              haja necessidade de transferência de dados pessoais para
              servidores localizados fora do Brasil, garantimos que ela ocorrerá
              apenas para países que ofereçam grau de proteção adequado ou
              mediante observância dos requisitos legais previstos na LGPD. 8)
              ARMAZENAMENTO E PRAZO DE RETENÇÃO Os dados pessoais serão
              armazenados apenas pelo período necessário para cumprir as
              finalidades descritas nesta Política, ou enquanto houver base
              legal para tanto. Após esse período, os dados serão eliminados,
              salvo em casos de obrigação legal ou regulatória que justifique
              sua retenção. 9) ALTERAÇÕES NESTA POLÍTICA Esta Política de
              Privacidade poderá ser alterada a qualquer momento para refletir
              melhorias no serviço ou ajustes necessários ao cumprimento da
              legislação. Em caso de alterações relevantes, os usuários serão
              notificados. 10) CONTATO Em caso de dúvidas ou solicitações
              relativas à privacidade e proteção de dados, entre em contato com
              o nosso Encarregado de Proteção de Dados (DPO):
              alugueldequadrasmarcada@gmail.com
            </p>
          </>
        ),
      };
    }
    return null;
  };

  const modalProps = getModalContent(activeModal);

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.containerOne}>
          <div className={styles.group}>
            <div className={styles.brand}>
              <img src={Logo} alt="Imagem logo da plataforma" />
              <h2>Quadra Marcada</h2>
            </div>

            <p>
              A plataforma que conecta jogadores a <br /> quadras de futebol.
              Reserve, jogue e se <br /> divirta com segurança e praticidade.
            </p>

            <div className={styles.icons}>
              <FaFacebookF size={24} color="#000" />
              <FaInstagram size={24} color="#000" />
              <FaTwitter size={24} color="#000" />
            </div>
          </div>

          <div className={styles.group}>
            <div>
              <h2>Links Rápidos</h2>
            </div>
            <Link to="/">Inicio</Link>
            <Link to="/quadras">Quadras</Link>
            <Link to="/profile">Meu Perfil</Link>
            <Link to="/">Como funciona</Link>
          </div>

          <div className={styles.group}>
            <div>
              <h2>Suporte</h2>
            </div>
            <Link to="/central-ajuda">Central de Ajuda</Link>
            <Link to="/termos" onClick={openModal("termos")}>
                            Termos de Uso
            </Link>
            <Link to="/politica" onClick={openModal("politica")}>
                            Politica de Privacidade
            </Link>
            <Link to="mailto:alugueldequadrasquadramarcada@gmail.com">
              Contato
            </Link>
            <Link to="/faq">FAQ</Link>
          </div>

          <div className={styles.group}>
            <div>
              <h2>Contato</h2>
            </div>

            <div className={styles.iconContato}>
              <FaMapMarkerAlt size={24} color="#000" />
              <p>São Paulo - SP, Brasil</p>
            </div>

            <div className={styles.iconContato}>
              <MdEmail size={24} color="#000" />
              <p>alugueldequadrasmarcada@gmail.com</p>
            </div>

            <div className={styles.iconContato}>
              <FaPhoneAlt size={24} color="#000" />
              <p>(11) 91234-5678</p>
            </div>
          </div>
        </div>

        <hr />

        <div className={styles.containerTwo}>
          <div>
            <p> © {ano} Quadra Marcada. Todos os direitos reservados</p>
          </div>

          <div>
            <p className={styles.under}>Politica de Cookies</p>
            <p className={styles.under}>LGPD</p>
          </div>
        </div>
      </footer>
      {activeModal && modalProps && (
        <PolicyModal
          title={modalProps.title}
          content={modalProps.text}
          onClose={closeModal}
        />
      )}
    </>
  );
};
