import { useState } from "react";

export default function ErrorMessage({ message, onRetry }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ width: "100%", maxWidth: 420, padding: "0 4px" }}>
      <div style={{
        borderRadius: 20, padding: "40px 32px", textAlign: "center",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(251,113,133,0.18)",
        boxShadow: "0 8px 50px rgba(251,113,133,0.07)",
      }}>
        <div style={{ fontSize: 30, marginBottom: 14, opacity: 0.45 }}>⚠</div>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 600, color: "#fff", marginBottom: 10 }}>
          Something went wrong
        </h3>
        <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 14, fontFamily: "Inter, sans-serif", lineHeight: 1.7, fontWeight: 300, marginBottom: 26, wordBreak: "break-word" }}>
          {message}
        </p>
        <button onClick={onRetry}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            padding: "11px 28px", borderRadius: 12, cursor: "pointer",
            background: hovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: hovered ? "#fff" : "rgba(255,255,255,0.65)",
            fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500,
            transition: "all 0.2s",
          }}>
          ← Try Again
        </button>
      </div>
    </div>
  );
}