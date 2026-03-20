import express from "express";
import cors from "cors";
import { leadRouter } from "./routes/lead.routes.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  return res.status(200).json({ message: "OK" });
});

// Mount the lead router on the /leads path
app.use("/leads", leadRouter);


// Handle 404 for undefined routes and global error handling
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
