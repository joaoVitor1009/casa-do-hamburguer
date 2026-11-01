import express, { type Request, type Response } from "express";
import { connection } from "./db.js";
import cors from "cors";
import { router } from "./routers.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  }),
);
app.use(router);
connection();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
