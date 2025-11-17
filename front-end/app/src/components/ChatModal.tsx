import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaPaperPlane,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import styles from "../css/ChatModal.module.css";

interface Message {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  created_at: string;
  sender?: { name: string; profileImage?: string };
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
}

const formatTime = (dateInput: string | Date | undefined | null): string => {
  if (!dateInput) return "";
  try {
    return new Date(dateInput).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  recipientId,
  recipientName,
}) => {
  const { user: loggedInUser } = useAuth();
  const { socket, isConnected } = useSocket();
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleChatHistory = (history: Message[]) => {
      setMessages(
        history.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      );
      setIsLoadingHistory(false);
      setError(null);
    };

    const handleNewMessage = (message: Message) => {
      if (message.chatId === chatId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    const handleJoinedChat = (data: { message: string }) => {
      console.log(`[Socket] Confirmação de 'joinChat':`, data.message);
    };

    socket.on("chatHistory", handleChatHistory);
    socket.on("newMessage", handleNewMessage);
    socket.on("joinedChat", handleJoinedChat);

    return () => {
      socket.off("chatHistory", handleChatHistory);
      socket.off("newMessage", handleNewMessage);
      socket.off("joinedChat", handleJoinedChat);
    };
  }, [socket, isConnected, chatId]);

  useEffect(() => {
    if (isOpen && isConnected && socket && recipientId && loggedInUser?.id) {
      setChatId(null);
      setMessages([]);
      setIsLoadingHistory(true);
      setError(null);
      socket.emit(
        "findOrCreateChat",
        { userTwoId: recipientId },
        (response: { chatId?: string; error?: string }) => {
          if (response.error) {
            setError(response.error);
            setIsLoadingHistory(false);
          } else if (response.chatId) {
            console.log(`[ChatModal] Chat ID obtido: ${response.chatId}`);
            setChatId(response.chatId);
            socket.emit("joinChat", { chatId: response.chatId });
            socket.emit("loadHistory", { chatId: response.chatId });
          }
        }
      );
    }
  }, [isOpen, isConnected, socket, recipientId, loggedInUser?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !isConnected ||
      !socket ||
      !chatId ||
      !newMessage.trim() ||
      !recipientId ||
      !loggedInUser
    )
      return;

    setIsSending(true);
    const content = newMessage.trim();

    socket.emit("sendMessage", {
      receiverId: recipientId,
      content: content,
    });

    setNewMessage("");
    setIsSending(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.chatModal}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className={styles.modalHeader}>
                            <h3>Chat com {recipientName || "Desconhecido"}</h3> 
              <button
                onClick={onClose}
                className={styles.closeButton}
                title="Fechar Chat"
              >
                                <FaTimes />
              </button>
            </div>
            <div className={styles.messagesContainer}>
              {isLoadingHistory && (
                <div className={styles.loadingMessages}>
                                    <FaSpinner className={styles.spinner} />
                  Carregando...    
                </div>
              )}
              {error && (
                <div className={styles.errorMessage}>
                                    <FaExclamationCircle /> {error}             
                </div>
              )}
              {!isLoadingHistory && messages.length === 0 && !error && (
                <div className={styles.noMessages}>
                                    Sem mensagens. Envie a primeira!            
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.messageBubble} ${
                    msg.senderId === loggedInUser?.id
                      ? styles.myMessage
                      : styles.theirMessage
                  }`}
                >
                                    <p>{msg.content}</p> 
                  <span className={styles.timestamp}>
                                        {formatTime(msg.created_at)}           
                  </span>
                </div>
              ))}
                            <div ref={messagesEndRef} /> 
            </div>
            <form onSubmit={handleSendMessage} className={styles.inputArea}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                disabled={isSending || isLoadingHistory || !chatId || !!error}
              />
              <button
                type="submit"
                disabled={
                  isSending ||
                  isLoadingHistory ||
                  !chatId ||
                  !newMessage.trim() ||
                  !!error
                }
              >
                {isSending ? (
                  <FaSpinner className={styles.spinner} />
                ) : (
                  <FaPaperPlane />
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
