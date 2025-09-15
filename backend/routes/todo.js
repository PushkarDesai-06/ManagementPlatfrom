import express from "express";
import { authorizeJWT } from "../middlewares/authorize.js";
import todoModel from "../models/todos.model.js";
import { nanoid } from "nanoid";

export const todoRouter = express.Router();

todoRouter.get("/", authorizeJWT, async (req, res) => {
  const email = req.headers.user.email;
  // Query parameter of folderId
  const folderId = req.query.folderId;

  try {
    const response = await todoModel.find({ email, folderId }).select("todos");
    console.log(response);
    if (!response) return res.json([]);
    return res.json(response);
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Not Found!" });
  }
});

todoRouter.post("/", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  const { folderId, content } = req.body;

  if (!content || !folderId)
    return res.status(400).json({ message: "folderId or content id missing" });

  try {
    const todoToPush = {
      todoId: nanoid(),
      content,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    const newTodos = await todoModel.findOneAndUpdate(
      { email, folderId },
      {
        $push: {
          todos: {
            ...todoToPush,
          },
        },
      },
      { new: true }
    );
    console.log(newTodos);
    if (!newTodos) {
      const createdTodo = await todoModel.create({
        email,
        folderId,
        todos: [todoToPush],
      });

      return res.json(createdTodo);
    }
    return res.json(newTodos);
  } catch (error) {}
});

todoRouter.delete("/:folderId/:id", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  const { id: todoId, folderId } = req.params;

  if (!todoId || !folderId)
    return res.status(400).json({ message: "id or folderId missing" });

  try {
    const response = await todoModel.findOneAndUpdate(
      { email, folderId },
      { $pull: { todos: { todoId: todoId } } },
      { new: true }
    );

    return res.json(response);
  } catch (error) {
    console.log("Delete error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});
