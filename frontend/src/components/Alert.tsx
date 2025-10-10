import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { createPortal } from "react-dom";
import { AlertContext } from "../context/alertContext";

const Alert = () => {
  const { alert, closeAlert, showAlert } = useContext(AlertContext);

  return (
    <>
      {showAlert &&
        createPortal(
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0, y: -10 }}
              className={
                "absolute top-8 right-4 border border-[#2d2740] p-4 rounded-lg min-w-sm overflow-hidden z-50 bg-[#1a1625] shadow-xl"
              }
            >
              <button
                className="absolute top-2 right-2 cursor-pointer z-10 hover:text-[#c77272] transition font-bold text-[#6b5f88] text-lg leading-none"
                onClick={closeAlert}
              >
                ×
              </button>
              <h1 className="text-sm font-semibold text-[#e8e3f5] mb-1.5 pr-6">
                {alert.title}
              </h1>
              <p className="text-sm text-[#8b7fb8] w-full mb-2">
                {alert.message}
              </p>
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex">
                <div className="bg-[#7c6ba8] h-[2px] w-full animate-shrink5s"></div>
              </div>
            </motion.div>
          </AnimatePresence>,
          document.getElementById("alert-root")!
        )}
    </>
  );
};

export default Alert;
