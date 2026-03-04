import MovieCache from "../models/MovieCache.js";
import { fetchMovieDetails } from "../services/omdbService.js";
import { fetchReviews }      from "../services/tmdbService.js";
import { analyzeReviews }    from "../services/groqService.js";

export const getMovieInsights = async (req, res, next) => {
  try {
    const { imdbId } = req.params;

    const IMDB_REGEX = /^tt\d{7,8}$/;
    if (!IMDB_REGEX.test(imdbId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid IMDb ID. Expected format: tt followed by 7–8 digits. Example: tt0133093",
      });
    }

    // ── Cache check ──────────────────────────────────────────
    const cached = await MovieCache.findOne({ imdbId });
    if (cached) {
      // ── Serve from cache only if reviews were actually fetched ──
      // If cached with 0 reviews, re-fetch to try again
      if (cached.insights?.reviewCount > 0) {
        console.log(`📦  Cache HIT → ${imdbId}`);
        return res.status(200).json({
          success: true,
          source: "cache",
          data: { movie: cached.movie, insights: cached.insights },
        });
      }
      // Stale cache with 0 reviews — delete and re-fetch
      console.log(`🔄  Stale cache (0 reviews) → re-fetching ${imdbId}`);
      await MovieCache.deleteOne({ imdbId });
    }

    console.log(`🔍  Fetching fresh data → ${imdbId}`);

    // ── Step 1: OMDB ─────────────────────────────────────────
    const movie = await fetchMovieDetails(imdbId);
    console.log(`✅  OMDB → "${movie.title}"`);

    // ── Step 2: TMDB reviews ─────────────────────────────────
    // CRITICAL: use assignment (=) not declaration (const)
    // const inside try block creates a new scoped variable — bug!
    let reviews = [];
    try {
      reviews = await fetchReviews(imdbId, movie.title, movie.year);
      console.log(`💬  TMDB → ${reviews.length} reviews fetched`);
    } catch (tmdbError) {
      console.warn(`⚠️  TMDB failed (${tmdbError.message}) — continuing without reviews`);
    }

    // ── Step 3: Groq analysis ────────────────────────────────
    let insights;
    try {
      insights = await analyzeReviews(reviews, movie.title);
      console.log(`✅  Groq → ${insights.classification} (${insights.reviewCount} reviews)`);
    } catch (groqError) {
      console.warn(`⚠️  Groq failed — using fallback`);
      insights = {
        summary: "AI analysis is temporarily unavailable.",
        classification: "mixed",
        keyThemes: [],
        reviewCount: 0,
      };
    }

    // ── Step 4: Cache ─────────────────────────────────────────
    await MovieCache.create({ imdbId, movie, insights });
    console.log(`💾  Cached → "${movie.title}" (${insights.reviewCount} reviews)`);

    return res.status(200).json({
      success: true,
      source: "fresh",
      data: { movie, insights },
    });

  } catch (error) {
    console.error(`❌  [${error.response?.status || 500}] ${error.message}`);
    next(error);
  }
};

// ── Clear cache for a specific movie ─────────────────────────
export const clearMovieCache = async (req, res, next) => {
  try {
    const { imdbId } = req.params;
    const result = await MovieCache.deleteOne({ imdbId });
    const deleted = result.deletedCount > 0;
    console.log(deleted ? `🗑️  Cache cleared → ${imdbId}` : `ℹ️  No cache found → ${imdbId}`);
    return res.status(200).json({
      success: true,
      message: deleted ? `Cache cleared for ${imdbId}` : `No cached entry found for ${imdbId}`,
    });
  } catch (error) {
    next(error);
  }
};