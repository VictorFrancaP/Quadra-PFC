import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { api } from "../context/AuthContext";
import styles from "../css/ReportPage.module.css";
import {
  FaSpinner,
  FaExclamationCircle,
  FaChartBar,
  FaFileDownload,
  FaWallet,
} from "react-icons/fa";

interface ReportData {
  generalStats: {
    revenueTotal: number;
    revenueMonthlyNow: number;
    totalReservationConfirmed: number;
    valueReservationAverage: number;
  };
  financialSummary: {
    revenueBruta: number;
    ratePlataform: number;
    revenueLiquid: number;
  };
  detailedReservations: any[];
}

const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const OwnerReportPage = () => {
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<ReportData>("/auth/reservation/report");
        setReport(response.data);
      } catch (err: any) {
        console.error("Erro ao buscar relatório:", err.response || err);
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data ||
          "Erro ao carregar relatório.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handleDownload = () => {
    if (!report || report.detailedReservations.length === 0) {
      alert("Não há dados para baixar.");
      return;
    }

    const headers = "ID Reserva | Data | Cliente | Valor Pago | Status Pagamento\n";

    const csvRows = report.detailedReservations.map((res) => {
      const id = res.id;
      const date = new Date(res.startTime).toLocaleDateString("pt-BR");
      const clientName = res.userName?.replace(/,/g, "") || "N/A";
      const value = res.totalPrice.toFixed(2);
      const status = res.statusPayment;
      return [id, date, clientName, value, status].join(" | ");
    });

    const csvContent = headers + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "relatorio_reservas.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingMessage}>
          <FaSpinner className={styles.spinner} /> Carregando...
        </div>
      );
    }
    if (error) {
      return (
        <div className={styles.errorMessage}>
          <FaExclamationCircle /> {error}
        </div>
      );
    }
    if (!report) {
      return (
        <div className={styles.centeredMessage}>
          <p>Não foi possível gerar o relatório.</p>
        </div>
      );
    }

    const { generalStats, financialSummary } = report;

    return (
      <div className={styles.reportContainer}>
        <h2>
          <FaChartBar /> Visão Geral
        </h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h4>Receita Total (Bruta)</h4>
            <p>{formatCurrency(generalStats.revenueTotal)}</p>
          </div>
          <div className={styles.statCard}>
            <h4>Receita Mês Atual</h4>
            <p>{formatCurrency(generalStats.revenueMonthlyNow)}</p>
          </div>
          <div className={styles.statCard}>
            <h4>Total de Reservas</h4>
            <p>{generalStats.totalReservationConfirmed} reservas</p>
          </div>
          <div className={styles.statCard}>
            <h4>Valor Médio (Ticket)</h4>
            <p>{formatCurrency(generalStats.valueReservationAverage)}</p>
          </div>
        </div>
        <h2>
          <FaWallet /> Resumo Financeiro
        </h2>
        <div className={styles.summarySection}>
          <div className={styles.summaryItem}>
            <span>Receita Bruta Total</span>
            <strong>{formatCurrency(financialSummary.revenueBruta)}</strong>
          </div>
          <div className={styles.summaryItem}>
            <span>(-) Taxa da Plataforma (5%)</span>
            <strong className={styles.fee}>
              {formatCurrency(financialSummary.ratePlataform * -1)}
            </strong>
          </div>
          <hr className={styles.divider} />
          <div className={`${styles.summaryItem} ${styles.net}`}>
            <span>Receita Líquida Estimada</span>
            <strong>{formatCurrency(financialSummary.revenueLiquid)}</strong>
          </div>
        </div>
        <div className={styles.downloadSection}>
          <button
            className={styles.downloadButton}
            onClick={handleDownload}
            disabled={report.detailedReservations.length === 0}
          >
            <FaFileDownload /> Baixar Relatório Detalhado (CSV)
          </button>
          <p>Baixe um arquivo .csv com todas as reservas pagas.</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>{renderContent()}</div>
      <Footer />
    </>
  );
};
