import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./db.js";
import { router as authRouter } from "./routes/auth.js";
import { folderRouter } from "./routes/folders.js";
import cookieParser from "cookie-parser";
import { todoRouter } from "./routes/todo.js";
import { pageRouter } from "./routes/pages.js";

const app = express();

connectDb(process.env.DB_URL);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://semi-notion-ewsvvkmhf-pushkardesai-06s-projects.vercel.app/",
    ],
    credentials: true,
  })
);
app.use((req, res, next) => {
  // logging middleware
  console.log(`Request from : ${req.hostname}`);
  console.log(`Request hostname: ${req.url}`);
  console.log(`Request headers: ${req.headers}`);
  console.log("Request Body : ");
  console.log(req.body);

  next();
});

app.use("/auth", authRouter); // handle all auth
app.use("/folder", folderRouter); //Handle all requests related to folders
app.use("/todo", todoRouter); // Handles all requests related to todos
app.use("/page", pageRouter); // Handles all requests related to pages (NEW)

app.listen(8000, () => {
  console.log("SERVER STARTED");
});
