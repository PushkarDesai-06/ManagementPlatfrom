import express from "express";
import { authorizeJWT } from "../middlewares/authorize.js";
import folderModel from "../models/folder.model.js";
import { nanoid } from "nanoid";
import todoModel from "../models/todos.model.js";
export const folderRouter = express.Router();

// returns all folders for a particular email
folderRouter.get("/", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  try {
    const data = await folderModel.findOne({ email });
    if (!data) return res.json({});
    console.log("fetched folders :");
    console.log(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Folders Not found" });
  }
});

folderRouter.post("/", authorizeJWT, async (req, res) => {
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
    return res.json(updatedFolders);
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Folder could not be added" });
  }
});

folderRouter.put("/", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  const { id, newName } = req.body;
  try {
    const isAcknowldged = await folderModel.updateOne(
      { email, "folders.id": id },
      { $set: { "folders.$.name": newName } }
    );
    console.log(isAcknowldged);

    res.json(isAcknowldged);
  } catch (error) {
    console.log(error);
  }
});

folderRouter.delete("/:id", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  const folderId = req.params.id;

  if (!folderId) return res.json(400).json({ message: "Bad request" });

  try {
    const updatedFolders = await folderModel.findOneAndUpdate(
      { email },
      { $pull: { folders: { id: folderId } } }
    );

    if (!updatedFolders)
      return res.status(404).json({ message: "Folder Not found" });

    // const todosDelteResponse = await todoModel.findOneAndDelete({
    //   email,
    //   folderId,
    // });

    return res.json(updatedFolders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
