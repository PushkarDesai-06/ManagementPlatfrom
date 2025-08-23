import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { createPortal } from "react-dom";
import { alertContext } from "../context/alertContext";

const Alert = () => {
  const { alert, closeAlert, showAlert } = useContext(alertContext);

  return (
    <>
      {showAlert &&
        createPortal(
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0 }}
              className={
                "absolute top-8 right-4 backdrop-blur-2xl border p-2 px-4 text-white rounded-md min-w-sm overflow-hidden z-50"
              }
            >
              <button
                className="absolute top-0 right-2 cursor-pointer z-10 hover:text-red-500 transition font-bold"
                onClick={closeAlert}
              >
                x
              </button>
              <h1 className="text-md font-semibold text-neutral-50">
                {alert.title}
              </h1>
              <p className="text-sm text-neutral-300 w-full rounded-sm border-neutral-500 mb-2">
                {alert.message}
              </p>
              <div className="absolute bottom-0 rounded-md left-0 w-full flex">
                <div className="bg-neutral-300 h-[3px] w-full animate-shrink5s"></div>
              </div>
            </motion.div>
          </AnimatePresence>,
          document.getElementById("alert-root")!
        )}
    </>
  );
};

export default Alert;
