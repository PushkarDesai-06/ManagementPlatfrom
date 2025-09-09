import express from "express";
import { authorizeJWT } from "../middlewares/authorize.js";
import folderModel from "../models/folder.model.js";
import { nanoid } from "nanoid";
export const todoRouter = express.Router();

todoRouter.get("/folders", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  try {
    const data = await folderModel.findOne({ email });
    if (!data) return res.json([]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Folders Not found" });
  }
});

todoRouter.post("/addfolder", authorizeJWT, async (req, res) => {
  const email = req.headers.user.email;
  const name = req.body.name;
  const folderId = nanoid();
  try {
    const prev = await folderModel.findOne({ email });
    if (!prev) {
      //create the model

      const newModel = folderModel.create({
        email,
        folders: [{ id: folderId, name }],
      });
      return res.json(newModel);
    }
    prev.folders.push({ id: folderId, name });

    const updatedFolders = await folderModel.findOneAndUpdate(
      { email },
      { folders: prev.folders },
      { new: true }
    );
    console.log(updatedFolders);
    return res.json(updatedFolders);
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Folder could not be added" });
  }
});

todoRouter.post("/changefoldername", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  const { id, newName } = req.body;
  try {
    const oldFolders = await folderModel.findOne({ email });
    const changedFolders = oldFolders.folders.map((elem) => {
      if (elem.id === id) return { id: elem.id, name: newName };
      return elem;
    });
    const updatedFolders = await folderModel.findOneAndUpdate(
      { email },
      {
        folders: changedFolders,
      },
      { new: true }
    );

    res.json(updatedFolders);
  } catch (error) {
    console.log(error);
  }
});
