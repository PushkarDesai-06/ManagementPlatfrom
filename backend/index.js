import express from "express";
import mongoose from "mongoose";
import { User } from "./models/user.model.js";
import cors from "cors";
import jwt from "jsonwebtoken";
import "dotenv/config";

const app = express();

const JWT_SECRET =
  process.env.JWT_SECRET || "sdlifhjoi4o35234534o3herlkjhfg9836huirgphuy508";

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
    return;
  }
  const isMatch = password ? await user.comparePassword(password) : false;

  if (isMatch) {
    const payload = { name: user.name, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1hr" });
    res.json({
      status: 200,
      authenticated: true,
      message: "User authenticated successfuly",
      name: user.name,
      email: user.email,
      token: token,
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

app.get("/get-info", (req, res) => {
  const jwtToken = req.headers["authorization"].split(" ")[1];

  try {
    const payload = jwt.verify(jwtToken, JWT_SECRET);

    res.json({
      status: 200,
      authenticated: true,
      name: payload.name,
      email: payload.email,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: 401,
      authenticated: false,
      message: "Authentication Error!",
    });
  }
});

app.listen(8000, () => {
  console.log("SERVER STARTED");
});
