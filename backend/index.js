import express from "express";
import mongoose from "mongoose";
import { User } from "./models/user.model.js";
import cors from "cors";

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/OrganisationTool")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection error:", err));

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

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email });

  if (!user) {
    res.json({
      status: 200,
      authenticated: false,
      message: "User does not exist",
    });
  }
  const isMatch = await user.comparePassword(password);

  if (isMatch) {
    res.json({
      status: 200,
      authenticated: true,
      message: "User authenticated successfuly",
      name: user.name,
      email: user.email,
    });
  } else {
    res.json({
      status: 200,
      authenticated: false,
      message: "Wrong username or password",
    });
  }
});

app.post("/register", (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    User.create(data);
    res.json({ status: 200, message: "User Created" });
  } catch (error) {
    res.json({ status: 400, message: error });
  }
});

app.listen(8000, () => {
  console.log("SERVER STARTED");
});
