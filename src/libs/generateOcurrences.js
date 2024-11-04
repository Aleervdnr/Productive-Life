import { v4 as uuidv4 } from "uuid";
import { isBefore, addDays, parseISO,format } from "date-fns";

function generateOccurrences(task) {
  const { recurringDays, startTime, endTime, recurringEndDate, taskDate } =
    task;
  const start = parseISO(taskDate);
  const end = parseISO(recurringEndDate);
  const occurrences = [];
  let currentDate = addDays(start, 1); // Iniciar un día después de la fecha de inicio

  while (
    isBefore(currentDate, end) ||
    currentDate.getTime() === end.getTime()
  ) {
      const dayOfWeek = currentDate.getDay();

      
      // Verificar si el día actual está en los días de recurrencia
      if (
          recurringDays.includes(dayOfWeek.toString()) &&
          isBefore(currentDate, addDays(parseISO(recurringEndDate),1))
        ) {
            occurrences.push({
                taskDate: format(currentDate, "yyyy-MM-dd"),
                startTime,
                endTime,
                status: "pending",
            });
        }
        currentDate = addDays(currentDate, 1);
  }
  return occurrences;
}

export default generateOccurrences;
