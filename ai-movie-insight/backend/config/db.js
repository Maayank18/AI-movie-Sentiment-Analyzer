import mongoose from "mongoose";

/**
 * Connects to MongoDB Atlas.
 * Exits process on failure — no point running without a database.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅  MongoDB connected → ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};