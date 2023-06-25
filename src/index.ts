import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./Router/userRouter";
import postRouter from "./Router/postRouter";
import likeDislikeRouter from "./Router/likeDislike";

import bodyParser from "body-parser";

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.listen(Number(process.env.PORT || 3003), () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/likes", likeDislikeRouter);
