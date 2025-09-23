import { motion } from "framer-motion";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { useDeleteTodoMutation } from "../queries/todoqueries";
import type { OptionsProps, TodoProps } from "../types/types";

export const Options = ({ setIsEditable, todoId }: OptionsProps) => {
  const { mutate: deleteMutate, isPending: isDeletePending } =
    useDeleteTodoMutation();
  const handleDelete = () => {
    deleteMutate(todoId);
  };

  return (
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
        onClick={() => setIsEditable((prev: boolean) => !prev)}
      />
    </motion.div>
  );
};
