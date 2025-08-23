import React from "react";

export type AlertContextInterface = {
  alert: {
    title: string;
    message: string;
  };
  openAlert: (title: string, message: string) => void;
  closeAlert: () => void;
  timeRef: React.Ref<number | null>;
  showAlert: boolean;
};

export const alertContext = React.createContext<AlertContextInterface>({
  alert: {
    title: "",
    message: "",
  },
  openAlert: () => {},
  closeAlert: () => {},
  timeRef: null,
  showAlert: false,
});
