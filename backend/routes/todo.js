import express from "express";
import { authorizeJWT } from "../middlewares/authorize.js";
import todoModel from "../models/todos.model.js";

export const todoRouter = express.Router();

todoRouter.get("/getTodos", authorizeJWT, async (req, res) => {
  const email = req.headers.email;
  // Query parameter of folderId
  const folderId = req.query.folderId;

  try {
    const response = await todoModel.find({ email, folderId }).select("todos");
    if (!response) return res.json({});
    return res.json(response);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Not Found!" });
  }
});
