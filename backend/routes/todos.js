import express from "express";
import { authorizeJWT } from "../middlewares/authorize.js";
import folderModel from "../models/folder.model.js";
export const todoRouter = express.Router();

todoRouter.get("/folders", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  try {
    const data = await folderModel.findOne({ email });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Folders Not found" });
  }
});
