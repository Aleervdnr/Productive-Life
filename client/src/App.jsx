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
import ModalItemTask from "./components/ItemTask.jsx/ModalItemTask";
import { useTasks } from "./context/TasksContext";

function App() {
  const [activeItem, setActiveItem] = useState("home");
  const { isAuthenticated } = useAuth();
  const {
    setTaskFormActive,
    setOverlayIsClicked,
    taskModalActive,
  } = useUi();

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
    <main
      className={`${
        isAuthenticated
          ? `grid grid-rows-[55px,calc(100vh-55px)] lg:grid-cols-[220px_1fr]`
          : ""
      } `}
    >
      {
        /* Verificar primero si currentTask está vacío */
        !currentTask ? null : currentTask.recurrenceOf ? (
          <ModalItemTask
            parentTask={parentTasks.find((pTask) => pTask._id == currentTask.recurrenceOf)}
            modalIsActive={taskModalActive}
          />
        ) : (
          <ModalItemTask
            modalIsActive={taskModalActive}
          />
        )
      }
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginRegisterpage />} />
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
