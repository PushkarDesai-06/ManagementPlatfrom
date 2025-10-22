import mongoose from "mongoose";

const todoSchema = mongoose.Schema(
  {
    email: { type: String, required: true },
    folderId: { type: String, required: false },
    todos: [
      {
        todoId: { type: String, required: true },
        content: { type: String, required: true },
        status: { type: String, required: true },
        createdAt: { type: Date, required: true },
        completed: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
      },
    ],
  },
  { collection: "Todo", timestamps: true }
);

const todoModel = mongoose.model("todoModel", todoSchema);
export default todoModel;
