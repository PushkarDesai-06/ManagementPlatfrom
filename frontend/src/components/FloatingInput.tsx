import React, { useState } from "react";
import { IoAddCircle } from "react-icons/io5";
import { useAddTodoMutation, useGetTodoQuery } from "../queries/todoqueries";

export const FloatingInput = () => {
  const [newTodoValue, setNewTodoValue] = useState("");

  const { mutate: addTodoMutation } = useAddTodoMutation();

  const addTodo = (content: string) => {
    addTodoMutation(content);
  };

  return (
    <div className="border backdrop-blur-2xl flex flex-col rounded-2xl overflow-hidden absolute bottom-4 min-w-sm w-lg left-1/2">
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          addTodo(newTodoValue);
          setNewTodoValue("");
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
  );
};
