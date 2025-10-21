import { motion } from "framer-motion";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { useDeleteTodoMutation } from "../queries/todoqueries";
import type { OptionsProps } from "../types/types";

export const Options = ({ setIsEditable, todoId }: OptionsProps) => {
  const { mutate: deleteMutate } = useDeleteTodoMutation();
  const handleDelete = () => {
    deleteMutate(todoId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex gap-2 border border-[#2d2740] py-2 rounded-lg px-3 absolute right-0 top-full mt-2 bg-[#1a1625] origin-top-right z-10 shadow-xl"
    >
      <button
        onClick={handleDelete}
        className="p-1 hover:bg-[#201a2e] rounded transition"
      >
        <MdDelete
          className="cursor-pointer text-[#c77272] hover:text-[#e88888] transition"
          size={18}
        />
      </button>
      <MdModeEdit
        className="cursor-pointer text-[#8b7fb8] hover:text-[#a395c9] transition p-1 hover:bg-[#201a2e] rounded"
        onClick={() => setIsEditable((prev: boolean) => !prev)}
        size={18}
      />
    </motion.div>
  );
};
