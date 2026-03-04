import CastList, { FieldLabel } from "./CastList";
import SentimentPanel            from "./SentimentPanel";

export default function MovieCard({ movie, insights, isMobile = false }) {
  if (!movie) return null;

  return (
    <div className="fade-up" style={{ width: "100%", maxWidth: 980 }}>

      {/* Gold rule */}
      <div style={{ height: 1, width: "100%", marginBottom: isMobile ? 28 : 48, background: "linear-gradient(90deg, transparent, rgba(201,153,26,0.4), transparent)" }} />

      {/* Layout: side-by-side on desktop, stacked on mobile */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "260px 1fr",
        gap: isMobile ? 24 : 52,
        alignItems: "start",
      }}>

        {/* ── LEFT: Poster + meta ─────────────── */}
        <div className="fade-up-2" style={{
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          gap: isMobile ? 14 : 14,
          alignItems: isMobile ? "flex-start" : "stretch",
          position: isMobile ? "static" : "sticky",
          top: 24,
        }}>

          {/* Poster */}
          <div style={{
            borderRadius: 16, overflow: "hidden", position: "relative",
            flexShrink: 0,
            width: isMobile ? 120 : "100%",
            boxShadow: "0 24px 70px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.07)",
          }}>
            {movie.poster
              ? <img src={movie.poster} alt={`${movie.title} poster`}
                  style={{ width: "100%", display: "block", aspectRatio: "2/3", objectFit: "cover" }} />
              : <NoPoster title={movie.title} />
            }
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)", pointerEvents: "none" }} />
          </div>

          {/* On mobile: rating + meta sit beside poster */}
          <div style={{ flex: isMobile ? 1 : "unset", display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>

            {/* Rating */}
            {movie.rating && movie.rating !== "N/A" && (
              <div style={{
                background: "rgba(255,255,255,0.025)", borderRadius: 12,
                border: "1px solid rgba(201,153,26,0.18)",
                padding: isMobile ? "10px 14px" : "14px 18px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ background: "#f5c518", color: "#000", fontSize: 8, fontWeight: 900, fontFamily: "JetBrains Mono, monospace", padding: "2px 5px", borderRadius: 3 }}>IMDb</span>
                  <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: isMobile ? 24 : 32, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                    {movie.rating}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>/10</span>
                </div>
                {!isMobile && movie.imdbVotes && movie.imdbVotes !== "N/A" && (
                  <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}>{movie.imdbVotes}</span>
                )}
              </div>
            )}

            {/* Meta card */}
            <div style={{
              background: "rgba(255,255,255,0.02)", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.06)",
              padding: isMobile ? "12px 14px" : "18px",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              {[["Director", movie.director], ["Runtime", movie.runtime], ["Year", movie.year]].map(([label, value]) =>
                value && value !== "N/A" ? (
                  <div key={label}>
                    <FieldLabel>{label}</FieldLabel>
                    <p style={{ marginTop: 3, fontSize: isMobile ? 12 : 13, color: "rgba(255,255,255,0.72)", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                      {value}
                    </p>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Title, synopsis, cast, sentiment ── */}
        <div className="fade-up-3" style={{ display: "flex", flexDirection: "column", gap: isMobile ? 20 : 28 }}>

          {/* Title */}
          <div>
            <h2 style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: isMobile ? 36 : 58,
              fontWeight: 700, color: "#fff",
              lineHeight: 1.05, letterSpacing: "-0.02em",
              marginBottom: isMobile ? 12 : 16,
              textShadow: "0 0 60px rgba(201,153,26,0.22)",
            }}>
              {movie.title}
            </h2>
            {/* Genre chips */}
            {movie.genre && movie.genre !== "N/A" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {movie.genre.split(",").slice(0, 3).map(g => (
                  <span key={g} style={{
                    padding: isMobile ? "4px 11px" : "5px 14px",
                    borderRadius: 100,
                    fontSize: isMobile ? 10 : 11,
                    fontFamily: "JetBrains Mono, monospace",
                    background: "rgba(201,153,26,0.09)",
                    color: "#e8c44a",
                    border: "1px solid rgba(201,153,26,0.2)",
                  }}>
                    {g.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          <Divider />

          {/* Synopsis */}
          {movie.plot && movie.plot !== "N/A" && (
            <div>
              <FieldLabel>Synopsis</FieldLabel>
              <p style={{
                marginTop: 10,
                fontSize: isMobile ? 13 : 14,
                color: "rgba(255,255,255,0.55)",
                fontFamily: "Inter, sans-serif",
                lineHeight: 1.82, fontWeight: 300,
                maxWidth: isMobile ? "100%" : 520,
              }}>
                {movie.plot}
              </p>
            </div>
          )}

          {/* Cast */}
          <CastList cast={movie.cast} isMobile={isMobile} />

          <Divider />

          {/* Sentiment */}
          <SentimentPanel insights={insights} isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
}

const Divider = () => (
  <div style={{ height: 1, width: "100%", background: "rgba(255,255,255,0.06)" }} />
);

const NoPoster = ({ title }) => (
  <div style={{ aspectRatio: "2/3", background: "#111118", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
    <span style={{ fontSize: 40, opacity: 0.2 }}>🎬</span>
    <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, fontFamily: "JetBrains Mono, monospace", textAlign: "center", padding: "0 10px" }}>{title}</p>
  </div>
);