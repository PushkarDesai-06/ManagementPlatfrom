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
  const handleOptionsClick = (e?: React.MouseEvent) => {
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

  const formatDate = (date: Date) => {
    if (!date) return { date: "New", time: "" };
    const d = new Date(date.toString());
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const isYesterday =
      new Date(now.setDate(now.getDate() - 1)).toDateString() ===
      d.toDateString();

    let dateStr = "";
    if (isToday) dateStr = "Today";
    else if (isYesterday) dateStr = "Yesterday";
    else
      dateStr = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

    const timeStr = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return { date: dateStr, time: timeStr };
  };

  const { date: displayDate, time: displayTime } = formatDate(date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full flex px-4 py-3 items-center rounded-lg relative
            ${
              isEditable
                ? "bg-[#2a2440] border-[#6b4fd8]"
                : "bg-[#1a1625] border-[#2d2740] hover:bg-[#201a2e]"
            } border transition-all duration-200
        `}
    >
      <div className="flex flex-col mr-4 min-w-[80px]">
        <div className="text-[11px] font-medium text-[#8b7fb8] uppercase tracking-wide">
          {displayDate}
        </div>
        {displayTime && (
          <div className="text-[10px] text-[#6b5f88]">{displayTime}</div>
        )}
      </div>
      <div className="h-8 w-[1px] bg-[#2d2740] mr-4"></div>
      <div className={`flex-1 overflow-x-auto text-nowrap flex items-center`}>
        <input
          ref={todoRef}
          disabled={!isEditable}
          className={`flex items-center w-full outline-0 cursor-default bg-transparent text-[15px]
            ${isEditable ? "text-[#e8e3f5]" : "text-[#c4b8e0]"}
            `}
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />
      </div>

      {showOptions && <Options setIsEditable={setIsEditable} todoId={todoId} />}
      <button
        className="cursor-pointer transition hover:text-[#8b7fb8] text-[#5a4f73] ml-2"
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          handleOptionsClick(e);
        }}
      >
        <HiDotsHorizontal size={18} />
      </button>
    </motion.div>
  );
};

export default Todo;
