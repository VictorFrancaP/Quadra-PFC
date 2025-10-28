// Importando componente
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import styles from "../css/Home.module.css";
import { Link } from "react-router-dom";
import Fundo from "../assets/fundo-home.jpg";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaCommentDots,
  FaShieldAlt,
  FaClock,
} from "react-icons/fa";

export const Home = () => {
  return (
    <>
      <Header />
      <section className={styles.section}>
        <img src={Fundo} alt="Imagem de fundo de um campo de futebol" />
        <div className={styles.container}>
          <div className={styles.texts}>
            <h1>
              Encontre a quadra <br />
              <p className={styles.green}>perfeita para jogar</p>
            </h1>
            <h3>
              Descubra as quadras próximas e reserve online. Tudo <br />
              em um só lugar, de forma rápida e segura.
            </h3>
          </div>

          <div className={styles.icons}>
            <div className={styles.groupOne}>
              <img src="" alt="" />
              <div>
                <p>200+</p>
                <p>Quadras</p>
              </div>
            </div>

            <div className={styles.groupTwo}>
              <img src="" alt="" />
              <div>
                <p>5k+</p>
                <p>Jogadores</p>
              </div>
            </div>

            <div className={styles.groupTwo}>
              <img src="" alt="" />
              <div>
                <p>24h</p>
                <p>Disponível</p>
              </div>
            </div>
          </div>

          <div className={styles.buttons}>
            <Link to="/quadras-proximas">Encontrar Quadras</Link>
            <Link to="/quadras">Reservar online</Link>
          </div>
        </div>
      </section>

      <section className={styles.sectionTwo}>
        <div className={styles.textSectionTwo}>
          <h2>Por que escolher nossa plataforma?</h2>
          <p>
            A plataforma mais completa para encontrar quadras e reservar
            quadras.
          </p>
        </div>

        <div className={styles.groupGrid}>
          <div className={styles.grid}>
            <div className={styles.iconCircle}>
              <FaMapMarkerAlt size={32} />
            </div>
            <h3>Localização Inteligente</h3>
            <p>
              Encontre quadras próximas usando geolocalização. Filtre por
              distância, preço e disponibilidade.
            </p>
          </div>

          <div className={styles.grid}>
            <div className={styles.iconCircle}>
              <FaCalendarAlt size={32} />
            </div>
            <h3>Reserva Online</h3>
            <p>
              Reserve sua quadra em segundos. Escolha horário, duração e
              confirme o pagamento instantaneamente.
            </p>
          </div>

          <div className={styles.grid}>
            <div className={styles.iconCircle}>
              <FaUsers size={32} />
            </div>
            <h3>Escalação de Times</h3>
            <p>
              Monte o seu time diretamente no app. Convide amigos e organize as
              escalações para as suas partidas.
            </p>
          </div>

          <div className={styles.grid}>
            <div className={styles.iconCircle}>
              <FaCommentDots size={32} />
            </div>
            <h3>Chat Integrado</h3>
            <p>
              Converse com outros jogadores e donos de quadra. Coordene partidas
              e tire suas duvidas.
            </p>
          </div>

          <div className={styles.grid}>
            <div className={styles.iconCircle}>
              <FaShieldAlt size={32} />
            </div>
            <h3>Pagamento Seguro</h3>
            <p>
              PIX, Cartão de crédito ou débito. Todas as transações são
              protegidas e com confirmação instantanea.
            </p>
          </div>

          <div className={styles.grid}>
            <div className={styles.iconCircle}>
              <FaClock size={32} />
            </div>
            <h3>Disponibilidade 24h</h3>
            <p>
              Acesso ao app 24 horas por dia. Reserve para hoje ou programe suas
              partidas da semana.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
