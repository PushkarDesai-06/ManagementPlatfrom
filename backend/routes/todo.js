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
    const response = await todoModel
      .findOne({ email, folderId })
      .select("todos");
    if (!response) return res.json([]);

    // Normalize order for todos that don't have it
    if (response.todos && response.todos.length > 0) {
      let needsUpdate = false;
      response.todos.forEach((todo, index) => {
        if (todo.order === undefined || todo.order === null) {
          todo.order = index;
          needsUpdate = true;
        }
      });

      // Save if we added order values
      if (needsUpdate) {
        await response.save();
      }
    }

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
    // Get existing todos to calculate the next order
    const existingDoc = await todoModel.findOne({ email, folderId });
    const nextOrder = existingDoc?.todos?.length || 0;

    const todoToPush = {
      todoId: nanoid(),
      content,
      status: "new",
      createdAt: new Date().toISOString(),
      completed: false,
      order: nextOrder,
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

todoRouter.put("/:folderId/:todoId", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  const { todoId, folderId } = req.params;
  const updates = req.body;

  if (!todoId || !folderId)
    return res.status(400).json({ message: "todoId or folderId missing" });

  try {
    // Build the update object for the specific todo in the array
    const setFields = {};
    if (updates.content !== undefined) {
      setFields["todos.$.content"] = updates.content;
    }
    if (updates.completed !== undefined) {
      setFields["todos.$.completed"] = updates.completed;
    }
    if (updates.order !== undefined) {
      setFields["todos.$.order"] = updates.order;
    }

    const response = await todoModel.findOneAndUpdate(
      { email, folderId, "todos.todoId": todoId },
      { $set: setFields },
      { new: true }
    );

    if (!response) {
      return res.status(404).json({ message: "Todo not found" });
    }

    return res.json(response);
  } catch (error) {
    console.log("Update error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// Batch reorder endpoint
todoRouter.put("/:folderId/reorder/batch", authorizeJWT, async (req, res) => {
  const { email } = req.headers.user;
  const { folderId } = req.params;
  const { todos: reorderedTodos } = req.body; // Array of {todoId, order}

  if (!folderId || !reorderedTodos || !Array.isArray(reorderedTodos))
    return res.status(400).json({ message: "Invalid request" });

  try {
    // Get the current todo document
    const todoDoc = await todoModel.findOne({ email, folderId });

    if (!todoDoc) {
      return res.status(404).json({ message: "Todos not found" });
    }

    // Update order for each todo
    reorderedTodos.forEach(({ todoId, order }) => {
      const todo = todoDoc.todos.find((t) => t.todoId === todoId);
      if (todo) {
        todo.order = order;
      }
    });

    // Save the updated document
    await todoDoc.save();

    return res.json(todoDoc);
  } catch (error) {
    console.log("Reorder error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
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
