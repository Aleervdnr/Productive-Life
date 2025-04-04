import { useEffect, useState } from "react";
import { getDate, getDay, getDaysInMonth, getMonth, getYear } from "date-fns";
import { monthsEs, monthsEn } from "../../libs/Dates.js";
import MonthDayItem from "./MonthDayItem";
import { useDate } from "../../context/DateContext.jsx";
import { RiArrowRightSLine } from "react-icons/ri";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useTasks } from "../../context/TasksContext.jsx";
import useWindowSize from "../../hooks/useWindowSize.jsx";
import { useTranslation } from "../../hooks/UseTranslation.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function MonthTasks() {
  const { tasksIsLoading } = useTasks();
  const { width } = useWindowSize();

  const [days, setDays] = useState([]);
  const { nowDateTime } = useDate();

  const [month, setMonth] = useState(getMonth(nowDateTime) + 1);
  const [year, setYear] = useState(getYear(nowDateTime));

  const { t } = useTranslation();
  const {language} = useLanguage()
  const months = language == "en" ? monthsEn : monthsEs

  const daysInMonth = getDaysInMonth(
    new Date(`${year}-${month < 10 ? `0${month}` : month}-01T00:00:00`)
  );

  useEffect(() => {
    //Creamos un array nuevo donde luego mediante una iteracion vamos a tener todos los dias del mes actual en un formato yyyy-MM-dd
    const newDays = [];

    for (var i = 1; i <= daysInMonth; i++) {
      const newDay = `${year}-${month < 10 ? `0${month}` : month}-${
        i < 10 ? `0${i}` : i
      }T00:00:00`;
      newDays.push(newDay);
    }
    console.log(newDays[0]);
    setDays(newDays);
  }, [month]);

  const addMonth = () => {
    if (month == 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  const subtractMonth = () => {
    if (month == 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  return (
    <div
      id={width >= 1024 ? "step-1" : null}
      className="w-[100vw] px-5 max-lg:py-3 z-[-10] relative grid  grid-cols-[repeat(7,clamp(35px,calc((100vw-64px)/7),50px))] grid-rows-[24px,24px,repeat(auto-fill,clamp(35px,calc((100vw-64px)/7),50px))] justify-items-center gap-y-2 gap-1 lg:w-full lg:col-start-2 lg:px-0 lg:z-0 lg:grid-cols-[repeat(7,clamp(26px,2.5vw,30px))] lg:grid-rows-[24px,24px,repeat(auto-fit,clamp(26px,2.5vw,30px))] lg:place-content-center lg:gap-y-[2px] lg:gap-x-1 lg:border-[2px] lg:border-dark-400 lg:rounded-lg "
    >
      <div className="col-span-7 w-full flex justify-between">
        <span className="text-md font-semibold">
          {months[month - 1]}, {year}
        </span>
        <div className="w-fit flex">
          <RiArrowLeftSLine
            className="text-2xl text-violet-main cursor-pointer"
            onClick={() => subtractMonth()}
          />
          <RiArrowRightSLine
            className="text-2xl text-violet-main cursor-pointer"
            onClick={() => addMonth()}
          />
        </div>
      </div>
      <span className="font-medium">{t("tasks.days.monday").charAt(0)}</span>
      <span className="font-medium">{t("tasks.days.tuesday").charAt(0)}</span>
      <span className="font-medium">{t("tasks.days.wednesday").charAt(0)}</span>
      <span className="font-medium">{t("tasks.days.thursday").charAt(0)}</span>
      <span className="font-medium">{t("tasks.days.friday").charAt(0)}</span>
      <span className="font-medium">{t("tasks.days.saturday").charAt(0)}</span>
      <span className="font-medium">{t("tasks.days.sunday").charAt(0)}</span>

      {/* Si el dia empieza en lunes, martes, miercoles o el dia que sea, mediante esta logica se acomoda el primer dia del mes en el dia que es mediante unos espacios vacios, ejemplo: si la semana empieza en martes en el lunes va haber un espacio vacio, sin esto todos los meses se mostrarian como primer dia el lunes*/}
      <div
        className={
          getDay(new Date(days[0])) > 1 || getDay(new Date(days[0])) == 0
            ? ""
            : "hidden"
        }
      ></div>
      <div
        className={
          getDay(new Date(days[0])) > 2 || getDay(new Date(days[0])) == 0
            ? ""
            : "hidden"
        }
      ></div>
      <div
        className={
          getDay(new Date(days[0])) > 3 || getDay(new Date(days[0])) == 0
            ? ""
            : "hidden"
        }
      ></div>
      <div
        className={
          getDay(new Date(days[0])) > 4 || getDay(new Date(days[0])) == 0
            ? ""
            : "hidden"
        }
      ></div>
      <div
        className={
          getDay(new Date(days[0])) > 5 || getDay(new Date(days[0])) == 0
            ? ""
            : "hidden"
        }
      ></div>
      <div
        className={
          getDay(new Date(days[0])) > 6 || getDay(new Date(days[0])) == 0
            ? ""
            : "hidden"
        }
      ></div>
      {tasksIsLoading ? (
        <>
          {days.map((item) => (
            <div
              key={item.day}
              className="w-full h-full rounded-full bg-dark-400 animate-pulse"
            ></div>
          ))}
        </>
      ) : (
        <>
          {days.map((day) => (
            <MonthDayItem key={day} day={day}>
              {" "}
              {getDate(new Date(day))}{" "}
            </MonthDayItem>
          ))}
        </>
      )}
    </div>
  );
}
