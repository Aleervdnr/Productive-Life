// useTranslation.js
import { useContext } from "react";
import translations from "../translations/landing.translation.json"; // Importa tu archivo JSON
import { LanguageProvider, useLanguage} from "../context/LanguageContext";

export const useTranslation = () => {
  const { language } = useLanguage();

  // Función para obtener una traducción específica
  const t = (key) => {
    const keys = key.split(".");
    let translation = translations?.[language];
    keys.forEach((k) => {
      translation = translation?.[k];
    });

    return translation || "Traducción no encontrada";
  };

  return { t };
};