import { useLanguage } from "../context/LanguageContext";
import landingTranslations from "../translations/landing.translation.json"
import navTranslations from "../translations/nav.translation.json"
import tasksTranslations from "../translations/tasks.translation.json"

const allTranslations = {
  landing: landingTranslations,
  nav: navTranslations,
  tasks: tasksTranslations
};

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key) => {
    try {
      const [file, ...keys] = key.split(".");

      let translation = allTranslations[file]?.[language];
      keys.forEach((k) => {
        translation = translation?.[k];
      });

      return translation || "Traducción no encontrada";
    } catch (error) {
      console.error("Error al cargar la traducción:", error);
      return "Error en la traducción";
    }
  };

  return { t };
};;