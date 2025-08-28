import React, { useState } from "react";
import { createPortal } from "react-dom";
import Class from "./Class";

const Sidebar = () => {
  const arr = ["title 1", "title 2", "title 3", "title 4", "title 5"];
  const [openIdx, setOpenIdx] = useState<number>(-1);
  return (
    <aside
      className="h-screen max-w-xs p-4 flex flex-col shadow-xl bg-neutral-100"
      onClickCapture={() => setOpenIdx(-1)}
    >
      <div className="flex flex-row-reverse justify-between">
        <div>X</div>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto items-center">
        <div className="w-3xs p-4 flex flex-col gap-2 overflow-y-auto">
          {arr.map((elem, idx) => (
            <Class
              title={elem}
              index={idx}
              openIdx={openIdx}
              setOpenIdx={setOpenIdx}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
