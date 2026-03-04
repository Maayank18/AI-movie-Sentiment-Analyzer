import { Router } from "express";
import { getMovieInsights, clearMovieCache } from "../controllers/movieController.js";

const router = Router();

router.get("/:imdbId",          getMovieInsights);
router.delete("/:imdbId/cache", clearMovieCache);  // ← new

export default router;