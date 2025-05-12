import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";

import { configs } from "./config/configs";
import { ApiError } from "./errors/api-error";

import { superheroRouter } from "./routes/superhero.routes";

import pool from "./db/db";

const app = express();

const allowedOrigins =
  configs.NODE_ENV === "production" ? [] : ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type", "Origin"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/api/superheroes", superheroRouter);

app.use((error: ApiError, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500).send(error.message);
});

process.on("uncaughtException", (error) => {
  console.error("uncaughtException", error.message, error.stack);
  process.exit(1);
});

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

async function startServer() {
  try {
    const client = await pool.connect();
    client.release();

    app.listen(configs.APP_PORT, () => {
      console.log(
        `Server is running on http://${configs.APP_HOST}:${configs.APP_PORT}`,
      );
    });
  } catch (err) {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  }
}

startServer();
