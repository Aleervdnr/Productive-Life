import {
  isBefore,
  addDays,
  parseISO,
  format,
  isAfter,
  isSameDay,
  isWithinInterval
} from "date-fns";

function generateOccurrences(
  task,
  existingRecurrences,
  isRecurrence,
  parentTask
) {
  const { recurringDays, startTime, endTime, recurringEndDate, taskDate } =
    task;

  //Si la fecha de la tarea es anterior a la fecha actual, comenzamos a crear tareas a partir del dia de la fecha actual, sino a partir del dia de la fecha de la tarea elegida.
  const start = isBefore(new Date(taskDate), new Date())
    ? new Date()
    : parseISO(taskDate);
  const end = parseISO(recurringEndDate);
  const savedRecurrences = existingRecurrences.length
    ? existingRecurrences.filter(
        (rec) =>
          isBefore(parseISO(rec.taskDate), end) ||
          parseISO(rec.taskDate).getTime() === end.getTime()
      )
    : [];
  const occurrences = [];
  let currentDate = start
  //let currentDate = isRecurrence ? start : addDays(start,1);

  console.log(savedRecurrences, end);

  // Obtener la última fecha existente en las ocurrencias actuales
  const lastRecurringEndDate = existingRecurrences.length
    ? parseISO(
        existingRecurrences.reduce(
          (latest, occ) =>
            isAfter(parseISO(occ.taskDate), parseISO(latest))
              ? occ.taskDate
              : latest,
          existingRecurrences[0].taskDate
        )
      )
    : null;

  console.log(lastRecurringEndDate, end);

  //Tareas posteriores a el dia de inicio y anteriores o iguales al dia de tarea elegida
  const recurrencesAfterTaskDate = savedRecurrences.filter(
    (rec) =>
      (isAfter(
        parseISO(rec.taskDate),
        isRecurrence ? parseISO(parentTask.taskDate) : parseISO(taskDate)
      ) &&
        isBefore(
          parseISO(rec.taskDate),
          isRecurrence ? parseISO(taskDate) : new Date()
        )) ||
      isSameDay(
        parseISO(rec.taskDate),
        isRecurrence ? parseISO(taskDate) : new Date()
      )
  );

  const recurrencesBeforeTaskDate = savedRecurrences.filter(
    (rec) =>
      recurringDays.includes(parseISO(rec.taskDate).getDay()) &&
      isAfter(parseISO(rec.taskDate), isRecurrence? parseISO(taskDate) : new Date()) &&
      isBefore(parseISO(rec.taskDate), end)
  );

  console.log(recurrencesAfterTaskDate);
  console.log(recurrencesBeforeTaskDate);

  occurrences.push(...recurrencesAfterTaskDate, ...recurrencesBeforeTaskDate);
  console.log(occurrences);

  while (isBefore(currentDate, end) || isSameDay(currentDate, end)) {
    const dayOfWeek = currentDate.getDay();

    console.log(dayOfWeek, recurringDays);
    console.log(currentDate, end);

    // Verificar si el día actual está en los días de recurrencia
    if (recurringDays.includes(dayOfWeek)) {
      const formattedDate = format(currentDate, "yyyy-MM-dd");

      // Comprobar si ya existe una tarea con la misma fecha y si es válida
      const taskExists = occurrences.some((occurrence) => {
        return (
          occurrence.taskDate === formattedDate // Validar que haya una fecha igual a la fecha buscada
        );
      });

      console.log(taskExists);

      // Agregar solo si no existe y cumple las condiciones
      if (!taskExists && isAfter(currentDate, parseISO(taskDate))) {
        console.log("dentro");
        const newOccurrence = {
          taskDate: formattedDate,
          startTime: isRecurrence ? parentTask.startTime : startTime,
          endTime: isRecurrence ? parentTask.endTime : endTime,
          status: "pending",
        };
        console.log(newOccurrence);
        occurrences.push(newOccurrence);
      }
    }

    // Avanzar al siguiente día
    currentDate = addDays(currentDate, 1);
  }
  console.log(occurrences);
  return occurrences; // Devolver solo las nuevas ocurrencias
}

export default generateOccurrences;
