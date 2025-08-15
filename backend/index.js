import express from "express";
import mongoose from "mongoose";
import { User } from "./models/user.model.js";

const app = express();
console.log("first");

mongoose
  .connect("mongodb://localhost:27017/OrganisationTool")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection error:", err));

console.log("second");
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/auth", async (req, res) => {
  try {
    const data = await User.findOne();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.json({ data: "data" });
  }
});

app.listen(8000, () => {
  console.log("SERVER STARTED");
});
