import { createContext, type Ref } from "react";

export type AlertContextType = {
  alert: {
    title: string;
    message: string;
  };
  openAlert: (title: string, message: string) => void;
  closeAlert: () => void;
  timeRef: Ref<number | null>;
  showAlert: boolean;
};

export const AlertContext = createContext<AlertContextType>({
  alert: {
    title: "",
    message: "",
  },
  openAlert: () => {},
  closeAlert: () => {},
  timeRef: null,
  showAlert: false,
});
