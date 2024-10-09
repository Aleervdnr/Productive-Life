import {
  format,
  startOfMonth,
  endOfMonth,
  getHours,
  getMinutes,
  getWeek,
  startOfWeek,
  endOfWeek,
} from "date-fns";

const today = new Date();
export const todayDate = format(today, "yyyy-MM-dd"); // Formato YYYY-MM-DD

export const getMonthRange = () => {
  const now = new Date();
  const startOfMonthDate = format(startOfMonth(now), "yyyy-MM-dd"); // Primer día del mes
  const endOfMonthDate = format(endOfMonth(now), "yyyy-MM-dd"); // Último día del mes
  return { startOfMonthDate, endOfMonthDate };
};

export const getHour = () => {
  const now = new Date();
  const hour = getHours(now);
  const minutes = getMinutes(now);
  return { hour, minutes };
};

export const getWeekRange = () => {
  const now = new Date();
  const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 }); // Lunes como inicio de semana
  const endOfCurrentWeek = endOfWeek(now, { weekStartsOn: 1 }); // Domingo como final de semana
  return { startOfCurrentWeek, endOfCurrentWeek };
};

export const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
