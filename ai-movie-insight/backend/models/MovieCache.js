import mongoose from "mongoose";

/**
 * Persists full movie insight responses keyed by IMDb ID.
 *
 * TTL Strategy:
 *   The `cachedAt` field has a MongoDB TTL index of 7 days.
 *   MongoDB's background job auto-deletes stale documents.
 *   This keeps API usage low and data reasonably fresh.
 */
const movieCacheSchema = new mongoose.Schema(
  {
    // ── Primary Key ───────────────────────────────────────────
    imdbId: {
      type: String,
      required: [true, "IMDb ID is required"],
      unique: true,
      index: true,
      trim: true,
      match: [/^tt\d{7,8}$/, "Invalid IMDb ID format"],
    },

    // ── Movie Metadata (from OMDB) ────────────────────────────
    movie: {
      title:     { type: String, required: true },
      year:      { type: String },
      rating:    { type: String },   // e.g. "8.7"
      plot:      { type: String },
      poster:    { type: String },   // full image URL or null
      genre:     { type: String },
      director:  { type: String },
      runtime:   { type: String },
      imdbVotes: { type: String },
      cast:      [{ type: String }], // ["Keanu Reeves", "Laurence Fishburne", ...]
    },

    // ── AI Insights (from Groq / LLaMA) ──────────────────────
    insights: {
      summary:        { type: String },
      classification: {
        type: String,
        enum: ["positive", "mixed", "negative"],
        default: "mixed",
      },
      keyThemes:   [{ type: String }],
      reviewCount: { type: Number, default: 0 },
    },

    // ── TTL Field — auto-delete after 7 days ──────────────────
    cachedAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 7, // 604800 seconds = 7 days
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt automatically
  }
);

const MovieCache = mongoose.model("MovieCache", movieCacheSchema);

export default MovieCache;