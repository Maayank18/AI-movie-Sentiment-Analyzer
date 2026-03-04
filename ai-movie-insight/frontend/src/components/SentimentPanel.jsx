const CFG = {
  positive: { label:"Positive Reception", icon:"↑", fill:"85%", bar:"#34d399", text:"#34d399", border:"rgba(52,211,153,0.22)",  bg:"rgba(52,211,153,0.045)",  glow:"rgba(52,211,153,0.14)"  },
  mixed:    { label:"Mixed Reception",    icon:"↔", fill:"52%", bar:"#fbbf24", text:"#fbbf24", border:"rgba(251,191,36,0.22)",  bg:"rgba(251,191,36,0.045)",  glow:"rgba(251,191,36,0.14)"  },
  negative: { label:"Negative Reception", icon:"↓", fill:"18%", bar:"#fb7185", text:"#fb7185", border:"rgba(251,113,133,0.22)", bg:"rgba(251,113,133,0.045)", glow:"rgba(251,113,133,0.14)" },
};

export default function SentimentPanel({ insights, isMobile = false }) {
  if (!insights) return null;
  const { summary, classification, keyThemes = [], reviewCount } = insights;
  const c = CFG[classification] ?? CFG.mixed;

  return (
    <div className="fade-up-5" style={{
      borderRadius: isMobile ? 16 : 20,
      padding: isMobile ? "18px 16px" : "24px 26px",
      border: `1px solid ${c.border}`,
      background: c.bg,
      boxShadow: `0 0 60px ${c.glow}, 0 8px 40px rgba(0,0,0,0.35)`,
    }}>

      {/* Header */}
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: isMobile ? 10 : 0,
        marginBottom: 18,
      }}>
        <span style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase", letterSpacing: "0.22em", color: "rgba(255,255,255,0.2)" }}>
          AI Audience Sentiment
        </span>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "5px 14px", borderRadius: 100,
          border: `1px solid ${c.border}`, background: c.bg,
          alignSelf: isMobile ? "flex-start" : "auto",
        }}>
          <span style={{ color: c.text, fontSize: 14, fontWeight: 700 }}>{c.icon}</span>
          <span style={{ color: c.text, fontSize: 10, fontFamily: "JetBrains Mono, monospace", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {c.label}
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
          <span style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.18)" }}>Audience Score</span>
          <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: c.text }}>{c.fill}</span>
        </div>
        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
          <div style={{ height: "100%", width: c.fill, borderRadius: 100, background: `linear-gradient(90deg, ${c.bar}55, ${c.bar})`, transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)" }} />
        </div>
      </div>

      {/* Summary */}
      <p style={{ color: "rgba(255,255,255,0.62)", fontSize: isMobile ? 13 : 14, lineHeight: 1.78, fontFamily: "Inter, sans-serif", fontWeight: 300, marginBottom: 18 }}>
        {summary}
      </p>

      {/* Themes */}
      {keyThemes.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase", letterSpacing: "0.22em", color: "rgba(255,255,255,0.18)", marginBottom: 10 }}>
            Recurring Themes
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {keyThemes.map(t => (
              <span key={t} style={{
                fontSize: isMobile ? 11 : 12, padding: "5px 12px", borderRadius: 100,
                border: `1px solid ${c.border}`, color: c.text, opacity: 0.82,
                fontFamily: "Inter, sans-serif",
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.16)", fontFamily: "JetBrains Mono, monospace" }}>
          {reviewCount} review{reviewCount !== 1 ? "s" : ""} analysed · LLaMA 3.3 70B
        </span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.16)", fontFamily: "JetBrains Mono, monospace" }}>
          via Groq
        </span>
      </div>
    </div>
  );
}