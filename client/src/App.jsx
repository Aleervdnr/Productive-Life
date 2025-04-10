import { Routes, Route, useLocation } from "react-router-dom";
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
import { useUi } from "./context/UiContext";
import Landing from "./pages/Landing";
import ModalItemTask from "./components/ItemTask/ModalItemTask";
import { useTasks } from "./context/TasksContext";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import TesterRoute from "./TesterRoute";
import TesterFeedbackPage from "./pages/TesterFeedbackPage";

function App() {
  const [activeItem, setActiveItem] = useState("home");
  const { isAuthenticated } = useAuth();
  const { setTaskFormActive, setOverlayIsClicked, taskModalActive } = useUi();

  const { currentTask, parentTasks } = useTasks();

  const location = useLocation();

  useEffect(() => {
    initializeAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  const handleClickOverlay = () => {
    setOverlayIsClicked(true);
    setTimeout(() => {
      setOverlayIsClicked(false);
    }, 500);
  };

  return (
    <>
      {
        /* Verificar primero si currentTask está vacío */
        !currentTask ? null : <ModalItemTask />
      }
      <NavBar activeItem={activeItem} />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginRegisterpage />} />
        <Route path="/verify-email-token" element={<VerifyEmailToken />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/callback" element={<AuthCallback />}></Route>
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
          <Route element={<TesterRoute />}>
            <Route path="/tester-feedback" element={<TesterFeedbackPage />} />
          </Route>
          {/* <Route path="/compras" element={<ComprasPage setActiveItem={setActiveItem}/>} /> */}
        </Route>
        {/* Ruta de error para rutas desconocidas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster theme="dark" richColors expand={true} />
    </>
  );
}

export default App;
