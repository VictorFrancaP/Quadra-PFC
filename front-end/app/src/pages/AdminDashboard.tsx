import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { api } from "../context/AuthContext";
import { Popup } from "../components/Popup";
import styles from "../css/Admin.module.css";
import {
  FaSearch,
  FaTimes,
  FaCheck,
  FaBan,
  FaSpinner,
  FaUserCog,
} from "react-icons/fa";

interface DisplayUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface OrderData {
  id: string;
  localName: string;
  description: string;
  cnpj: string;
  fone: string;
  status: "PENDING" | "APPROVED" | "DENIED";
  userId: string;
}

type ActiveTab = "users" | "orders";

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
  if (upperCaseRole === "OWNER") return "Proprietário";
  return "Usuário";
};

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("users");
  const [allUsers, setAllUsers] = useState<DisplayUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<
    DisplayUser | null | undefined
  >(undefined);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [popupInfo, setPopupInfo] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isError: boolean;
  }>({ isOpen: false, title: "", message: "", isError: false });

  useEffect(() => {
    const fetchAllUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await api.get("/auth/user/all");
        setAllUsers(response.data.users || response.data || []);
        setUsersError(null);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data ||
          "Erro ao buscar usuários.";
        setUsersError(errorMessage);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoadingOrders(true);
      setOrdersError(null);
      try {
        const response = await api.get("/auth/order/findAll");
        setOrders(response.data.orders || response.data || []);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data ||
          "Erro ao buscar solicitações.";
        setOrdersError(errorMessage);
      } finally {
        setIsLoadingOrders(false);
      }
    };
    if (
      activeTab === "orders" &&
      orders.length === 0 &&
      !ordersError &&
      !isLoadingOrders
    ) {
      fetchOrders();
    }
  }, [activeTab, orders.length, ordersError, isLoadingOrders]);

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
      setSearchResult(response.data.user || null);
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

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: "APPROVED" | "DENIED"
  ) => {
    setUpdatingOrderId(orderId);
    setOrdersError(null);
    closePopup();
    try {
      await api.put(`/auth/order/update/${orderId}`, { newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      showPopup(
        "Sucesso",
        `Solicitação ${
          newStatus === "APPROVED" ? "aprovada" : "rejeitada"
        } com sucesso.`
      );
    } catch (err: any) {
      console.error(
        `Erro ao ${newStatus === "APPROVED" ? "aprovar" : "rejeitar"}:`,
        err.response
      );
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        `Erro ao ${newStatus === "APPROVED" ? "aprovar" : "rejeitar"}.`;
      showPopup("Erro", errorMessage, true);
      setOrdersError(errorMessage);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleMakeOwner = async (userId: string) => {
    setUpdatingUserId(userId);
    setUsersError(null);
    closePopup();
    try {
      await api.put(`/auth/user/updateRole/${userId}`, { newRole: "OWNER" });
      const updateUserState = (userList: DisplayUser[]) =>
        userList.map((u) => (u.id === userId ? { ...u, role: "OWNER" } : u));
      setAllUsers(updateUserState);
      if (searchResult?.id === userId) {
        setSearchResult((prev) => (prev ? { ...prev, role: "OWNER" } : null));
      }
      showPopup(
        "Sucesso",
        "Permissão do usuário atualizada para Proprietário."
      );
    } catch (err: any) {
      console.error("Erro ao atualizar role:", err.response);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Erro ao atualizar permissão.";
      showPopup("Erro", errorMessage, true);
      setUsersError(errorMessage);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const showPopup = (
    title: string,
    message: string,
    isError: boolean = false
  ) => {
    setPopupInfo({ isOpen: true, title, message, isError });
  };
  const closePopup = () => {
    setPopupInfo({ ...popupInfo, isOpen: false });
  };

  const usersToDisplay =
    searchResult !== undefined
      ? searchResult
        ? [searchResult]
        : []
      : allUsers;
  const isDisplayingSearchResult = searchResult !== undefined;

  const renderActiveTabContent = () => {
    if (activeTab === "users") {
      return (
        <>
          <section className={styles.searchSection}>
            <h2>Buscar Usuário por Email</h2>
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

          {usersError && !isDisplayingSearchResult && (
            <p className={styles.error}>{usersError}</p>
          )}
          {isLoadingUsers && !isDisplayingSearchResult && (
            <p>Carregando lista de usuários...</p>
          )}

          {!isLoadingUsers && !usersError && (
            <section className={styles.userListSection}>
              <h2>
                {isDisplayingSearchResult
                  ? "Resultado da Busca"
                  : "Lista de Usuários"}
              </h2>
              {usersToDisplay.length === 0 && !isSearching ? (
                <p>
                  {isDisplayingSearchResult
                    ? "Nenhum usuário encontrado com este email."
                    : "Nenhum usuário cadastrado."}
                </p>
              ) : (
                <table className={styles.userTable}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Email (Mascarado)</th>
                      <th>Nível</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersToDisplay.map((u) => {
                      const canBeMadeOwner =
                        u?.role?.toUpperCase() !== "ADMIN" &&
                        u?.role?.toUpperCase() !== "OWNER";
                      return (
                        <tr key={u?.id ?? Math.random()}>
                          <td title={u?.id ?? "ID Indefinido"}>
                            {u?.id?.substring(0, 8) ?? "N/A"}...
                          </td>
                          <td>{u?.name ?? "N/A"}</td>
                          <td>{maskEmail(u?.email)}</td>
                          <td>{formatRole(u?.role)}</td>
                          <td className={styles.userActions}>
                            {canBeMadeOwner ? (
                              <button
                                className={styles.makeOwnerButton}
                                onClick={() => handleMakeOwner(u.id)}
                                disabled={updatingUserId === u.id}
                                title="Tornar Proprietário"
                              >
                                {updatingUserId === u.id ? (
                                  <FaSpinner className={styles.spinner} />
                                ) : (
                                  <FaUserCog />
                                )}
                              </button>
                            ) : (
                              <span>-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </section>
          )}
        </>
      );
    }
    else if (activeTab === "orders") {
      return (
        <>
          {isLoadingOrders && <p>Carregando solicitações...</p>}
          {ordersError && <p className={styles.error}>{ordersError}</p>}
          {!isLoadingOrders && !ordersError && (
            <section className={styles.orderListSection}>
              <h2>Gerenciar Solicitações de Proprietário</h2>
              {orders.length === 0 ? (
                <p>Nenhuma solicitação encontrada.</p>
              ) : (
                <table className={styles.orderTable}>
                  <thead>
                    <tr>
                      <th>ID Solic.</th>
                      <th>Nome Local</th>
                      <th>CNPJ</th>
                      <th>Telefone</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order?.id ?? Math.random()}>
                        <td title={order?.id ?? "ID Indefinido"}>
                          {order?.id?.substring(0, 8) ?? "N/A"}...
                        </td>
                        <td>{order?.localName ?? "N/A"}</td>
                        <td>{order?.cnpj ?? "N/A"}</td>
                        <td>{order?.fone ?? "N/A"}</td>
                        <td>
                          <span
                            className={`${styles.status} ${
                              styles[`status${order?.status}`]
                            }`}
                          >
                            {order?.status === "PENDING"
                              ? "Pendente"
                              : order?.status === "APPROVED"
                              ? "Aprovada"
                              : "Rejeitada"}
                          </span>
                        </td>
                        <td className={styles.orderActions}>
                          {order?.status === "PENDING" ? (
                            <>
                              <button
                                className={styles.approveButton}
                                onClick={() =>
                                  handleUpdateStatus(order.id, "APPROVED")
                                }
                                disabled={updatingOrderId === order.id}
                              >
                                {updatingOrderId === order.id ? (
                                  <FaSpinner className={styles.spinner} />
                                ) : (
                                  <FaCheck />
                                )}{" "}
                                Aprovar
                              </button>
                              <button
                                className={styles.rejectButton}
                                onClick={() =>
                                  handleUpdateStatus(order.id, "DENIED")
                                }
                                disabled={updatingOrderId === order.id}
                              >
                                {updatingOrderId === order.id ? (
                                  <FaSpinner className={styles.spinner} />
                                ) : (
                                  <FaBan />
                                )}{" "}
                                Rejeitar
                              </button>
                            </>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <>
      <Header />
      <div className={styles.dashboardContainer}>
        <h1>Painel Administrativo</h1>
        <div className={styles.tabSelector}>
          <button
            onClick={() => setActiveTab("users")}
            className={activeTab === "users" ? styles.activeTab : ""}
          >
            Gerenciar Usuários
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={activeTab === "orders" ? styles.activeTab : ""}
          >
            Gerenciar Solicitações
          </button>
        </div>
        {renderActiveTabContent()}
      </div>
      <Footer />
      <Popup
        isOpen={popupInfo.isOpen}
        onClose={closePopup}
        title={popupInfo.title}
        message={popupInfo.message}
      />
    </>
  );
};
