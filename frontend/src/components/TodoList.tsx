import { useState, useEffect } from "react";
import Todo from "./Todo";
import {
  useGetTodoQuery,
  useReorderTodosMutation,
} from "../queries/todoqueries";
import { Loader } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const TodoList = () => {
  type todoType = {
    todoId: string;
    content: string;
    createdAt: Date;
    status: string;
    completed?: boolean;
    order?: number;
  };

  const { data: todosData, isPending: isGetTodoPending } = useGetTodoQuery();
  const { mutate: reorderTodos } = useReorderTodosMutation();
  const [localTodos, setLocalTodos] = useState<todoType[]>([]);

  // Initialize and sort todos by order
  useEffect(() => {
    const todos = todosData?.todos || [];

    if (todos.length > 0) {
      const sortedTodos = [...todos].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );
      setLocalTodos(sortedTodos);
    } else {
      // Clear localTodos when there are no todos (e.g., switching to empty folder)
      setLocalTodos([]);
    }
  }, [todosData]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalTodos((items) => {
        const oldIndex = items.findIndex((item) => item.todoId === active.id);
        const newIndex = items.findIndex((item) => item.todoId === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Prepare batch update with new orders
        const reorderedTodos = newItems.map((item, index) => ({
          todoId: item.todoId,
          order: index,
        }));

        // Send batch update to backend
        reorderTodos(reorderedTodos);

        return newItems;
      });
    }
  };

  if (isGetTodoPending)
    return (
      <div className="my-8 flex justify-center">
        <Loader className="animate-spin text-[#7c6ba8]" size={24} />
      </div>
    );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localTodos.map((todo) => todo.todoId)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 max-h-screen py-4">
          {localTodos.length > 0 ? (
            localTodos.map((todo: todoType) => {
              return (
                <Todo
                  key={todo.todoId}
                  text={todo.content}
                  todoId={todo.todoId}
                  date={todo.createdAt}
                  completed={todo.completed}
                  order={todo.order}
                />
              );
            })
          ) : (
            <div className="text-center py-12">
              <div className="text-[15px] text-[#6b5f88]">
                <span className="font-medium text-[#8b7fb8]">
                  No tasks yet.
                </span>{" "}
                Create your first task below.
              </div>
            </div>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default TodoList;
