import { useState } from "react";
import React from "react";

interface TermsModalProps {
  onAccept: () => void;
  onClose: () => void;
  termsContent: string;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  onAccept,
  onClose,
  termsContent,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const modalStyles: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };
  const contentStyles: React.CSSProperties = {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    maxWidth: "90%",
    width: "500px",
    maxHeight: "85vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div style={modalStyles}>
      <div style={contentStyles}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <h2>Termos de Serviço e Politica de Privacidade</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5em",
              cursor: "pointer",
              color: "#333",
            }}
          >
            &times;
          </button>
        </div>
        <div
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            height: "300px",
            overflowY: "scroll",
            marginTop: "15px",
            marginBottom: "15px",
          }}
        >
          <p style={{ fontWeight: "bold" }}>
            Leia atentamente os termos e condições:
          </p>
          {termsContent.split("\n").map((line, index) => (
            <p key={index} style={{ margin: "8px 0", fontSize: "0.9em" }}>
              {line}
            </p>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <label>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              style={{ marginRight: "8px" }}
            />
            Declaro que li, entendi e concordo com os Termos acima.
          </label>
          <button
            onClick={onAccept}
            disabled={!isChecked}
            style={{
              padding: "10px 15px",
              backgroundColor: isChecked ? "#28a745" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: isChecked ? "pointer" : "not-allowed",
              fontWeight: "600",
            }}
          >
            Continuar e Aceitar
          </button>
        </div>
      </div>
    </div>
  );
};
