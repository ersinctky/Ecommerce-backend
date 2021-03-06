import express from "express";
import dotenv from "dotenv";
import path from "path";

import { connectDatabase } from "./helpers/database/connectDatabase.js";
import { router } from "./routers/index.js";
import {
  customErrorHandlers,
  notFound,
} from "./middlewares/errors/customErrorHandlers.js";

const app = express();
// environment variables

dotenv.config();

// mongodb connection
connectDatabase();

// express - body middleware

app.use(express.json());

// routers middleware

app.use("/api", router);

// error handler

app.use(customErrorHandlers);

// notfound

app.use(notFound);

// static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT;
app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT} `)
);
