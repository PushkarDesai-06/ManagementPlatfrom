import React from "react";
import Todo from "./Todo";
import { IoAddCircle } from "react-icons/io5";

const TodoList = () => {
  return (
    <div className="flex flex-col gap-2 p-4">
      <Todo />
      <Todo />
      <Todo />

      <div className="border flex flex-col rounded-2xl overflow-hidden absolute bottom-4 min-w-sm w-lg">
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            name=""
            id=""
            placeholder="Add your todo here!"
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
