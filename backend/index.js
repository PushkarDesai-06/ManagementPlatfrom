import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./db.js";
import { router as authRouter } from "./routes/auth.js";
import { todoRouter } from "./routes/todos.js";

const app = express();

connectDb(process.env.DB_URL);

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  const name = req.query.name;
  if (name) {
    res.send(`Hello ${name}`);
  } else {
    res.send("Hello World");
  }
});

app.use(authRouter); // handle all auth
app.use(todoRouter)

app.listen(8000, () => {
  console.log("SERVER STARTED");
});
