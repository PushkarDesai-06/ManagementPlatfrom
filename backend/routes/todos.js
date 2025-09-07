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

todoRouter.post("/addfolder", authorizeJWT, async (req, res) => {
  const email = req.headers.user.email;
  const name = req.body.name;
  try {
    const prev = await folderModel.findOne({ email });
    if (!prev) {
      //create the model

      const newModel = folderModel.createOne({ email, folders: [] });
      return res.json(newModel);
    }
    prev.folders.push(name);

    const updatedFolders = await folderModel.findOneAndUpdate(
      { email },
      { folders: prev.folders },
      { new: true }
    );
    console.log(updatedFolders);
    return res.json(updatedFolders);
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "User not found" });
  }
});
