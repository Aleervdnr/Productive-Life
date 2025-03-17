import { createContext, useContext, useEffect, useState } from "react";

export const UiContext = createContext();

export const useUi = () => {
  const context = useContext(UiContext);
  if (!context) {
    throw new Error("useUi necesita ser usado dentro de UiProvider");
  }
  return context;
};

export const UiProvider = ({ children }) => {
  const [overlayActive, setOverlayActive] = useState(false);
  const [taskFormActive, setTaskFormActive] = useState(false);
  const [taskModalActive, setTaskModalActive] = useState(false);
  const [overlayIsClicked, setOverlayIsClicked] = useState(false);

  const scrollbarStyles = {
    overflowY: "auto",
    overflowX: 'hidden',
    scrollbarWidth: "thin", // Firefox
    scrollbarColor: "#6b7280 transparent", // Firefox
  };

  //TaskModal  

  return (
    <UiContext.Provider
      value={{
        overlayActive,
        setOverlayActive,
        taskFormActive,
        setTaskFormActive,
        taskModalActive,
        setTaskModalActive,
        overlayIsClicked,
        setOverlayIsClicked,
        scrollbarStyles
      }}
    >
      {children}
    </UiContext.Provider>
  );
};
