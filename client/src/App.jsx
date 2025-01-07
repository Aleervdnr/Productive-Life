import {Routes, Route, useLocation } from "react-router-dom";
import LoginRegisterpage from "./pages/LoginRegisterpage";
import { useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import NavBar from "./components/NavBar";
import { useEffect, useState } from "react";
import TasksPage from "./pages/TasksPage";
import { Toaster } from "sonner";
import "./App.css";
import GastosPage from "./pages/GastosPage";
import VerifyEmailToken from "./pages/VerifyEmail";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import { initializeAnalytics, trackPageView } from "./libs/analytics";

function App() {
  const [activeItem, setActiveItem] = useState("home");
  const { isAuthenticated } = useAuth();

  const location = useLocation();

  useEffect(() => {
    initializeAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return (
    <main
      className={`${
        isAuthenticated
          ? `grid grid-rows-[55px,calc(100vh-55px)] lg:grid-cols-[220px_1fr]`
          : ""
      } `}
    >
      <Routes>
        <Route path="/" element={<LoginRegisterpage />} />
        <Route path="/verify-email-token" element={<VerifyEmailToken />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route element={<ProtectedRoute />}>
          {/* <Route
              path="/home"
              element={<Homepage setActiveItem={setActiveItem} />}
            /> */}
          <Route
            path="/tasks"
            element={<TasksPage setActiveItem={setActiveItem} />}
          />
          <Route
            path="/gastos"
            element={<GastosPage setActiveItem={setActiveItem} />}
          />
          {/* <Route path="/compras" element={<ComprasPage setActiveItem={setActiveItem}/>} /> */}
        </Route>
      </Routes>
      <Toaster theme="dark" richColors expand={true} />
      <NavBar activeItem={activeItem} />
    </main>
  );
}

export default App;
