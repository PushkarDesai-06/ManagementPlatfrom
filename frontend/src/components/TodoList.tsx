import React from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import Todo from "./Todo";

const TodoList = () => {
  return (
    <div className="flex flex-col gap-2 p-4">
      <div>
        <button className="border w-40 py-1 rounded-md">Add</button>
        <button className="border w-40 py-1 rounded-md">Add</button>
      </div>
      <Todo />
      <Todo />
      <Todo />
    </div>
  );
};

export default TodoList;
