# CineAI — AI Movie Insight Builder

> Enter any IMDb movie ID and get AI-powered audience sentiment analysis, cast details, and critical insights — instantly.
---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Tech Stack Rationale](#tech-stack-rationale)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Assumptions](#assumptions)
- [Known Limitations](#known-limitations)

---

## Overview

CineAI is a full-stack web application that takes an IMDb movie ID as input and returns:

- Complete movie metadata (title, cast, director, runtime, genre, poster)
- IMDb rating and vote count
- AI-generated audience sentiment analysis powered by **LLaMA 3.3 70B via Groq**
- Recurring themes extracted from real audience reviews
- Smart MongoDB caching to reduce redundant API calls

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | [https://your-app.vercel.app](https://your-app.vercel.app) |
| Backend API | [https://your-backend.onrender.com/api/health](https://your-backend.onrender.com/api/health) |

> **Note:** The backend is hosted on Render's free tier and may take up to 30 seconds to respond after a period of inactivity (cold start).

---

## Features

- **IMDb ID lookup** — fetch full movie details instantly using OMDB API
- **Audience reviews** — pull real user reviews from TMDB with dual-strategy ID resolution
- **AI Sentiment Analysis** — LLaMA 3.3 70B classifies sentiment as Positive / Mixed / Negative with a written summary and key themes
- **Smart caching** — MongoDB TTL cache (7 days) prevents repeat API calls for the same movie
- **Stale cache detection** — automatically re-fetches if a cached entry has 0 reviews
- **Responsive UI** — works seamlessly on mobile and desktop
- **Graceful degradation** — if TMDB fails, Groq uses its general knowledge about the film

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI component framework |
| Vite | 7 | Build tool and dev server |
| Tailwind CSS | 4 | Utility-first styling |
| Axios | 1.x | HTTP client for API requests |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | JavaScript runtime |
| Express | 5.x | HTTP server and routing |
| Mongoose | 8.x | MongoDB object modelling |
| Axios | 1.x | Outbound HTTP requests to APIs |
| Groq SDK | latest | LLM inference client |
| dotenv | 17.x | Environment variable management |
| nodemon | 3.x | Development auto-restart |

### Database & APIs
| Service | Purpose |
|---|---|
| MongoDB Atlas | Cloud database for movie cache |
| OMDB API | Movie metadata (title, cast, rating, poster) |
| TMDB API | Audience reviews |
| Groq (LLaMA 3.3 70B) | AI sentiment analysis |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting (free tier) |
| Render | Backend hosting (free tier) |
| MongoDB Atlas | Database (free tier — M0) |

---

## Tech Stack Rationale

### Why React + Vite instead of Next.js?
The assignment required a clear separation between frontend and backend. A standalone React + Vite app makes the architecture explicit — the frontend is a pure static client and the backend is a dedicated REST API. Next.js would blur this boundary with its built-in API routes, making deployment to separate services (Vercel + Render) unnecessarily complex.

### Why Express instead of Fastify or Hono?
Express is the industry-standard Node.js framework with the widest ecosystem support, clearest error handling patterns, and the most straightforward middleware model. For an application of this scale, Express provides everything needed without the overhead of learning a newer framework.

### Why MongoDB instead of PostgreSQL?
Movie data returned from OMDB is unstructured JSON with varying fields (some movies have missing runtime, rating, or cast). MongoDB's flexible document model stores this naturally without requiring schema migrations. The caching use case — store once, read many times, expire after 7 days via TTL index — is a textbook MongoDB strength.

### Why Groq (LLaMA 3.3 70B) instead of OpenAI GPT?
Groq provides extremely fast inference (often under 1 second for 600-token prompts) on LLaMA 3.3 70B — a fully open-weight model. The free tier is generous enough for this use case. OpenAI GPT-4 would be slower and significantly more expensive, with no meaningful quality advantage for sentiment classification tasks.

### Why OMDB + TMDB instead of just one API?
OMDB natively accepts IMDb IDs and returns clean metadata (title, cast, director, rating). However, OMDB does not provide audience reviews. TMDB has a rich reviews endpoint but requires its own internal ID. The two-API approach gives the best of both: OMDB for reliable metadata, TMDB for real audience sentiment data.

### Why Tailwind CSS v4?
Tailwind v4 uses a CSS-first configuration model with `@theme {}` directives instead of `tailwind.config.js`. This reduces configuration overhead and keeps design tokens co-located with styles. For a project of this scale, v4's inline style approach with custom properties is cleaner and more maintainable.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        USER                             │
│                  (Browser / Mobile)                     │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────┐
│              FRONTEND (Vercel)                          │
│         React 19 + Vite + Tailwind CSS v4               │
│                                                         │
│  SearchBar → useMovieData hook → api.js (Axios)         │
└──────────────────────────┬──────────────────────────────┘
                           │ REST API call
                           │ GET /api/movie/:imdbId
                           ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND (Render)                           │
│              Express + Node.js                          │
│                                                         │
│  movieController.js                                     │
│       │                                                 │
│       ├── Check MongoDB cache                           │
│       │       └── HIT → return cached data             │
│       │       └── MISS → fetch fresh                   │
│       │                                                 │
│       ├── omdbService.js  ──► OMDB API                  │
│       ├── tmdbService.js  ──► TMDB API (reviews)        │
│       └── groqService.js  ──► Groq LLaMA 3.3 70B        │
│                                                         │
│       └── Save to MongoDB cache (TTL: 7 days)           │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              MongoDB Atlas (Free Tier)                  │
│              moviecaches collection                     │
│              TTL index: 7 days                          │
└─────────────────────────────────────────────────────────┘
```

---

## Setup Instructions

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account
- A free [OMDB API key](https://www.omdbapi.com/apikey.aspx)
- A free [TMDB API key](https://www.themoviedb.org/settings/api)
- A free [Groq API key](https://console.groq.com/keys)

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-movie-insight.git
cd ai-movie-insight
```

---

### 2. Backend setup

```bash
cd backend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Fill in your `.env` file (see [Environment Variables](#environment-variables) below).

Start the backend development server:

```bash
npm run dev
```

The backend will start at `http://localhost:5000`

Verify it's running:
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"ok","env":"development"}
```

---

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create your frontend environment file:

```bash
# Create .env.local for development
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will start at `http://localhost:5173`

---

### 4. Test the full stack

1. Open `http://localhost:5173` in your browser
2. Enter an IMDb ID — for example `tt0468569` (The Dark Knight)
3. Click **Analyse Film**
4. You should see movie details + AI sentiment analysis

---

### 5. Build for production

```bash
# Build frontend
cd frontend
npm run build
# Output: frontend/dist/

# Backend runs as-is with node server.js
```

---

## Environment Variables

### `backend/.env`

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/movieinsight?retryWrites=true&w=majority

# API Keys
OMDB_API_KEY=your_omdb_api_key_here
TMDB_API_KEY=your_tmdb_api_key_here
GROQ_API_KEY=gsk_your_groq_api_key_here

# CORS — your frontend URL
CLIENT_URL=http://localhost:5173
```

### `frontend/.env.local` (development)

```env
VITE_API_URL=http://localhost:5000/api
```

### `frontend/.env.production` (Vercel)

```env
VITE_API_URL=https://your-backend-name.onrender.com/api
```

### How to get each API key

| Key | Where to get it | Free tier |
|---|---|---|
| `OMDB_API_KEY` | [omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx) | 1,000 req/day |
| `TMDB_API_KEY` | [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) — use "API Key (v3 auth)" | Unlimited |
| `GROQ_API_KEY` | [console.groq.com/keys](https://console.groq.com/keys) | Generous free tier |
| `MONGODB_URI` | [mongodb.com/atlas](https://www.mongodb.com/atlas) → Connect → Drivers | 512MB free |

---

## API Reference

### `GET /api/health`
Returns server status.

**Response:**
```json
{
  "status": "ok",
  "env": "production"
}
```

---

### `GET /api/movie/:imdbId`
Fetches movie details and AI sentiment insights.

**Parameters:**
| Param | Type | Description |
|---|---|---|
| `imdbId` | string | Valid IMDb ID — format `tt` followed by 7–8 digits |

**Example request:**
```bash
curl https://your-backend.onrender.com/api/movie/tt0468569
```

**Example response:**
```json
{
  "success": true,
  "source": "fresh",
  "data": {
    "movie": {
      "title": "The Dark Knight",
      "year": "2008",
      "rating": "9.0",
      "plot": "When the menace known as the Joker...",
      "poster": "https://m.media-amazon.com/...",
      "genre": "Action, Crime, Drama",
      "director": "Christopher Nolan",
      "runtime": "152 min",
      "imdbVotes": "2,891,406",
      "cast": ["Christian Bale", "Heath Ledger", "Aaron Eckhart"]
    },
    "insights": {
      "summary": "Audiences universally regard The Dark Knight as a masterpiece...",
      "classification": "positive",
      "keyThemes": ["iconic villain", "moral complexity", "stunning cinematography"],
      "reviewCount": 12
    }
  }
}
```

**Error response:**
```json
{
  "success": false,
  "message": "Invalid IMDb ID. Expected format: tt followed by 7–8 digits."
}
```

---

### `DELETE /api/movie/:imdbId/cache`
Clears the cached entry for a specific movie. Useful when stale data needs to be refreshed.

**Example:**
```bash
curl -X DELETE https://your-backend.onrender.com/api/movie/tt0468569/cache
```

---

## Assumptions

1. **IMDb ID format** — The application assumes all valid movie IDs follow the standard IMDb format: `tt` followed by 7 or 8 digits (e.g., `tt0133093`). IDs outside this format are rejected with a 400 error.

2. **TMDB review availability** — Not all movies on TMDB have audience reviews. For films with no TMDB reviews (especially older, foreign, or obscure titles), the application falls back to Groq's general knowledge about the film to generate a sentiment summary. The `reviewCount` field in the response reflects whether real reviews were used.

3. **OMDB is the source of truth for metadata** — OMDB returns authoritative movie data directly from its IMDb-linked database. Fields marked `"N/A"` by OMDB are treated as unavailable and are gracefully omitted from the UI.

4. **Cache TTL of 7 days** — It is assumed that movie metadata and audience sentiment do not change significantly within a 7-day window. For newly released films where review counts are rapidly growing, the cache can be manually cleared via the `DELETE /api/movie/:imdbId/cache` endpoint.

5. **Groq model availability** — The application uses `llama-3.3-70b-versatile` via Groq's API. It is assumed this model remains available on the free tier. If Groq is unavailable, the application returns a graceful fallback message rather than crashing.

6. **Single currency of IDs** — The application uses IMDb IDs as the single identifier throughout. TMDB IDs are resolved internally and are never exposed to the frontend or cached independently.

7. **Network resilience** — TMDB connections occasionally reset (ECONNRESET) due to network instability. The application retries TMDB requests up to 3 times before treating reviews as unavailable. This is considered acceptable behaviour for a free-tier deployment.

8. **No user authentication** — The application is stateless and requires no login. All data returned is publicly available information. No user data is stored.

9. **MongoDB Atlas free tier constraints** — The M0 free cluster on MongoDB Atlas has a 512MB storage limit and no dedicated CPU. For a caching use case with TTL-indexed documents, this is well within acceptable limits.

10. **English-language reviews only** — TMDB reviews are fetched without language filtering. The Groq sentiment analysis prompt is written in English and is optimised for English-language reviews. Non-English reviews may produce less accurate sentiment classifications.

---

## Known Limitations

- **Render cold starts** — The free tier backend spins down after 15 minutes of inactivity. The first request after inactivity may take up to 30 seconds.
- **OMDB rate limit** — The free OMDB API key allows 1,000 requests per day. The MongoDB cache significantly reduces actual API calls.
- **TMDB review count** — TMDB has a relatively small number of user reviews compared to IMDb. Some popular films may only have 1–5 reviews available, which can affect sentiment accuracy.

---

## Project Structure

```
ai-movie-insight/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   └── movieController.js     # Main request handler
│   ├── middleware/
│   │   └── errorHandler.js        # Centralised error handling
│   ├── models/
│   │   └── MovieCache.js          # Mongoose schema with TTL
│   ├── routes/
│   │   └── movieRoutes.js         # API route definitions
│   ├── services/
│   │   ├── omdbService.js         # OMDB API integration
│   │   ├── tmdbService.js         # TMDB API integration
│   │   └── groqService.js         # Groq LLM integration
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── SearchBar.jsx
    │   │   ├── MovieCard.jsx
    │   │   ├── CastList.jsx
    │   │   ├── SentimentPanel.jsx
    │   │   ├── LoadingSkeleton.jsx
    │   │   └── ErrorMessage.jsx
    │   ├── hooks/
    │   │   ├── useMovieData.js
    │   │   └── useWindowWidth.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── postcss.config.js
    └── package.json
```

---

## Contact

Built by **Mayank Garg** for the Brew Full-Stack Developer Internship Assignment.

For questions or feedback: [abhay@brew.tv](mailto:abhay@brew.tv)

---

*Built with ❤️ using React, Node.js, MongoDB, and Groq AI*