import { useState, useCallback } from "react";
import { getMovieInsights } from "../services/api";

const useMovieData = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const fetchMovie = useCallback(async (imdbId) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await getMovieInsights(imdbId.trim());
      setData(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, fetchMovie, reset };
};

export default useMovieData;