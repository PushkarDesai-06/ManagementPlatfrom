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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", activeFolderId] });
    },
    onError: () => {
      openAlert(
        "Error adding todo",
        "There is a server error, Plase try again later"
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", activeFolderId] });
    },
    onError: () => {
      openAlert(
        "Error deleting todo",
        "There is a server error, Plase try again later"
      );
    },
  });

  return { mutate, isPending };
};
