import { X } from "lucide-react";
import { useState } from "react";
import useWindowSize from "../hooks/useWindowSize";
export default function Modal({ children, id, tabs, title }) {
  const [activeTab, setActiveTab] = useState(1);
  const { width } = useWindowSize();
  const handleClose = () => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.close();
    }
  };
  const handleClickOverlay = (e) => {
    if (e.target.id == id) {
      handleClose();
    }
  };
  return (
    <dialog
      id={id}
      className={`fixed w-screen h-screen max-w-none max-h-none z-[999] m-0 overflow-hidden bg-[#0006] grid place-content-center opacity-0 modal-task invisible transition-opacity`}
      onClick={(e) => handleClickOverlay(e)}
    >
      <div
        className={`transition-opacity delay-300 bg-dark-500 rounded-md w-[calc(100vw-20px)] lg:w-fit lg:min-w-96 h-fit
         `}
      >
        {/* Header con tabs y botón de cerrar */}
        <div className={tabs ? `border-b border-gray-700` : ""}>
          <div className="flex items-center justify-between px-4">
            {title && <h3 className="font-bold capitalize">{title}</h3>}
            <div className="flex">
              {tabs?.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center px-4 py-3 border-b-2 transition-colors w-fit focus:outline-none ${
                    activeTab === tab.id
                      ? "border-[#7E73FF] text-[#7E73FF]"
                      : "border-transparent text-gray-400 hover:text-gray-300 "
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}

                  <span
                    className={`${
                      width < 720 && activeTab !== tab.id ? "hidden" : ""
                    } ${activeTab == tab.id && "text-white"} pl-1 `}
                  >
                    {tab.title}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-300"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        {children}
      </div>
    </dialog>
  );
}
