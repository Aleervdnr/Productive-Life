import React, { useState, useEffect } from "react";
import { MdOutlinePause } from "react-icons/md";
import { IoIosPlay } from "react-icons/io";
import { MdStop } from "react-icons/md";
import { FaUndo } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { IoChevronBackOutline } from "react-icons/io5";

const PomodoroTimer = () => {
  const workOptions = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60]; // Opciones de trabajo
  const breakOptions = [5, 10, 15, 20, 25]; // Opciones de descanso
  const sessionOptions = [1, 2, 3, 4, 5, 6, 7, 8]; // Opciones de sesiones

  const [workTime, setWorkTime] = useState(25); // Minutos de trabajo
  const [breakTime, setBreakTime] = useState(5); // Minutos de descanso
  const [sessions, setSessions] = useState(4); // Número total de sesiones
  const [currentSession, setCurrentSession] = useState(1); // Sesión actual
  const [timeLeft, setTimeLeft] = useState(workTime * 60); // Tiempo restante en segundos
  const [isRunning, setIsRunning] = useState(false); // Estado del temporizador
  const [isWorkMode, setIsWorkMode] = useState(true); // Modo de trabajo o descanso
  const [settingsMode, setSettingsMode] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionSwitch();
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleSessionSwitch = () => {
    if (isWorkMode) {
      setTimeLeft(breakTime * 60); // Cambiar al tiempo de descanso
    } else {
      if (currentSession < sessions) {
        setTimeLeft(workTime * 60); // Cambiar al tiempo de trabajo
        setCurrentSession((prev) => prev + 1);
      } else {
        setIsRunning(false);
        setCurrentSession(1); // Reiniciar el contador de sesiones
        setTimeLeft(workTime * 60);
        alert("¡Has completado todas las sesiones!");
      }
    }
    setIsWorkMode((prev) => !prev);
  };

  const handleStartPause = () => {
    setIsRunning((prevState) => !prevState);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentSession(1);
    setIsWorkMode(true);
    setTimeLeft(workTime * 60);
  };

  const handleRepeat = () => {
    setIsWorkMode(true);
    setTimeLeft(workTime * 60);
  };

  const handleDropdownChange = (setter, value, isWorkTime) => {
    if (!isRunning && isWorkTime) {
      setter(Number(value));
      setTimeLeft(isWorkMode ? value * 60 : timeLeft); // Reinicia al modo actual
    } else if (!isRunning) {
      setter(Number(value));
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-full hidden lg:flex lg:flex-col lg:border-[2px] lg:border-dark-400 lg:rounded-lg overflow-hidden">
      <div className=" px-6 pt-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Pomodoro Timer</h1>
        <button
          onClick={() => setSettingsMode((prev) => !prev)}
          className="h-8 w-8 grid place-content-center text-white bg-violet-main rounded-full "
        >
          {settingsMode ? <IoChevronBackOutline /> : <FaGear />}
        </button>
      </div>

      <div
        className={`grid grid-cols-[repeat(2,100%)] h-full ${
          settingsMode ? "translate-x-[-100%]" : "translate-x-0"
        }  text-white  transition-transform duration-500`}
      >
        <div className="px-6 h-full flex flex-col justify-center gap-2 text-center">
          <h2 className="text-xl font-semibold">
            {isWorkMode ? "Enfocate!" : "Descansa"}
          </h2>
          <div>
            <h1 className="text-5xl font-bold">{formatTime(timeLeft)}</h1>
            <p className="text-sm">
              Sesión {currentSession} de {sessions}
            </p>
          </div>

          <div className="w-full flex items-center justify-center gap-2">
            <button
              className="w-8 h-8 grid place-content-center text-white bg-violet-main rounded-full"
              onClick={handleRepeat}
            >
              <FaUndo className="text-xs" />
            </button>
            <button
              onClick={handleStartPause}
              className="w-9 h-9 grid place-content-center text-white bg-violet-main rounded-full "
            >
              {isRunning ? <MdOutlinePause /> : <IoIosPlay />}
            </button>
            <button
              onClick={handleReset}
              className="h-8 w-8 grid place-content-center text-white bg-violet-main rounded-full "
            >
              <MdStop />
            </button>
          </div>
        </div>
        <div className="px-6">
          <div className="flex flex-col ">
            <label className="flex gap-2 items-center">
              <span className="text-sm font-medium">Tiempo de trabajo:</span>
              <select
                value={workTime}
                onChange={(e) =>
                  handleDropdownChange(setWorkTime, e.target.value, true)
                }
                disabled={isRunning}
                className="mt-2 px-4 py-2 bg-dark-500 border border-dark-200 rounded shadow-sm"
              >
                {workOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} min
                  </option>
                ))}
              </select>
            </label>

            <label className="flex gap-2 items-center">
              <span className="text-sm font-medium">Tiempo de descanso:</span>
              <select
                value={breakTime}
                onChange={(e) =>
                  handleDropdownChange(setBreakTime, e.target.value, false)
                }
                disabled={isRunning}
                className="mt-2 px-4 py-2 bg-dark-500 border border-dark-200 rounded shadow-sm"
              >
                {breakOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} min
                  </option>
                ))}
              </select>
            </label>

            <label className="flex gap-2 items-center">
              <span className="text-sm font-medium">Sesiones:</span>
              <select
                value={sessions}
                onChange={(e) =>
                  handleDropdownChange(setSessions, e.target.value, false)
                }
                disabled={isRunning}
                className="mt-2 px-4 py-2 bg-dark-500 border border-dark-200 rounded shadow-sm"
              >
                {sessionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
