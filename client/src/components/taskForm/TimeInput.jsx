import React, { useEffect, useState } from "react";
import { useUi } from "../../context/UiContext";

export default function TimeInput({ onChange, title}) {
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  const {taskFormActive} = useUi()

  useEffect(() => {
    if(!taskFormActive)setTime("")
  }, [taskFormActive])
  

  const validateTime = (value) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(value);
  };

  const formatTimeInput = (value) => {
    // Elimina cualquier carácter no numérico
    const sanitizedValue = value.replace(/\D/g, "");

    // Si hay más de 2 caracteres, inserta ":" automáticamente
    if (sanitizedValue.length > 2) {
      return `${sanitizedValue.slice(0, 2)}:${sanitizedValue.slice(2, 4)}`;
    }

    return sanitizedValue;
  };

  const handleChange = (e) => {
    const value = e.target.value;

    const formattedValue = formatTimeInput(value);
    setTime(formattedValue);

    // Validar el formato solo si tiene el formato completo HH:MM
    if (formattedValue.length === 5 && validateTime(formattedValue)) {
      setError("");
      if (onChange) {
        onChange(`${formattedValue}:00`);
      }
    } else if (formattedValue.length === 5) {
      setError("Formato inválido. Usa HH:MM.");
    } else {
      setError("");
    }
  };

  const handleBlur = () => {
    if (time && !validateTime(time)) {
      setError("Por favor, introduce una hora válida (HH:MM).");
    }
  };

  return (
    <div className=" relative flex flex-col items-start gap-2">
      <span className="absolute top-[10px] left-[12px] text-lg font-semibold">{title}</span>
      <input
        id="timeInput"
        type="text"
        onChange={handleChange}
        value={time}
        onBlur={handleBlur}
        placeholder="00:00"
        maxLength="5"
        className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 pt-[38px] pb-[10px] text-4xl text-dark-100 bg-dark-400 font-semibold leading-none ${
          error
            ? "border-red-500 focus:ring-red-300"
            : " focus:ring-blue-300"
        }`}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
