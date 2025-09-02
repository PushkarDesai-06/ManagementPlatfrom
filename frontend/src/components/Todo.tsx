import React from "react";
import { HiDotsHorizontal } from "react-icons/hi";

const Todo = () => {
  return (
    <div className="border w-lg flex px-2 items-center rounded-md">
      <div className="flex-1 overflow-x-auto text-nowrap min-h-8 flex items-center">
        <div className="flex items-center">
        Lorem ipsum dolor sit, amet consectetur
        </div>
      </div>
      <button >
        <HiDotsHorizontal />
      </button>
    </div>
  );
};

export default Todo;
