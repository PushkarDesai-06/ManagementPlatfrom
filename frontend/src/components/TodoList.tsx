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

  const {
    data: todosData,
    isPending: isGetTodoPending,
    isFetching,
  } = useGetTodoQuery();
  console.log(todosData);

  const todos = todosData?.todos || [];

  if (isGetTodoPending)
    return (
      <div className="my-8">
        <Loader className="animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col gap-2 p-4">
      {todos.length > 0 ? todos.map((todo: todoType) => {
        return (
          <Todo key={todo.todoId} text={todo.content} todoId={todo.todoId} date={todo.createdAt} />
        );
      }) : (<div className="text-lg text-neutral-600 font-ubuntu">
        <span className="font-semibold">No Todos!</span> Add your first one.
      </div>)}
      {isFetching && (
        <div className="my-8 flex justify-center">
          <Loader className="animate-spin" />
        </div>
      )}
    </div>
  );
};

export default TodoList;
