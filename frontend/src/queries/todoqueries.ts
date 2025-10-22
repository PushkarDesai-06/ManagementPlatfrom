import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  reorderTodos,
} from "../api/todos";
import React from "react";
import { FolderContext } from "../context/folderContext";
import { AlertContext } from "../context/alertContext";

export const useGetTodoQuery = () => {
  const { activeFolderId } = React.useContext(FolderContext);

  const { data, isPending, isFetching } = useQuery({
    queryKey: ["todos", activeFolderId],
    queryFn: async () => await getTodos(activeFolderId),
    enabled: !!activeFolderId, // Only run query if folderId exists
  });

  return { data, isPending, isFetching };
};

export const useAddTodoMutation = () => {
  const queryClient = useQueryClient();
  const { activeFolderId } = React.useContext(FolderContext);
  const { openAlert } = React.useContext(AlertContext);
  const { mutate, isPending } = useMutation({
    mutationFn: (content: string) => addTodo(activeFolderId, content),
    onMutate: async (content) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["todos", activeFolderId] });

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData(["todos", activeFolderId]);

      // Optimistically add new todo
      queryClient.setQueryData(["todos", activeFolderId], (old: any) => {
        // Calculate next order (should be at the end)
        const nextOrder = old?.todos?.length || 0;

        const newTodo = {
          todoId: `temp-${Date.now()}`,
          content,
          completed: false,
          folderId: activeFolderId,
          createdAt: new Date().toISOString(),
          status: "pending",
          order: nextOrder,
        };

        // Handle the API response structure {todos: [...]}
        if (old?.todos) {
          return {
            ...old,
            todos: [...old.todos, newTodo],
          };
        }

        return { todos: [newTodo] };
      });

      return { previousTodos };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", activeFolderId] });
    },
    onError: (_err, _content, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ["todos", activeFolderId],
        context?.previousTodos
      );
      openAlert(
        "Error adding todo",
        "There is a server error, Please try again later"
      );
    },
  });

  return { mutate, isPending };
};

export const useDeleteTodoMutation = () => {
  const queryClient = useQueryClient();
  const { activeFolderId } = React.useContext(FolderContext);
  const { openAlert } = React.useContext(AlertContext);
  const { mutate, isPending } = useMutation({
    mutationFn: (todoId: string) => deleteTodo(activeFolderId, todoId),
    onMutate: async (todoId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["todos", activeFolderId] });

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData(["todos", activeFolderId]);

      // Optimistically remove todo
      queryClient.setQueryData(["todos", activeFolderId], (old: any) => {
        if (!old) return old;

        // Handle the API response structure {todos: [...]}
        if (old?.todos) {
          return {
            ...old,
            todos: old.todos.filter((todo: any) => todo.todoId !== todoId),
          };
        }

        return old;
      });

      return { previousTodos };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", activeFolderId] });
    },
    onError: (_err, _todoId, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ["todos", activeFolderId],
        context?.previousTodos
      );
      openAlert(
        "Error deleting todo",
        "There is a server error, Please try again later"
      );
    },
  });

  return { mutate, isPending };
};

export const useUpdateTodoMutation = () => {
  const queryClient = useQueryClient();
  const { activeFolderId } = React.useContext(FolderContext);
  const { openAlert } = React.useContext(AlertContext);
  const { mutate, isPending } = useMutation({
    mutationFn: ({
      todoId,
      updates,
    }: {
      todoId: string;
      updates: { content?: string; completed?: boolean; order?: number };
    }) => updateTodo(activeFolderId, todoId, updates),
    onMutate: async ({ todoId, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["todos", activeFolderId] });

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData(["todos", activeFolderId]);

      // Optimistically update todo
      queryClient.setQueryData(["todos", activeFolderId], (old: any) => {
        if (!old?.todos) return old;

        return {
          ...old,
          todos: old.todos.map((todo: any) =>
            todo.todoId === todoId ? { ...todo, ...updates } : todo
          ),
        };
      });

      return { previousTodos };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", activeFolderId] });
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ["todos", activeFolderId],
        context?.previousTodos
      );
      openAlert(
        "Error updating todo",
        "There is a server error, Please try again later"
      );
    },
  });

  return { mutate, isPending };
};

export const useReorderTodosMutation = () => {
  const queryClient = useQueryClient();
  const { activeFolderId } = React.useContext(FolderContext);
  const { openAlert } = React.useContext(AlertContext);
  const { mutate, isPending } = useMutation({
    mutationFn: (todos: { todoId: string; order: number }[]) =>
      reorderTodos(activeFolderId, todos),
    onMutate: async (reorderedTodos) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["todos", activeFolderId] });

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData(["todos", activeFolderId]);

      // Optimistically reorder todos
      queryClient.setQueryData(["todos", activeFolderId], (old: any) => {
        if (!old?.todos) return old;

        const todosMap = new Map(
          old.todos.map((todo: any) => [todo.todoId, todo])
        );

        // Update orders
        reorderedTodos.forEach(({ todoId, order }) => {
          const todo = todosMap.get(todoId);
          if (todo) {
            (todo as any).order = order;
          }
        });

        // Sort by order
        const sortedTodos = Array.from(todosMap.values()).sort(
          (a: any, b: any) => (a.order || 0) - (b.order || 0)
        );

        return {
          ...old,
          todos: sortedTodos,
        };
      });

      return { previousTodos };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", activeFolderId] });
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ["todos", activeFolderId],
        context?.previousTodos
      );
      openAlert(
        "Error reordering todos",
        "There is a server error, Please try again later"
      );
    },
  });

  return { mutate, isPending };
};
