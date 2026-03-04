export default function CastList({ cast, isMobile = false }) {
  if (!cast?.length) return null;
  return (
    <div>
      <FieldLabel>Cast</FieldLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
        {cast.map((actor, i) => (
          <span key={actor} style={{
            padding: isMobile ? "5px 11px" : "6px 14px",
            borderRadius: 100,
            fontSize: isMobile ? 12 : 13,
            fontFamily: "Inter, sans-serif",
            display: "flex", alignItems: "center", gap: 5,
            background: i === 0 ? "rgba(201,153,26,0.1)"  : "rgba(255,255,255,0.04)",
            color:      i === 0 ? "#e8c44a"                : "rgba(255,255,255,0.55)",
            border:     `1px solid ${i === 0 ? "rgba(201,153,26,0.25)" : "rgba(255,255,255,0.07)"}`,
          }}>
            {i === 0 && <span style={{ fontSize: 9, color: "#c9991a" }}>★</span>}
            {actor}
          </span>
        ))}
      </div>
    </div>
  );
}

export const FieldLabel = ({ children }) => (
  <p style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase", letterSpacing: "0.22em", color: "rgba(255,255,255,0.22)" }}>
    {children}
  </p>
);