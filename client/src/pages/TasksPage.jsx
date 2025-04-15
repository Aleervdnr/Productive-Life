import { useEffect, useState } from "react";
import TodayTasks from "../components/widgets-tasks/TodayTasks";
import WeekTasks from "../components/widgets-tasks/WeekTasks";
import MonthTasks from "../components/widgets-tasks/MonthTasks";
import PomodoroTimer from "../components/PomodoroTimer.jsx";
import { useTasks } from "../context/TasksContext.jsx";
import TaskFormButton from "../components/taskForm/TaskFormButton.jsx";
import CardsProgress from "../components/widgets-tasks/CardsProgress.jsx";
import Joyride, { ACTIONS, EVENTS, ORIGIN, STATUS } from "react-joyride";
import Logo from "../assets/Logo.png";
import { useAuth } from "../context/AuthContext.jsx";
import useWindowSize from "../hooks/useWindowSize.jsx";
import { useDate } from "../context/DateContext.jsx";
import { format } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { useTranslation } from "../hooks/UseTranslation.jsx";
import { MdOutlineAdd } from "react-icons/md";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function TasksPage({ setActiveItem }) {
  const { getTasks } = useTasks();
  const { nowDateTime } = useDate();
  const { completeTour, user } = useAuth();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const { width } = useWindowSize();

  useEffect(() => {
    setActiveItem("tasks");
    getTasks();
  }, []);

  const [tabActive, setTabActive] = useState("hoy");

  const handleChangeTab = (name) => {
    setTabActive(name);
  };

  const stepsDesktop = [
    {
      target: "body",
      placement: "center",
      content: (
        <div className="max-[768px]:w-[80vw] grid justify-items-center">
          <span className="font-semibold">{t("tasks.tour.welcomeTitle")}</span>
          <img src={Logo} />
          <p className="max-[768px]:w-full w-[550px] mt-5">
            {" "}
            {t("tasks.tour.welcomeDescription")}
          </p>
        </div>
      ),
      locale: {
        next: <span aria-label="next">{t("tasks.tour.btnNext")}</span>,
      },
    },
    {
      target: "#step-0",
      content: (
        <div className="max-[768px]:w-[80vw] ">
          <h3 className="font-bold text-lg">{t("tasks.tour.step1Title")}</h3>
          <p>
          {t("tasks.tour.step1Description")}
          </p>{" "}
        </div>
      ),
      locale: {
        next: <span aria-label="next">{t("tasks.tour.btnNext")}</span>,
        back: <span aria-label="back">{t("tasks.tour.btnBack")}</span>,
      },
    },
    {
      target: "#step-1",
      content: (
        <div className="max-[768px]:w-[80vw] ">
          <h3 className="font-bold text-lg">{t("tasks.tour.step2Title")}</h3>
          <p>
          {t("tasks.tour.step2Description")}
          </p>{" "}
        </div>
      ),
      locale: {
        next: <span aria-label="next">{t("tasks.tour.btnNext")}</span>,
        back: <span aria-label="back">{t("tasks.tour.btnBack")}</span>,
      },
    },
    {
      target: "#step-2",
      content: (
        <div className="max-[768px]:w-[80vw] ">
          <h3 className="font-bold text-lg">{t("tasks.tour.step3Title")}</h3>
          <p>
          {t("tasks.tour.step3Description")}
          </p>{" "}
        </div>
      ),
      locale: {
        next: <span aria-label="next">{t("tasks.tour.btnNext")}</span>,
        back: <span aria-label="back">{t("tasks.tour.btnBack")}</span>,
      },
    },
    {
      target: "#step-3",
      content: (
        <div className="max-[768px]:w-[80vw] ">
          <h3 className="font-bold text-lg">{t("tasks.tour.step4Title")}</h3>
          <p>
          {t("tasks.tour.step4Description")}
          </p>{" "}
        </div>
      ),
      locale: {
        next: <span aria-label="next">{t("tasks.tour.btnNext")}</span>,
        back: <span aria-label="back">{t("tasks.tour.btnBack")}</span>,
      },
    },
    {
      target: "#step-4",
      content: (
        <div className="max-[768px]:w-[80vw] ">
          <h3 className="font-bold text-lg">{t("tasks.tour.step5Title")}</h3>
          <p>{t("tasks.tour.step5Description")}</p>{" "}
        </div>
      ),
      controlled: true,
      locale: {
        back: <span aria-label="back">{t("tasks.tour.btnBack")}</span>,
        last: <span aria-label="Last">{t("tasks.tour.btnFinish")}</span>,
      },
    },
  ];

  const stepsMobile = [
    {
      target: "body",
      placement: "center",
      content: (
        <div className="max-[768px]:w-[80vw] grid justify-items-center">
          <span className="font-semibold">{t("tasks.tour.welcomeTitle")}</span>
          <img src={Logo} />
          <p className="max-[768px]:w-full w-[550px] mt-5">
            {" "}
            {t("tasks.tour.welcomeDescription")}
          </p>
        </div>
      ),
      locale: {
        next: <span aria-label="next">{t("tasks.tour.btnNext")}</span>,
      },
    },
    {
      target: "#step-0",
      content: (
        <div className="max-[768px]:w-[80vw] ">
          <h3 className="font-bold text-lg">{t("tasks.tour.step1Title")}</h3>
          <p>
          {t("tasks.tour.step1Description")}
          </p>{" "}
        </div>
      ),
      locale: {
        next: <span aria-label="next">{t("tasks.tour.btnNext")}</span>,
        back: <span aria-label="back">{t("tasks.tour.btnBack")}</span>,
      },
    },
    {
      target: "#step-1",
      content: (
        <div className="max-[768px]:w-[80vw] ">
          <h3 className="font-bold text-lg">{t("tasks.tour.step4Title")}</h3>
          <p>
          {t("tasks.tour.step4Description")}
          </p>{" "}
        </div>
      ),
      locale: {
        next: <span aria-label="next">{t("tasks.tour.btnNext")}</span>,
        back: <span aria-label="back">{t("tasks.tour.btnBack")}</span>,
      },
    },
    {
      target: "#step-2",
      content: (
        <div className="max-[768px]:w-[80vw] ">
          <h3 className="font-bold text-lg">{t("tasks.tour.step2Title")}</h3>
          <p>
          {t("tasks.tour.step2Description")}
          </p>{" "}
        </div>
      ),
      locale: {
        next: <span aria-label="next">{t("tasks.tour.btnNext")}</span>,
        back: <span aria-label="back">{t("tasks.tour.btnBack")}</span>,
      },
    },
    {
      target: "body",
      placement: "center",
      content: (
        <div className="max-[768px]:w-[80vw] grid justify-items-center">
          <h3 className="font-bold text-lg">{t("tasks.tour.step5Title")}</h3>
          <p>{t("tasks.tour.step5Description")}</p>{" "}
          <div
            className={`bg-violet-main w-11 h-11 rounded-full text-2xl flex justify-center items-center mt-2`}
          >
            <span className="lg:text-md lg:leading-3 lg:font-medium lg:pl-1 ">
              <MdOutlineAdd />
            </span>
          </div>
        </div>
      ),
      controlled: true,
      locale: {
        back: <span aria-label="back">{t("tasks.tour.btnBack")}</span>,
        last: <span aria-label="Last">{t("tasks.tour.btnFinish")}</span>,
      },
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { action, index, origin, status, type } = data;

    if (action === ACTIONS.CLOSE && origin === ORIGIN.KEYBOARD) {
      // do something
    }

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      //setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // You need to set our running state to false, so we can restart if we click start again.
      completeTour("taskTour");
      console.log("Terminado");
    }

    console.groupCollapsed(type);
    console.log(data);
    console.groupEnd();
  };

  const formatDate = (date, language) => {
    const locale = language === "es" ? es : enUS; // Selecciona el locale según el idioma
    const formatPattern =
      language === "es"
        ? "d 'de' MMMM yyyy" // Formato para español: "2 de abril"
        : "MMMM d yyyy"; // Formato para inglés: "April 2"

    return format(date, formatPattern, { locale });
  };

  return (
    <div className="w-full h-dvh overflow-hidden relative max-lg:pt-14 lg:pl-52">
      <Joyride
        callback={handleJoyrideCallback}
        steps={width >= 1024 ? stepsDesktop : stepsMobile}
        run={!user.tourCompleted.taskTour}
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

      <div className="grid mb-3 px-5 lg:hidden">
        <span className="text-2xl capitalize">
          {t("tasks.greeting")}, {user.name.split(" ")[0]}!{" "}
        </span>
        <span className="text-xs text-dark-100">
          {formatDate(nowDateTime, language)}
        </span>
      </div>
      <div className="font-medium flex gap-2 px-5 lg:hidden">
        <div
          className={`px-[5px] py-[3px] rounded ${
            tabActive == "hoy" && `bg-dark-400`
          }`}
          onClick={() => handleChangeTab("hoy")}
          id={width < 1024 ? "step-0" : null}
        >
          {t("tasks.tabMenu.today")}
        </div>
        <div
          className={`px-[5px] py-[3px] rounded ${
            tabActive == "semana" && `bg-dark-400`
          }`}
          onClick={() => handleChangeTab("semana")}
          id={width < 1024 ? "step-1" : null}
        >
          {t("tasks.tabMenu.week")}
        </div>
        <div
          className={`px-[5px] py-[3px] rounded ${
            tabActive == "mes" && `bg-dark-400`
          }`}
          onClick={() => handleChangeTab("mes")}
          id={width < 1024 ? "step-2" : null}
        >
          {t("tasks.tabMenu.month")}
        </div>
      </div>
      <div
        className={`z-[1001] grid grid-cols-[repeat(3,1fr)] transition-transform ease-in duration-300 ${
          tabActive == "semana" && "max-lg:translate-x-[calc(-100vw)]"
        } ${
          tabActive == "mes" && "max-lg:translate-x-[calc(-200vw)]"
        } lg:w-full lg:h-screen lg:grid-cols-[repeat(3 , 33.33%)] lg:grid-rows-[1fr,auto,calc(48vh-40px)] lg:p-3 lg:justify-items-center lg:gap-2`}
      >
        <TodayTasks />
        <WeekTasks />
        <MonthTasks />
        <PomodoroTimer />
        <CardsProgress />
      </div>
      <TaskFormButton styles={"lg:hidden"} />
    </div>
  );
}
