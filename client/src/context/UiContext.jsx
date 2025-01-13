import { createContext, useContext, useState } from "react";

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
  const [overlayIsClicked, setOverlayIsClicked] = useState(false);

  return (
    <UiContext.Provider
      value={{
        overlayActive,
        setOverlayActive,
        taskFormActive,
        setTaskFormActive,
        overlayIsClicked,
        setOverlayIsClicked,
      }}
    >
      {children}
    </UiContext.Provider>
  );
};
