import { format, getDate, getHours, getMinutes } from "date-fns";
import { createContext, useContext, useEffect, useState } from "react";

export const DateContext = createContext();

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDatenecesita ser usado dentro de DateProvider");
  }
  return context;
};

export const DateProvider = ({ children }) => {
  const [nowDateTime, setNowDateTime] = useState(new Date());
  const [nowHourAndMinutes, setNowHourAndMinutes] = useState(`${getHours(new Date()) <= 9 ? `0${getHours(new Date())}` : getHours(new Date())}:${getMinutes(new Date())}`);
  const [nowDate, setNowDate] = useState(format(new Date(), "yyyy-MM-dd"))

  useEffect(() => {
    const intervalDateTime = setInterval(() => {
      setNowDateTime(new Date());
      setNowHourAndMinutes(`${getHours(new Date()) <= 9 ? `0${getHours(new Date())}` : getHours(new Date())}:${getMinutes(new Date()) <= 9 ? `0${getMinutes(new Date())}` : getMinutes(new Date())}`)
      setNowDate(format(new Date(), "yyyy-MM-dd"))
    }, 1000);

    return () => {
      clearInterval(intervalDateTime);
    };
  }, []);

  return (
    <DateContext.Provider value={{ nowDateTime, nowHourAndMinutes, nowDate }}>
      {children}
    </DateContext.Provider>
  );
};
