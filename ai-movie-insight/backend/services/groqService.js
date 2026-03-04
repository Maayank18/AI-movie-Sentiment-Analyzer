// import Groq from "groq-sdk";

// // Initialise Groq client — key loaded from env
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// /**
//  * Analyses an array of audience reviews using Groq (LLaMA 3.3 70B).
//  *
//  * Prompt strategy:
//  *  - Low temperature (0.3) for consistent, structured output
//  *  - Explicitly request raw JSON — no markdown, no preamble
//  *  - Fallback parsing handles occasional backtick wrapping from the model
//  *
//  * @param   {string[]} reviews    - Array of review text strings
//  * @param   {string}   movieTitle - Used in the prompt for context
//  * @returns {{ summary, classification, keyThemes, reviewCount }}
//  */
// export const analyzeReviews = async (reviews, movieTitle) => {
//   // Edge case: no reviews available for this title
//   if (!reviews || reviews.length === 0) {
//     return {
//       summary:
//         "No audience reviews were available for this title. Sentiment analysis could not be performed.",
//       classification: "mixed",
//       keyThemes: [],
//       reviewCount: 0,
//     };
//   }

//   // Format reviews into a numbered block for the prompt
//   const reviewBlock = reviews
//     .map((text, i) => `Review ${i + 1}:\n"${text}"`)
//     .join("\n\n");

//   const prompt = `
// You are an expert film critic and data analyst specialising in audience sentiment.

// Analyse the following ${reviews.length} audience reviews for the movie "${movieTitle}".

// Respond ONLY with a valid raw JSON object. No markdown. No code fences. No explanation. Just the JSON.

// Required structure:
// {
//   "summary": "2-3 sentences summarising the overall audience sentiment — what viewers loved, disliked, and felt about the film.",
//   "classification": "positive" | "mixed" | "negative",
//   "keyThemes": ["theme1", "theme2", "theme3"]
// }

// Rules:
// - "classification" must be EXACTLY one of: positive, mixed, negative
// - "keyThemes": 3 to 5 short phrases capturing recurring audience sentiments (e.g. "breathtaking visuals", "slow pacing", "powerful performances")
// - "summary": objective, analytical, 2-3 sentences max

// Reviews to analyse:
// ${reviewBlock}
// `.trim();

//   const completion = await groq.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     messages: [{ role: "user", content: prompt }],
//     temperature: 0.3,
//     max_tokens: 600,
//   });

//   const rawContent = completion.choices[0]?.message?.content?.trim() || "";

//   // ── Safe JSON parsing with fallback ──────────────────────────
//   try {
//     // Strip accidental markdown code fences if model adds them
//     const cleaned = rawContent.replace(/```json|```/g, "").trim();
//     const parsed = JSON.parse(cleaned);

//     const validClassifications = ["positive", "mixed", "negative"];

//     return {
//       summary: parsed.summary || "Analysis unavailable.",
//       classification: validClassifications.includes(parsed.classification)
//         ? parsed.classification
//         : "mixed",
//       keyThemes: Array.isArray(parsed.keyThemes) ? parsed.keyThemes.slice(0, 5) : [],
//       reviewCount: reviews.length,
//     };
//   } catch (_parseError) {
//     // JSON parse failed — return raw text as summary rather than crashing
//     console.warn("⚠️  Groq response was not valid JSON. Using raw text as summary.");
//     return {
//       summary: rawContent || "Analysis unavailable.",
//       classification: "mixed",
//       keyThemes: [],
//       reviewCount: reviews.length,
//     };
//   }
// };






import Groq from "groq-sdk";

/**
 * Lazy Groq client initializer
 * Prevents crash during module import
 */
let groqClient = null;

function getGroqClient() {
  if (groqClient) return groqClient;

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.error("❌ GROQ_API_KEY is missing in environment variables.");
    throw new Error(
      "GROQ_API_KEY is not defined. Please check your .env file."
    );
  }

  groqClient = new Groq({ apiKey });
  return groqClient;
}

/**
 * Analyses an array of audience reviews using Groq (LLaMA 3.3 70B).
 *
 * @param   {string[]} reviews
 * @param   {string}   movieTitle
 * @returns {{ summary, classification, keyThemes, reviewCount }}
 */
export const analyzeReviews = async (reviews, movieTitle) => {
  try {
    // Edge case: no reviews
    if (!reviews || reviews.length === 0) {
      return {
        summary:
          "No audience reviews were available for this title. Sentiment analysis could not be performed.",
        classification: "mixed",
        keyThemes: [],
        reviewCount: 0,
      };
    }

    const groq = getGroqClient();

    const reviewBlock = reviews
      .map((text, i) => `Review ${i + 1}:\n"${text}"`)
      .join("\n\n");

    const prompt = `
You are an expert film critic and data analyst specialising in audience sentiment.

Analyse the following ${reviews.length} audience reviews for the movie "${movieTitle}".

Respond ONLY with a valid raw JSON object. No markdown. No code fences. No explanation. Just the JSON.

Required structure:
{
  "summary": "2-3 sentences summarising the overall audience sentiment.",
  "classification": "positive" | "mixed" | "negative",
  "keyThemes": ["theme1", "theme2", "theme3"]
}

Rules:
- classification must be EXACTLY one of: positive, mixed, negative
- keyThemes must contain 3–5 short phrases
- summary must be 2–3 sentences maximum

Reviews to analyse:
${reviewBlock}
`.trim();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 600,
    });

    const rawContent =
      completion?.choices?.[0]?.message?.content?.trim() || "";

    // ───────── Safe JSON parsing ─────────
    try {
      const cleaned = rawContent.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      const validClassifications = ["positive", "mixed", "negative"];

      return {
        summary: parsed.summary || "Analysis unavailable.",
        classification: validClassifications.includes(parsed.classification)
          ? parsed.classification
          : "mixed",
        keyThemes: Array.isArray(parsed.keyThemes)
          ? parsed.keyThemes.slice(0, 5)
          : [],
        reviewCount: reviews.length,
      };
    } catch (parseError) {
      console.warn(
        "⚠️ Groq response was not valid JSON. Returning raw text."
      );

      return {
        summary: rawContent || "Analysis unavailable.",
        classification: "mixed",
        keyThemes: [],
        reviewCount: reviews.length,
      };
    }
  } catch (error) {
    console.error("🔥 Groq Analysis Error:", error.message);

    return {
      summary:
        "Sentiment analysis service is temporarily unavailable.",
      classification: "mixed",
      keyThemes: [],
      reviewCount: reviews?.length || 0,
    };
  }
};