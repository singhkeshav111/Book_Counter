import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieparser());

import userRouter from "./routes/user.routes.js";

app.use("/api/v1/users", userRouter);

export default app;
