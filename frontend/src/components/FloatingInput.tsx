import { useState } from "react";
import { IoAddCircle } from "react-icons/io5";
import { useAddTodoMutation } from "../queries/todoqueries";

export const FloatingInput = () => {
  const [newTodoValue, setNewTodoValue] = useState("");

  const { mutate: addTodoMutation, isPending: isAddTodoPending } =
    useAddTodoMutation();

  const addTodo = (content: string) => {
    addTodoMutation(content);
  };

  return (
    <div className="w-full max-w-4xl shadow-black shadow-lg z-50">
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          addTodo(newTodoValue);
          setNewTodoValue("");
        }}
        className="flex items-center gap-3 bg-[#1a1625] border border-[#2d2740] rounded-lg p-3"
      >
        <input
          name=""
          id=""
          required={true}
          minLength={3}
          placeholder="Add a new task..."
          value={newTodoValue}
          onChange={(e) => setNewTodoValue(e.target.value)}
          className="flex-1 px-3 py-2 outline-0 bg-transparent text-[#c4b8e0] placeholder-[#5a4f73] text-[15px]"
        />
        <button
          className="cursor-pointer text-[#7c6ba8] hover:text-[#8b7fb8] transition p-2 rounded-lg hover:bg-[#201a2e]"
          disabled={isAddTodoPending}
          type="submit"
        >
          <IoAddCircle size={"24px"} />
        </button>
      </form>
    </div>
  );
};
