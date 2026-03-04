import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 30000,
});

export const getMovieInsights = async (imdbId) => {
  const { data } = await api.get(`/movie/${imdbId}`);
  return data;
};

export default api;