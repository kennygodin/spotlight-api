import express from "express";

import { errorHandler } from "./middlewares/errorHandler";
import ratelimiter from "./middlewares/rateLimiter";

import itemRoutes from "./routes/item.route";
import userRoutes from "./routes/user.route";

const app = express();

app.use(ratelimiter);
app.use(express.json());

// Routes
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Healthy" });
});

app.use(errorHandler);

export default app;
