import React, { useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";
import { motion } from "framer-motion";
import { useDeleteTodoMutation } from "../queries/todoqueries";

const Todo = ({
  text = "Lorem ipsum dolor sit, amet consectetur",
  todoId,
}) => {
  const [showOptions, setShowOptins] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [todoText, setTodoText] = useState<string>(text);
  const { mutate: deleteMutate, isPending } = useDeleteTodoMutation();

  const handleOptionsClick = () => {
    setShowOptins((prev) => !prev);
  };
  const prevTodo = useRef<string>(text);
  const todoRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    const keyboardEventListener = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setTodoText(prevTodo.current);
        setIsEditable(false);
      } else if (e.key === "Enter") {
        prevTodo.current = todoRef.current!.value;
        setIsEditable(false);
      }
    };

    window.addEventListener("keydown", keyboardEventListener);

    return () => {
      window.removeEventListener("keydown", keyboardEventListener);
      // console.log("removed");
    };
  }, [isEditable]);

  useEffect(() => {
    const mouseClickHandler = () => {
      setShowOptins(false);
    };

    window.addEventListener("click", () => mouseClickHandler());

    return () => {
      window.removeEventListener("click", () => mouseClickHandler());
    };
  }, []);

  const handleDelete = () => {
    deleteMutate(todoId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className={`border w-lg flex px-2 items-center rounded-md relative
            ${isEditable && "bg-neutral-200"}
        `}
    >
      <div
        className={`flex-1 overflow-x-auto text-nowrap min-h-8 flex items-center`}
      >
        <input
          ref={todoRef}
          disabled={!isEditable}
          className={`flex items-center w-[90%] outline-0 
            `}
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />
      </div>

      {showOptions && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          className="flex flex-col gap-2 border py-2 rounded-lg px-2 absolute right-0 top-full mt-1 backdrop-blur-sm  origin-top z-10"
        >
          <button onClick={handleDelete}>
            <MdDelete className="cursor-pointer" />
          </button>
          <MdModeEdit
            className="cursor-pointer"
            onClick={() => setIsEditable((prev) => !prev)}
          />
        </motion.div>
      )}
      <button
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          handleOptionsClick(e);
        }}
      >
        <HiDotsHorizontal />
      </button>
    </motion.div>
  );
};

export default Todo;
