import { useState } from "react";
import SearchBar       from "./components/SearchBar";
import MovieCard       from "./components/MovieCard";
import LoadingSkeleton from "./components/LoadingSkeleton";
import ErrorMessage    from "./components/ErrorMessage";
import useMovieData    from "./hooks/useMovieData";
import useWindowWidth  from "./hooks/useWindowWidth";

const EXAMPLES = [
  { id: "tt0133093", title: "The Matrix",      year: "1999" },
  { id: "tt0468569", title: "The Dark Knight", year: "2008" },
  { id: "tt1375666", title: "Inception",       year: "2010" },
  { id: "tt0110912", title: "Pulp Fiction",    year: "1994" },
];

export default function App() {
  const { data, loading, error, fetchMovie, reset } = useMovieData();
  const [searched, setSearched] = useState(false);
  const isMobile = useWindowWidth() < 768;

  const handleSearch = (id) => { setSearched(true); fetchMovie(id); };
  const handleRetry  = ()   => { reset(); setSearched(false); };

  return (
    <div className="grain" style={{ minHeight: "100vh", background: "#07070a", color: "#e4e4eb" }}>

      {/* Ambient orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -250, left: "50%", transform: "translateX(-50%)", width: 1000, height: 600, background: "radial-gradient(ellipse, rgba(201,153,26,0.07) 0%, transparent 68%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: -200, right: -150, width: 700, height: 700, background: "radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      {/* Shell */}
      <div style={{
        position: "relative", zIndex: 10,
        maxWidth: 1060, margin: "0 auto",
        padding: isMobile ? "0 16px" : "0 32px",
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
      }}>

        {/* HEADER */}
        <header style={{
          textAlign: "center",
          paddingTop:    searched ? (isMobile ? 28 : 44)  : (isMobile ? 56  : 108),
          paddingBottom: searched ? (isMobile ? 22 : 38)  : (isMobile ? 32  : 52),
          transition: "padding 0.65s cubic-bezier(0.16,1,0.3,1)",
        }}>
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: isMobile ? 10 : 18, marginBottom: isMobile ? 12 : 18 }}>
            <div style={{ height: 1, width: isMobile ? 24 : 52, background: "linear-gradient(90deg, transparent, rgba(201,153,26,0.5))" }} />
            <span style={{ fontSize: isMobile ? 7 : 9, color: "rgba(201,153,26,0.6)", fontFamily: "JetBrains Mono, monospace", letterSpacing: isMobile ? "0.2em" : "0.42em", textTransform: "uppercase" }}>
              AI · Cinema · Intelligence
            </span>
            <div style={{ height: 1, width: isMobile ? 24 : 52, background: "linear-gradient(90deg, rgba(201,153,26,0.5), transparent)" }} />
          </div>

          {/* Logo */}
          <h1 style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontWeight: 700,
            fontSize: searched ? (isMobile ? 36 : 54) : (isMobile ? 62 : 104),
            color: "#fff", lineHeight: 1, letterSpacing: "-0.03em", margin: 0,
            textShadow: "0 0 80px rgba(201,153,26,0.28), 0 0 160px rgba(201,153,26,0.10)",
            transition: "font-size 0.55s cubic-bezier(0.16,1,0.3,1)",
          }}>
            CineAI
          </h1>

          {!searched && (
            <p className="fade-up-2" style={{
              marginTop: isMobile ? 12 : 20,
              color: "rgba(255,255,255,0.32)",
              fontSize: isMobile ? 13 : 15,
              lineHeight: 1.7,
              maxWidth: isMobile ? 280 : 450,
              margin: `${isMobile ? 12 : 20}px auto 0`,
              fontFamily: "Inter, sans-serif", fontWeight: 300,
            }}>
              Enter any IMDb movie ID and get AI‑powered audience sentiment,
              cast details, and critical insights — instantly.
            </p>
          )}
        </header>

        {/* SEARCH */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: searched ? (isMobile ? 28 : 52) : (isMobile ? 32 : 56) }}>
          <SearchBar onSearch={handleSearch} loading={loading} isMobile={isMobile} />
        </div>

        {/* CONTENT */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 80 }}>
          {loading && <LoadingSkeleton isMobile={isMobile} />}

          {error && !loading && <ErrorMessage message={error} onRetry={handleRetry} />}

          {data && !loading && !error && (
            <MovieCard movie={data.movie} insights={data.insights} isMobile={isMobile} />
          )}

          {!searched && !loading && (
            <div className="fade-up-4" style={{ width: "100%", maxWidth: 580, textAlign: "center" }}>
              <p style={{ fontSize: 9, marginBottom: 16, color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase", letterSpacing: "0.3em" }}>
                Try a popular film
              </p>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 10 }}>
                {EXAMPLES.map(({ id, title, year }) => (
                  <ExampleTile key={id} title={title} year={year} onClick={() => handleSearch(id)} />
                ))}
              </div>
            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer style={{ padding: "14px 0", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <p style={{ fontSize: 9, color: "rgba(255,255,255,0.1)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.28em", textTransform: "uppercase" }}>
            OMDB · TMDB · GROQ LLAMA 3.3 · 70B
          </p>
        </footer>
      </div>
    </div>
  );
}

function ExampleTile({ title, year, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "14px 12px", borderRadius: 14, textAlign: "left", cursor: "pointer",
        background: hovered ? "rgba(201,153,26,0.055)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? "rgba(201,153,26,0.32)" : "rgba(255,255,255,0.07)"}`,
        transition: "all 0.22s",
      }}>
      <p style={{ color: hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.68)", fontSize: 13, fontFamily: "Inter, sans-serif", fontWeight: 500, marginBottom: 4, transition: "color 0.2s" }}>
        {title}
      </p>
      <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}>
        {year}
      </p>
    </button>
  );
}