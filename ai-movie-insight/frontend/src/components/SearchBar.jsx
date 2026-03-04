import { useState } from "react";

const IMDB_REGEX = /^tt\d{7,8}$/;

export default function SearchBar({ onSearch, loading, isMobile = false }) {
  const [val,     setVal]     = useState("");
  const [err,     setErr]     = useState("");
  const [focused, setFocused] = useState(false);

  const submit = () => {
    const v = val.trim();
    if (!v)                  return setErr("Please enter an IMDb ID.");
    if (!IMDB_REGEX.test(v)) return setErr("Format: tt + 7–8 digits · e.g. tt0133093");
    setErr(""); onSearch(v);
  };

  return (
    <div style={{ width: "100%", maxWidth: isMobile ? "100%" : 580 }}>

      {/* Input row */}
      <div className="search-input" style={{
        display: "flex", alignItems: "center",
        background: "#101018",
        border: `1px solid ${focused ? "rgba(201,153,26,0.5)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: isMobile ? 14 : 16,
        overflow: "hidden",
        transition: "border-color 0.25s, box-shadow 0.25s",
      }}>
        {/* IMDb badge */}
        <div style={{ padding: isMobile ? "0 10px" : "0 14px", flexShrink: 0 }}>
          <span style={{ background: "#f5c518", color: "#000", fontSize: 9, fontWeight: 900, fontFamily: "JetBrains Mono, monospace", padding: "2px 6px", borderRadius: 4, letterSpacing: "0.04em" }}>
            IMDb
          </span>
        </div>

        {/* Separator */}
        <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />

        {/* Input */}
        <input
          value={val}
          onChange={e => { setVal(e.target.value); if (err) setErr(""); }}
          onKeyDown={e => e.key === "Enter" && submit()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={isMobile ? "tt0133093" : "tt0133093"}
          spellCheck={false}
          disabled={loading}
          style={{
            flex: 1, minWidth: 0,
            padding: isMobile ? "15px 10px" : "17px 14px",
            background: "transparent", border: "none", outline: "none",
            color: "#e4e4eb",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: isMobile ? 14 : 15,
            caretColor: "#c9991a",
            opacity: loading ? 0.5 : 1,
          }}
        />

        {/* Button */}
        <button onClick={submit} disabled={loading} style={{
          margin: 6,
          padding: isMobile ? "10px 14px" : "11px 22px",
          background: loading ? "rgba(201,153,26,0.4)" : "linear-gradient(135deg,#b8880f,#e0b830)",
          border: "none", borderRadius: 12,
          color: "#0a0a0f",
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: isMobile ? 12 : 13,
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", gap: 6,
          whiteSpace: "nowrap", flexShrink: 0,
          transition: "opacity 0.2s",
        }}>
          {loading
            ? <><SpinIcon /> {isMobile ? "…" : "Analysing…"}</>
            : <><SearchIcon /> {isMobile ? "Go" : "Analyse Film"}</>
          }
        </button>
      </div>

      {/* Error / hint */}
      <div style={{ height: 22, marginTop: 8, textAlign: "center" }}>
        {err
          ? <p style={{ color: "#f87171", fontSize: 12, fontFamily: "Inter, sans-serif" }}>⚠ {err}</p>
          : <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
              Find IDs at{" "}
              <a href="https://www.imdb.com" target="_blank" rel="noopener noreferrer"
                style={{ color: "rgba(201,153,26,0.6)", textDecoration: "underline", textUnderlineOffset: 3 }}>
                imdb.com
              </a>
              {" "}— look for tt… in the URL
            </p>
        }
      </div>
    </div>
  );
}

const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const SpinIcon = () => (
  <svg className="spin-fast" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);