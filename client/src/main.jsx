import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { TasksProvider } from "./context/TasksContext.jsx";
import { DateProvider } from "./context/DateContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { UiProvider } from "./context/UiContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <DateProvider>
            <TasksProvider>
              <UiProvider>
                <App />
              </UiProvider>
            </TasksProvider>
          </DateProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
