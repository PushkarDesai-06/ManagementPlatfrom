const useLocalStorage = () => {
  const setLocalStorage = (key: string, value: Record<any, any>) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getLocalStorage = (key: string) => {
    if (key === "JwtToken") return localStorage.getItem(key);
    return JSON.parse(localStorage.getItem(key)!);
  };
  const removeLocalStorage = (key: string) => {
    localStorage.removeItem(key);
  };

  return { setLocalStorage, getLocalStorage, removeLocalStorage };
};

export default useLocalStorage;
