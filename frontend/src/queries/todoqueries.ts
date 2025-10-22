import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTodo, deleteTodo, getTodos } from "../api/todos";
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
        const newTodo = {
          todoId: `temp-${Date.now()}`,
          content,
          completed: false,
          folderId: activeFolderId,
          createdAt: new Date().toISOString(),
          status: "pending",
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
