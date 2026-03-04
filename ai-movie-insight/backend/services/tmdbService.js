import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const tmdbGet = (url, params) =>
  axios.get(url, {
    params: { api_key: process.env.TMDB_API_KEY, ...params },
    timeout: 12000,
    headers: { Connection: "close" },
  });

const resolveTmdbId = async (imdbId, movieTitle = null, movieYear = null) => {
  // Strategy 1: direct IMDb ID lookup
  try {
    const { data } = await tmdbGet(`${TMDB_BASE_URL}/find/${imdbId}`, {
      external_source: "imdb_id",
    });
    const result = data.movie_results?.[0];
    if (result) {
      console.log(`✅  TMDB /find → id=${result.id} title="${result.title}"`);
      return result.id;
    }
    console.warn(`⚠️  TMDB /find returned 0 results for ${imdbId}`);
  } catch (err) {
    console.warn(`⚠️  TMDB /find error: ${err.message}`);
  }

  // Strategy 2: title search fallback
  if (movieTitle) {
    const cleanYear = movieYear?.replace(/[^0-9]/g, "").slice(0, 4);
    try {
      const { data } = await tmdbGet(`${TMDB_BASE_URL}/search/movie`, {
        query: movieTitle,
        ...(cleanYear && { year: cleanYear }),
      });
      console.log(`🔎  TMDB search "${movieTitle}" (${cleanYear}) → ${data.results?.length || 0} results`);
      const result = data.results?.[0];
      if (result) {
        console.log(`✅  TMDB search → id=${result.id} title="${result.title}"`);
        return result.id;
      }
      // Try without year if year-filtered search returns nothing
      if (cleanYear) {
        const { data: data2 } = await tmdbGet(`${TMDB_BASE_URL}/search/movie`, {
          query: movieTitle,
        });
        const result2 = data2.results?.[0];
        if (result2) {
          console.log(`✅  TMDB search (no year) → id=${result2.id} title="${result2.title}"`);
          return result2.id;
        }
      }
    } catch (err) {
      console.warn(`⚠️  TMDB search error: ${err.message}`);
    }
  }

  const err = new Error(`No TMDB entry found for: ${movieTitle || imdbId}`);
  err.statusCode = 404;
  throw err;
};

const withRetry = async (fn, attempts = 3, delayMs = 800) => {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1) throw err;
      console.warn(`⚠️  TMDB retry ${i + 1}/${attempts - 1}…`);
      await new Promise(r => setTimeout(r, delayMs * (i + 1)));
    }
  }
};

export const fetchReviews = async (imdbId, movieTitle = null, movieYear = null) => {
  return withRetry(async () => {
    const tmdbId = await resolveTmdbId(imdbId, movieTitle, movieYear);

    const [p1, p2] = await Promise.allSettled([
      tmdbGet(`${TMDB_BASE_URL}/movie/${tmdbId}/reviews`, { page: 1 }),
      tmdbGet(`${TMDB_BASE_URL}/movie/${tmdbId}/reviews`, { page: 2 }),
    ]);

    const all = [];
    if (p1.status === "fulfilled") {
      const results = p1.value.data.results || [];
      console.log(`📄  TMDB reviews page 1 → ${results.length} reviews`);
      all.push(...results);
    }
    if (p2.status === "fulfilled") {
      const results = p2.value.data.results || [];
      console.log(`📄  TMDB reviews page 2 → ${results.length} reviews`);
      all.push(...results);
    }

    const cleaned = all
      .slice(0, 15)
      .map(r => r.content?.slice(0, 600).trim())
      .filter(Boolean);

    console.log(`📊  Total usable reviews → ${cleaned.length}`);
    return cleaned;
  });
};