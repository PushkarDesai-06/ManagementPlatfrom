import React, { useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { motion } from "framer-motion";
import type { TodoProps } from "../types/types";
import { Options } from "./Options";

const Todo = ({
  text = "Lorem ipsum dolor sit, amet consectetur",
  todoId,
  date,
}: TodoProps) => {
  const [showOptions, setShowOptins] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [todoText, setTodoText] = useState<string>(text);
  const handleOptionsClick = () => {
    setShowOptins((prev) => !prev);
  };
  const prevTodo = useRef<string>(text);
  const todoRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    //handle the saving of the todos
    // escape to go back, enter to save
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
    };
  }, [isEditable]);

  useEffect(() => {
    // handle clikcing outside to close open potions popup
    const mouseClickHandler = () => {
      setShowOptins(false);
    };

    window.addEventListener("click", () => mouseClickHandler());

    return () => {
      window.removeEventListener("click", () => mouseClickHandler());
    };
  }, []);

  const parseDate = (date: Date) => {
    if (!date) return "";
    return new Date(date.toString());
  };

  const usableDate = parseDate(date);

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className={`border w-xl flex px-2 items-center rounded-md relative
            ${isEditable && "bg-neutral-200"}
        `}
    >
      <div className="border-r px-2 mr-2 w-20 text-sm text-neutral-600">
        {usableDate
          ? `${usableDate.getDate()} ${usableDate.getHours()}:${usableDate.getMinutes()}`
          : "new"}
      </div>
      <div
        className={`flex-1 overflow-x-auto text-nowrap min-h-8 flex items-center`}
      >
        <input
          ref={todoRef}
          disabled={!isEditable}
          className={`flex items-center w-[90%] outline-0 cursor-default 
            `}
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />
      </div>

      {showOptions && (
        <Options
          isEditable={isEditable}
          setIsEditable={setIsEditable}
          todoId={todoId}
        />
      )}
      <button
        className="cursor-pointer transition"
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
