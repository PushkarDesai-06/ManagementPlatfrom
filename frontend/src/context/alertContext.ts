import React from "react";

export type AlertContextType = {
  alert: {
    title: string;
    message: string;
  };
  openAlert: (title: string, message: string) => void;
  closeAlert: () => void;
  timeRef: React.Ref<number | null>;
  showAlert: boolean;
};

export const AlertContext = React.createContext<AlertContextType>({
  alert: {
    title: "",
    message: "",
  },
  openAlert: () => {},
  closeAlert: () => {},
  timeRef: null,
  showAlert: false,
});
