import axios from "axios";

const OMDB_BASE_URL = "https://www.omdbapi.com";

/**
 * Fetches complete movie details from OMDB API using an IMDb ID.
 *
 * OMDB natively accepts tt-prefixed IMDb IDs — no ID conversion needed.
 * Returns a clean, normalised object stripping any OMDB-specific quirks.
 *
 * @param   {string} imdbId  - e.g. "tt0133093"
 * @returns {object}           Normalised movie data object
 * @throws  {Error}            404 if movie not found, 500 on network issues
 */
export const fetchMovieDetails = async (imdbId) => {
  const { data } = await axios.get(OMDB_BASE_URL, {
    params: {
      apikey: process.env.OMDB_API_KEY,
      i: imdbId,       // IMDb ID param
      plot: "short",   // short | full
    },
    timeout: 10000, // 10s timeout
  });

  // OMDB signals failure via Response field, not HTTP status codes
  if (data.Response === "False") {
    const err = new Error(data.Error || "Movie not found");
    err.statusCode = 404;
    throw err;
  }

  // Normalise: split cast string into clean array
  const cast = data.Actors
    ? data.Actors.split(",").map((name) => name.trim()).filter(Boolean)
    : [];

  return {
    title:     data.Title      || "Unknown Title",
    year:      data.Year       || "N/A",
    rating:    data.imdbRating || "N/A",
    plot:      data.Plot       || "No plot available.",
    poster:    data.Poster !== "N/A" ? data.Poster : null,
    genre:     data.Genre      || "N/A",
    director:  data.Director   || "N/A",
    runtime:   data.Runtime    || "N/A",
    imdbVotes: data.imdbVotes  || "N/A",
    cast,
  };
};