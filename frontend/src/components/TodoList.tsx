import React from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import Todo from "./Todo";

const TodoList = () => {
  return (
    <div className="flex flex-col gap-2">
      <Todo />
      <Todo />
      <Todo />
    </div>
  );
};

export default TodoList;
