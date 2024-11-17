import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginRegisterpage from "./pages/LoginRegisterpage";
import { useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import NavBar from "./components/NavBar";
import { useState } from "react";
import Homepage from "./pages/Homepage";
import TasksPage from "./pages/TasksPage";
import { Toaster } from "sonner";
import "./App.css";
import GastosPage from "./pages/GastosPage";
import ComprasPage from "./pages/ComprasPage";

function App() {
  const [activeItem, setActiveItem] = useState("home");
  const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
      <main
        className={`${
          isAuthenticated
            ? `grid grid-rows-[55px,calc(100vh-55px)] lg:grid-cols-[220px_1fr]`
            : ""
        } `}
      >
        <Routes>
          <Route path="/" element={<LoginRegisterpage />} />
          <Route element={<ProtectedRoute />}>
            {/* <Route
              path="/home"
              element={<Homepage setActiveItem={setActiveItem} />}
            /> */}
            <Route
              path="/tasks"
              element={<TasksPage setActiveItem={setActiveItem} />}
            />

            <Route path="/*" element={<Navigate to="/"></Navigate>} />

            <Route path="/gastos" element={<GastosPage setActiveItem={setActiveItem} />} />
            <Route path="/compras" element={<ComprasPage setActiveItem={setActiveItem}/>} />

          </Route>
        </Routes>
        <Toaster theme="dark" richColors />
        <NavBar activeItem={activeItem} />
      </main>
    </BrowserRouter>
  );
}

export default App;
