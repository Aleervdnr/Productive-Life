import { useEffect, useState } from "react";
import {
  format,
  formatISO,
  getDate,
  getDay,
  getDaysInMonth,
  getMonth,
  getYear,
} from "date-fns";
import { months } from "../../libs/Dates.js";
import MonthDayItem from "./MonthDayItem";

export default function MonthTasks() {
  const [days, setDays] = useState([]);

  const now = new Date();
  const month = getMonth(now) + 1;
  const year = getYear(now);
  const daysInMonth = getDaysInMonth(now);
  useEffect(() => {
    const newDays = [];

    for (var i = 1; i <= daysInMonth; i++) {
      const newDay = `${year}-${month < 10 ? `0${month}` : month}-${
        i < 10 ? `0${i}` : i
      }T00:00:00`;
      newDays.push(newDay);
    }
    console.log(newDays[0]);
    setDays(newDays);
  }, []);

  return (
    <div className="w-[100vw] px-5 z-[-10] relative grid  grid-cols-[repeat(7,clamp(35px,calc((100vw-64px)/7),50px))] grid-rows-[48px,repeat(5,clamp(35px,calc((100vw-64px)/7),50px))] justify-items-center gap-y-2 gap-1 lg:w-full lg:col-start-2 lg:px-0 lg:z-0 lg:grid-cols-[repeat(7,30px)] lg:grid-rows-[48px,repeat(auto-fit,30px)] lg:place-content-center lg:gap-y-[2px] lg:gap-x-1 lg:border-[2px] lg:border-dark-400 lg:rounded-lg ">
      <div className="w-full grid grid-cols-[repeat(7,clamp(35px,calc((100vw-64px)/7),50px))] grid-rows-[26px,22px] col-span-7 lg:grid-cols-[repeat(7,30px)] lg:gap-x-1 justify-items-center">
        <span className="text-xl font-semibold col-span-7 w-full">
          {months[month - 1]}, {year}
        </span>
        <span>L</span>
        <span>M</span>
        <span>X</span>
        <span>J</span>
        <span>V</span>
        <span>S</span>
        <span>D</span>
      </div>
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
      {/* getDay(new Date(days[0])) */}

      {days.map((day) => (
        <MonthDayItem key={day} day={day}>
          {" "}
          {getDate(new Date(day))}{" "}
        </MonthDayItem>
      ))}
    </div>
  );
}
