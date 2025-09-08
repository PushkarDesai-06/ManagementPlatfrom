import React, { useState } from "react";
import Todo from "./Todo";
import { IoAddCircle } from "react-icons/io5";

const TodoList = () => {
  const [todos, setTodos] = useState<
    { title: string; status: "new" | "completed" }[]
  >([
    { title: "This is todo one", status: "new" },
    { title: "This is todo two", status: "new" },
  ]);
  const [newTodoValue, setNewTodoValue] = useState("");

  const addTodo = () => {
    setTodos((prev) => [...prev, { title: newTodoValue, status: "new" }]);
    setNewTodoValue("");
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      {todos.map((todo, idx) => {
        return <Todo key={idx} text={todo.title} />;
      })}

      <div className="border flex flex-col rounded-2xl overflow-hidden absolute bottom-4 min-w-sm w-lg">
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            addTodo();
          }}
        >
          <input
            name=""
            id=""
            placeholder="Add your todo here!"
            value={newTodoValue}
            onChange={(e) => setNewTodoValue(e.target.value)}
            className="flex-1 rounded-2xl px-4 py-2 outline-0 w-full h-fit overflow-hidden"
          />
          <div className="flex justify-end w-full">
            <button className="cursor-pointer">
              <IoAddCircle size={"28px"} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoList;
