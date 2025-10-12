import express from "express";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { authorizeJWT } from "../middlewares/authorize.js";

export const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      authenticated: false,
      message: "User does not exist",
    });
  }
  const isMatch = password ? await user.comparePassword(password) : false;

  if (isMatch) {
    const payload = { name: user.name, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1hr" });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      authenticated: true,
      message: "User authenticated successfuly",
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(200).json({
      authenticated: false,
      message: "Wrong username or password",
    });
  }
});

router.post("/register", async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const userObj = new User(data);
    const user = await userObj.save();
    console.log(user);
    const payload = { name: user.name, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1hr" });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "User Created" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
});

router.get("/get-info", authorizeJWT, (req, res) => {
  try {
    const { name, email } = req.headers.user;
    res.json({ name, email });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie();
  res.json({ message: "Cleared Cookies" });
});
