import mongoose from "mongoose";

const connectDB = async () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined in environment variables.");
  }

  await mongoose.connect(databaseUrl);
};

export { connectDB };
