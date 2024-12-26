import { useEffect, useState } from "react";
import TodayTasks from "../components/widgets-tasks/TodayTasks";
import WeekTasks from "../components/widgets-tasks/WeekTasks";
import MonthTasks from "../components/widgets-tasks/MonthTasks";
import { useTasks } from "../context/TasksContext.jsx";
import TaskFormButton from "../components/taskForm/TaskFormButton.jsx";
import { isSameDay, isSameMonth, isSameWeek } from "date-fns";
import { todayDate } from "../libs/Dates.js";
import CardsProgress from "../components/widgets-tasks/CardsProgress.jsx";
import Joyride from "react-joyride";
import Logo from "../assets/Logo.png";

export default function TasksPage({ setActiveItem }) {
  const { getTasks, tasks, setTasksIsLoading } = useTasks();

  const [dropDownState, setDropDownState] = useState("Progreso Mensual");

  const handleChangeDropDown = () => {
    if (dropDownState == "Progreso Mensual") return monthlyTasks;
    if (dropDownState == "Progreso Semanal") return weeklyTasks;
    if (dropDownState == "Progreso Diario") return todayTasks;
  };

  useEffect(() => {
    setActiveItem("tasks");
    getTasks();
  }, []);

  const [tabActive, setTabActive] = useState("hoy");

  const handleChangeTab = (name) => {
    setTabActive(name);
  };

  const todayTasks = tasks.filter((task) =>
    isSameDay(new Date(task.taskDate), new Date(todayDate))
  );

  const weeklyTasks = tasks.filter((task) =>
    isSameWeek(new Date(task.taskDate), new Date(todayDate))
  );
  const monthlyTasks = tasks.filter((task) =>
    isSameMonth(new Date(task.taskDate), new Date(todayDate))
  );

  const steps = [
    {
      target: "body",
      placement: "center",
      content: (
        <div className="max-[768px]:w-[80vw] grid justify-items-center">
          <span className="font-semibold">Bienvenido a</span>
          <img src={Logo} />
          <p className="max-[768px]:w-full w-[550px] mt-5">
            {" "}
            Estás en la sección de <strong>Tareas</strong>, donde podrás
            organizar tu día a día de forma simple y eficiente. Crea, edita y
            completa tus actividades mientras avanzas hacia tus objetivos con
            claridad y motivación.
          </p>
        </div>
      ),
      locale: {
        skip: <strong aria-label="skip">Saltar</strong>,
        next: <span aria-label="next">Siguiente</span>,
        back: <span aria-label="back">Volver</span>,
      },
    },
    {
      target: "#step-0",
      content: (
        <div className="max-w-[550px] ">
          <h3 className="font-bold text-lg">Domina tu día</h3>
          <p>
            Revisa, edita y completa tus tareas con facilidad. Cada check te
            acerca más a tus metas.
          </p>{" "}
        </div>
      ),
      locale: {
        skip: <strong aria-label="skip">Saltar</strong>,
        next: <span aria-label="next">Siguiente</span>,
        back: <span aria-label="back">Volver</span>,
      },
    },
    {
      target: "#step-1",
      content: (
        <div className="max-w-[550px] ">
          <h3 className="font-bold text-lg">Un calendario para tu progreso</h3>
          <p>
            Visualiza tus avances diarios, navega por el mes y mantente en
            control de tus objetivos.
          </p>{" "}
        </div>
      ),
      locale: {
        skip: <strong aria-label="skip">Saltar</strong>,
        next: <span aria-label="next">Siguiente</span>,
        back: <span aria-label="back">Volver</span>,
      },
    },
    {
      target: "#step-2",
      content: (
        <div className="max-w-[550px] ">
          <h3 className="font-bold text-lg">Mide tu éxito</h3>
          <p>
            Analiza tus tareas completadas y pendientes. Cambia la vista y
            celebra tu progreso diario, semanal o mensual.
          </p>{" "}
        </div>
      ),
      locale: {
        skip: <strong aria-label="skip">Saltar</strong>,
        next: <span aria-label="next">Siguiente</span>,
        back: <span aria-label="back">Volver</span>,
      },
    },
    {
      target: "#step-3",
      content: (
        <div className="max-w-[550px] ">
          <h3 className="font-bold text-lg">Diseña tu semana ideal</h3>
          <p>
            Organiza tus días y mantén el equilibrio en tus prioridades.
          </p>{" "}
        </div>
      ),
      locale: {
        skip: <strong aria-label="skip">Saltar</strong>,
        next: <span aria-label="next">Siguiente</span>,
        back: <span aria-label="back">Volver</span>,
      },
    },
    {
      target: "#step-4",
      content: (
        <div className="lg:max-w-[550px] ">
          <h3 className="font-bold text-lg">Transforma tus ideas en acción</h3>
          <p>Agrega nuevas tareas y da el primer paso hacia tus metas.</p>{" "}
        </div>
      ),
      controlled: true,
      locale: {
        skip: <strong aria-label="skip">Saltar</strong>,
        next: <span aria-label="next">Siguiente</span>,
        back: <span aria-label="back">Volver</span>,
        last: <span aria-label="Last">Fin</span>,
      },
    },
  ];

  return (
    <div className="w-full h-[calc(100dvh-55px)] lg:h-screen  overflow-hidden relative">
      <Joyride
        steps={steps}
        run={true}
        styles={{
          options: {
            arrowColor: "#2A2B31",
            backgroundColor: "#2A2B31",
            primaryColor: "#7E73FF",
            textColor: "#fff",
            zIndex: 1000,
            maxWidth: "400px",
            width: "fit-content",
          },
        }}
        continuous
      />
      <div className="font-medium flex gap-2 px-5 mb-3 lg:hidden">
        <div
          className={`px-[5px] py-[3px] rounded ${
            tabActive == "hoy" && `bg-dark-400`
          }`}
          onClick={() => handleChangeTab("hoy")}
        >
          Hoy
        </div>
        <div
          className={`px-[5px] py-[3px] rounded ${
            tabActive == "semana" && `bg-dark-400`
          }`}
          onClick={() => handleChangeTab("semana")}
        >
          Semana
        </div>
        <div
          className={`px-[5px] py-[3px] rounded ${
            tabActive == "mes" && `bg-dark-400`
          }`}
          onClick={() => handleChangeTab("mes")}
        >
          Mes
        </div>
      </div>
      <div
        className={`z-10 grid grid-cols-[repeat(3,1fr)] transition-transform ease-in duration-300 ${
          tabActive == "semana" && "max-lg:translate-x-[calc(-100vw)]"
        } ${
          tabActive == "mes" && "max-lg:translate-x-[calc(-200vw)]"
        } lg:w-full lg:h-screen lg:grid-cols-[repeat(3 , 33.33%)] lg:grid-rows-[1fr,auto,calc(48vh-40px)] lg:p-3 lg:justify-items-center lg:gap-2`}
      >
        <TodayTasks />
        <WeekTasks />
        <MonthTasks />
        <div className="w-full h-full hidden lg:block lg:border-[2px] lg:border-dark-400 lg:rounded-lg"></div>
        <CardsProgress
          filteredTasks={handleChangeDropDown()}
          tasks={tasks}
          title={dropDownState}
          setDropDownState={setDropDownState}
        />
      </div>
      <TaskFormButton styles={"lg:hidden"} />
    </div>
  );
}
