import express from "express";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { authorizeJWT } from "../middlewares/authorize.js";
import folderModel from "../models/folder.model.js";
import { nanoid } from "nanoid";

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
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      status: 200,
      authenticated: true,
      message: "User authenticated successfully",
      name: user.name,
      email: user.email,
      token: token, // Send token in response body
    });
  } else {
    res.status(200).json({
      status: 200,
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

    // Create default folder for new user
    const folderId = nanoid();
    await folderModel.create({
      email: user.email,
      folders: [{ id: folderId, name: "NewFolder" }],
    });

    const payload = { name: user.name, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      status: 200,
      message: "User Created",
      token: token, // Send token in response body
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
});

router.get("/get-info", authorizeJWT, (req, res) => {
  try {
    const { name, email } = req.headers.user;
    res.status(200).json({
      status: 200,
      authenticated: true,
      name,
      email,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: 401,
      authenticated: false,
      message: error.message,
    });
  }
});

router.post("/logout", (req, res) => {
  // With localStorage, logout is handled on client side
  res.status(200).json({
    status: 200,
    message: "Logout successful",
  });
});
