export const useLocalStorage = (key: string) => {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return data;
  } catch (error) {
    return localStorage.getItem(key);
  }
};
