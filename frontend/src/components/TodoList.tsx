import Todo from "./Todo";
import { useGetTodoQuery } from "../queries/todoqueries";
import { Loader } from "lucide-react";

const TodoList = () => {
  type todoType = {
    todoId: string;
    content: string;
    createdAt: Date;
    status: string;
  };

  const { data: todosData, isPending: isGetTodoPending } = useGetTodoQuery();

  const todos = todosData?.todos || [];

  if (isGetTodoPending)
    return (
      <div className="my-8 flex justify-center">
        <Loader className="animate-spin text-[#7c6ba8]" size={24} />
      </div>
    );

  return (
    <div className="flex flex-col gap-2 max-h-screen py-4">
      {todos.length > 0 ? (
        todos.map((todo: todoType) => {
          return (
            <Todo
              key={todo.todoId}
              text={todo.content}
              todoId={todo.todoId}
              date={todo.createdAt}
            />
          );
        })
      ) : (
        <div className="text-center py-12">
          <div className="text-[15px] text-[#6b5f88]">
            <span className="font-medium text-[#8b7fb8]">No tasks yet.</span>{" "}
            Create your first task below.
          </div>
        </div>
      )}
      {/* {isFetching && (
        <div className="my-4 flex justify-center">
          <Loader className="animate-spin text-[#7c6ba8]" size={20} />
        </div>
      )} */}
    </div>
  );
};

export default TodoList;
