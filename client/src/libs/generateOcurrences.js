import {
  isBefore,
  addDays,
  parseISO,
  format,
  isAfter,
  isSameDay,
} from "date-fns";

// function generateOccurrences(task) {
//   const { recurringDays, startTime, endTime, recurringEndDate, taskDate } =
//     task;
//   const start = parseISO(taskDate);
//   const end = parseISO(recurringEndDate);
//   const occurrences = [];
//   let currentDate = addDays(start, 1); // Iniciar un día después de la fecha de inicio

//   while (
//     isBefore(currentDate, end) ||
//     currentDate.getTime() === end.getTime()
//   ) {
//       const dayOfWeek = currentDate.getDay();

//       // Verificar si el día actual está en los días de recurrencia
//       if (
//           recurringDays.includes(dayOfWeek) &&
//           isBefore(currentDate, addDays(parseISO(recurringEndDate),1))
//         ) {
//             occurrences.push({
//                 taskDate: format(currentDate, "yyyy-MM-dd"),
//                 startTime,
//                 endTime,
//                 status: "pending",
//             });
//         }
//         currentDate = addDays(currentDate, 1);
//   }
//   return occurrences;
// }

// export default generateOccurrences;

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
  let currentDate = start;
  //let currentDate = addDays(start, 1);
  let count = 0;

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

  //Si la fecha de fin de recurrencia actual es menor a la ultima fecha de fin de recurrencias,
  // if (isBefore(end, lastRecurringEndDate)) {
  //   console.log("salida end menor");

  //   return savedRecurrences;
  // }

  occurrences.push(
    ...savedRecurrences.filter(
      (rec) =>
        (isAfter(
          parseISO(rec.taskDate),
          isRecurrence ? parseISO(parentTask.taskDate) : parseISO(taskDate)
        ) &&
          isBefore(parseISO(rec.taskDate), isRecurrence? parseISO(taskDate) : new Date())) ||
        isSameDay(parseISO(rec.taskDate), isRecurrence? parseISO(taskDate) : new Date())
    ),
    ...savedRecurrences.filter(
      (rec) =>
        recurringDays.includes(parseISO(rec.taskDate).getDay()) &&
        isAfter(parseISO(rec.taskDate), parseISO(taskDate)) &&
        isBefore(parseISO(rec.taskDate), end)
    )
  );
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
        const occurrenceDate = parseISO(occurrence.taskDate);
        return (
          occurrence.taskDate === formattedDate ||
          isBefore(occurrenceDate, parseISO(taskDate)) // Validar que sea mayor o igual a `taskDate`
        );
      });

      // Agregar solo si no existe y cumple las condiciones
      if (!taskExists && isAfter(currentDate, parseISO(taskDate)) || isSameDay(currentDate, parseISO(taskDate))) {
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
    count += 1;
  }
  console.log(occurrences);
  return occurrences; // Devolver solo las nuevas ocurrencias
}

export default generateOccurrences;
