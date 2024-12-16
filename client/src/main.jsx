import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { TasksProvider } from "./context/TasksContext.jsx";
import { DateProvider } from "./context/DateContext.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DateProvider>
          <TasksProvider>
            <App />
          </TasksProvider>
        </DateProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
