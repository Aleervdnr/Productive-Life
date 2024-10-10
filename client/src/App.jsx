import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginRegisterpage from "./pages/LoginRegisterpage";
import { useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import NavBar from "./components/NavBar";
import { useState } from "react";
import Homepage from "./pages/Homepage";
import TasksPage from "./pages/TasksPage";

function App() {
  const [activeItem, setActiveItem] = useState("home");
  const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
      <main
        className={`${
          isAuthenticated ? `grid grid-rows-[55px,calc(100vh-55px)] lg:grid-cols-[220px_1fr]` : ""
        } `}
      >
        <Routes>
          <Route path="/" element={<LoginRegisterpage />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/home"
              element={<Homepage setActiveItem={setActiveItem} />}
            />
            <Route
              path="/tasks"
              element={<TasksPage setActiveItem={setActiveItem} />}
            />
            <Route path="/gastos" element={<h1>Gastos</h1>} />
            <Route path="/compras" element={<h1>Compras</h1>} />
          </Route>
        </Routes>
        <NavBar activeItem={activeItem} />
      </main>
    </BrowserRouter>
  );
}

export default App;