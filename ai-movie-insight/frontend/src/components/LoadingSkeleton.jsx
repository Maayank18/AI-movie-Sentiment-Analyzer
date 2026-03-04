const Sk = ({ w = "100%", h, style = {} }) => (
  <div className="sk" style={{ width: w, height: h, ...style }} />
);

export default function LoadingSkeleton({ isMobile = false }) {
  return (
    <div style={{ width: "100%", maxWidth: 980 }}>

      {/* Gold rule */}
      <div style={{ height: 1, marginBottom: isMobile ? 28 : 48, background: "linear-gradient(90deg, transparent, rgba(201,153,26,0.2), transparent)" }} />

      {/* Mirrors MovieCard layout exactly */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "260px 1fr",
        gap: isMobile ? 24 : 52,
        alignItems: "start",
      }}>

        {/* Left */}
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          gap: isMobile ? 14 : 14,
          alignItems: isMobile ? "flex-start" : "stretch",
        }}>
          <Sk style={{ aspectRatio: "2/3", width: isMobile ? 120 : "100%", flexShrink: 0, borderRadius: 16 }} />
          <div style={{ flex: isMobile ? 1 : "unset", display: "flex", flexDirection: "column", gap: 10 }}>
            <Sk h={isMobile ? 48 : 54} style={{ borderRadius: 12 }} />
            <Sk h={isMobile ? 80 : 108} style={{ borderRadius: 12 }} />
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 18 : 24 }}>
          <div>
            <Sk h={isMobile ? 40 : 58} w="72%" style={{ marginBottom: 14, borderRadius: 8 }} />
            <div style={{ display: "flex", gap: 8 }}>
              {[70, 86, 78].map(w => <Sk key={w} w={w} h={26} style={{ borderRadius: 100 }} />)}
            </div>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Sk h={13} /><Sk h={13} w="85%" /><Sk h={13} w="68%" />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[110, 130, 95, 120, 105].map((w, i) => (
              <Sk key={i} w={w} h={30} style={{ borderRadius: 100 }} />
            ))}
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />
          <Sk h={isMobile ? 200 : 220} style={{ borderRadius: isMobile ? 16 : 20 }} />
        </div>
      </div>

      {/* Status */}
      <div style={{ marginTop: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <span className="spin" style={{ fontSize: 26, color: "rgba(201,153,26,0.45)", lineHeight: 1 }}>◈</span>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.18em", textTransform: "uppercase", textAlign: "center" }}>
          Fetching movie data & running AI analysis
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {["OMDB", "TMDB", "GROQ"].map(s => (
            <span key={s} style={{ fontSize: 9, padding: "3px 12px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.22)", fontFamily: "JetBrains Mono, monospace" }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}