// LanguageContext.js
import { createContext, useState, useEffect, useContext } from "react";

export const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage necesita ser usado dentro de DateProvider");
  }
  return context;
}

export const LanguageProvider = ({ children }) => {
  // Detectar el idioma del navegador
  const browserLanguage = navigator.language.split("-")[0] || "en";
  const defaultLanguage = browserLanguage === "es" ? "es" : "en";

  // Estado para almacenar el idioma actual
const [language, setLanguage] = useState(() => {
  const savedLanguage = localStorage.getItem("language");
  return savedLanguage || defaultLanguage;
});

  // Función para cambiar el idioma
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};