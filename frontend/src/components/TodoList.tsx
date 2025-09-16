import React, { useState } from "react";
import Todo from "./Todo";
import { IoAddCircle } from "react-icons/io5";
import { useGetTodoQuery } from "../queries/todoqueries";
import { FloatingInput } from "./FloatingInput";
import { Loader } from "lucide-react";

const TodoList = () => {
  type todoType = {
    todoId: string;
    content: string;
    createdAt: Date;
    status: string;
  };

  const {
    data: todosData,
    isPending: isGetTodoPending,
    isFetching,
  } = useGetTodoQuery();
  console.log(todosData);

  const todos = todosData?.[0]?.todos || [];

  if (isGetTodoPending)
    return (
      <div className="my-8">
        <Loader className="animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col gap-2 p-4">
      {todos.map((todo: todoType) => {
        return (
          <Todo key={todo.todoId} text={todo.content} todoId={todo.todoId} />
        );
      })}
      {isFetching && (
        <div className="my-8">
          <Loader className="animate-spin" />
        </div>
      )}
    </div>
  );
};

export default TodoList;
