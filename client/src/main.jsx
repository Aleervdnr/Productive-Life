import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { TasksProvider } from "./context/TasksContext.jsx";
import { DateProvider } from "./context/DateContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { UiProvider } from "./context/UiContext.jsx";
import { ExpensesProvider } from "./context/ExpensesContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DateProvider>
          <TasksProvider>
            <ExpensesProvider>
              <UiProvider>
                <App />
              </UiProvider>
            </ExpensesProvider>
          </TasksProvider>
        </DateProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
