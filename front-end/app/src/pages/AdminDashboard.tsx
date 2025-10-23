import { useState, useEffect } from "react";
// Importa Header/Footer e Auth context/API
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { api } from "../context/AuthContext";
import styles from "../css/Admin.module.css";
import { FaSearch, FaTimes } from "react-icons/fa";

interface DisplayUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const maskEmail = (email: string | undefined): string => {
  if (!email) return "N/A";
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return "Email inválido";
  const maskedLocal =
    localPart.length <= 3
      ? localPart.substring(0, 1) + "***"
      : localPart.substring(0, 2) + "***";
  const domainParts = domain.split(".");
  const maskedDomainName =
    domainParts[0].length <= 2
      ? domainParts[0].substring(0, 1) + "***"
      : domainParts[0].substring(0, 2) + "***";
  const tld =
    domainParts.length > 1 ? "." + domainParts[domainParts.length - 1] : "";
  return `${maskedLocal}@${maskedDomainName}${tld}`;
};

const formatRole = (role: string | undefined): string => {
  if (!role) return "Usuário";
  const upperCaseRole = role.toUpperCase();
  if (upperCaseRole === "ADMIN") return "Admin";
  if (upperCaseRole === "OWNER") return "Dono";
  return "Usuário";
};

export const AdminDashboard = () => {
  const [allUsers, setAllUsers] = useState<DisplayUser[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<
    DisplayUser | null | undefined
  >(undefined);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      setIsLoadingList(true);
      try {
        const response = await api.get("/auth/user/all");
        setAllUsers(response.data.users || response.data);
        setListError(null);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data ||
          "Erro ao buscar usuários.";
        setListError(errorMessage);
      } finally {
        setIsLoadingList(false);
      }
    };
    fetchAllUsers();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchError("Por favor, digite um email para buscar.");
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchResult(undefined);

    try {
      const response = await api.post("/auth/user/find", { email: searchTerm });

      if (response.data.user) {
        setSearchResult(response.data.user);
      } else {
        setSearchResult(null);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Erro ao buscar usuário.";
      if (
        err.response?.status === 404 ||
        errorMessage.toLowerCase().includes("não encontrado")
      ) {
        setSearchResult(null);
      } else {
        setSearchError(errorMessage);

        setSearchResult(undefined);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResult(undefined);
    setSearchError(null);
  };

  const usersToDisplay =
    searchResult !== undefined
      ? searchResult
        ? [searchResult]
        : []
      : allUsers;
  const isDisplayingSearchResult = searchResult !== undefined;

  return (
    <>
      <Header />
      <div className={styles.dashboardContainer}>
        <h1>Painel Administrativo</h1>
        <section className={styles.searchSection}>
          <h2>Buscar usuário por e-mail</h2>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="email"
              placeholder="Digite o email completo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              required
              className={styles.searchInput}
            />
            <button
              type="submit"
              disabled={isSearching}
              className={styles.searchButton}
            >
              {isSearching ? (
                "Buscando..."
              ) : (
                <>
                  <FaSearch /> Buscar
                </>
              )}
            </button>
            {(searchTerm || isDisplayingSearchResult) && (
              <button
                type="button"
                onClick={clearSearch}
                className={styles.clearButton}
                title="Limpar Busca"
              >
                <FaTimes />
              </button>
            )}
          </form>
          {searchError && (
            <p className={`${styles.error} ${styles.searchError}`}>
              {searchError}
            </p>
          )}
        </section>
        {listError && !isDisplayingSearchResult && (
          <p className={styles.error}>{listError}</p>
        )}
        {isLoadingList && !isDisplayingSearchResult && (
          <p>Carregando lista de usuários...</p>
        )}
        {!isLoadingList && !listError && (
          <section className={styles.userListSection}>
            <h2>
              {isDisplayingSearchResult
                ? "Resultado da Busca"
                : "Lista de Usuários"}
            </h2>
            {usersToDisplay.length === 0 && !isSearching && (
              <p>
                {isDisplayingSearchResult
                  ? "Nenhum usuário encontrado com este email."
                  : "Nenhum usuário cadastrado."}
              </p>
            )}
            {usersToDisplay.length > 0 && (
              <table className={styles.userTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Nível</th>
                  </tr>
                </thead>
                <tbody>
                  {usersToDisplay.map((u) => (
                    <tr key={u.id}>
                      <td title={u.id}>{u.id.substring(0, 8)}...</td>
                      <td>{u.name}</td>
                      <td>{maskEmail(u.email)}</td>
                      <td>{formatRole(u.role)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}
      </div>
      <Footer />
    </>
  );
};
