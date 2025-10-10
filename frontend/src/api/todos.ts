import axios from "../lib/axios";

export const getTodos = async (folderId: string) => {
  try {
    const res = await axios.get(`/todo?folderId=${folderId}`);
    return res.data;
  } catch (error) {
    throw new Error("Error fetching todos");
  }
};

export const addTodo = async (folderId: string, content: string) => {
  try {
    const res = await axios.post("/todo", {
      folderId,
      content,
    });

    return res.data;
  } catch (error) {
    throw new Error(`Error : ${error}`);
  }
};

export const deleteTodo = async (folderId: string, todoId: string) => {
  try {
    const response = await axios.delete(`/todo/${folderId}/${todoId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error : ${error}`);
  }
};
