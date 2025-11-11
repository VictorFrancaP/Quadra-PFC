import { useEffect, useState, useRef } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Popup } from "../components/Popup";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import { ChatModal } from "../components/ChatModal";
import styles from "../css/ChatsDoProprietario.module.css";

type ChatServer = {
  id: string;
  participantIds: string[] | string;
};

type FindChatsResponse = {
  chats: ChatServer[];
  error?: string;
};

export const ChatsDoProprietario = () => {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();

  const [chats, setChats] = useState<ChatServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupIsVisible, setPopupIsVisible] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipientId, setRecipientId] = useState("");
  const [recipientName, setRecipientName] = useState("");

  const requestedRef = useRef(false);

  const toArray = (p: string[] | string): string[] =>
    Array.isArray(p)
      ? p
      : p
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

  const requestChats = () => {
    if (!socket) return;
    socket.emit("findChats", null, (res: FindChatsResponse) => {
      if (res?.error) {
        setPopupMessage(res.error);
        setPopupIsVisible(true);
        setChats([]);
      } else {
        setChats(res?.chats ?? []);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      if (!requestedRef.current) {
        requestedRef.current = true;
        requestChats();
      }
    };

    const onReconnect = () => requestChats();
    const onConnectError = () => {
      setPopupMessage("Falha ao conectar ao servidor de chat.");
      setPopupIsVisible(true);
      setLoading(false);
    };

    if (isConnected) onConnect();
    socket.on("connect", onConnect);
    socket.on("reconnect", onReconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("reconnect", onReconnect);
      socket.off("connect_error", onConnectError);
    };
  }, [socket, isConnected]);

  const openChatModal = (chat: ChatServer, index: number) => {
    const parts = toArray(chat.participantIds);
    const me = user?.id;
    const otherId = parts.find((p) => p !== me) || parts[0] || "";
    setRecipientId(otherId);
    setRecipientName(`Usuário ${index + 1}`);
    setIsModalOpen(true);
  };

  return (
    <>
      <Header />

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>Chats enviados para o proprietário</h2>
          <p className={styles.subtitle}>
            Veja as conversas iniciadas com você e acesse os detalhes.
          </p>

          {loading ? (
            <div className={styles.loadingArea}>
              <p>Carregando chats...</p>
            </div>
          ) : chats.length === 0 ? (
            <div className={styles.emptyState}>
              <span>📭 Você ainda não possui chats.</span>
            </div>
          ) : (
            <ul className={styles.chatList}>
              {chats.map((chat, index) => (
                <li key={chat.id} className={styles.chatCard}>
                  <div className={styles.chatHeader}>
                    <h3>Chat {index + 1}</h3>
                    <span>
                      {toArray(chat.participantIds).length} participantes
                    </span>
                  </div>

                  <p className={styles.participants}>
                    {toArray(chat.participantIds)
                      .filter((id) => id !== user?.id)
                      .map((_, i) => `Usuário ${i + 1}`)
                      .join(", ")}
                  </p>

                  <button
                    onClick={() => openChatModal(chat, index)}
                    className={styles.button}
                  >
                    Abrir conversa
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Footer />

      <Popup
        isOpen={popupIsVisible}
        onClose={() => setPopupIsVisible(false)}
        title="Chats"
        message={popupMessage}
      />

      <ChatModal
        key={recipientId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipientId={recipientId}
        recipientName={recipientName}
      />
    </>
  );
};
