import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

//configuration for cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET,PUT,POST,DELETE,PATCH",
    credentials: true
  })
);

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())

export { app };
