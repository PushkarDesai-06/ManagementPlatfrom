import { useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { GripVertical } from "lucide-react";
import { motion } from "framer-motion";
import type { TodoProps } from "../types/types";
import { Options } from "./Options";
import { useUpdateTodoMutation } from "../queries/todoqueries";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Todo = ({
  text = "Lorem ipsum dolor sit, amet consectetur",
  todoId,
  date,
  completed = false,
}: TodoProps) => {
  const [showOptions, setShowOptins] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [todoText, setTodoText] = useState<string>(text);
  const [isCompleted, setIsCompleted] = useState<boolean>(completed);
  const { mutate: updateTodo } = useUpdateTodoMutation();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todoId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const handleOptionsClick = () => {
    setShowOptins((prev) => !prev);
  };

  const handleCheckboxChange = () => {
    const newCompletedState = !isCompleted;
    setIsCompleted(newCompletedState);
    updateTodo({
      todoId,
      updates: { completed: newCompletedState },
    });
  };

  const prevTodo = useRef<string>(text);
  const todoRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    //handle the saving of the todos
    // escape to go back, enter to save
    const keyboardEventListener = (e: KeyboardEvent) => {
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
      ref={setNodeRef}
      style={style}
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
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing mr-2 text-[#5a4f73] hover:text-[#8b7fb8] transition-colors touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical size={18} />
      </button>

      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={handleCheckboxChange}
        className="w-5 h-5 rounded border-2 border-[#5a4f73] bg-[#13111c] checked:bg-[#6b4fd8] checked:border-[#6b4fd8] cursor-pointer mr-3 accent-[#6b4fd8] transition-all"
        aria-label="Mark as complete"
      />

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
            ${isCompleted ? "line-through opacity-50" : ""}
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
          handleOptionsClick();
        }}
      >
        <HiDotsHorizontal size={18} />
      </button>
    </motion.div>
  );
};

export default Todo;
