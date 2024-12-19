import { useState, useEffect } from "react";

export function AnimatedCounter({ value, duration = 1000 }) {
  const [displayValue, setDisplayValue] = useState(value); // Valor mostrado

  useEffect(() => {
    const start = displayValue; // El valor actual mostrado
    const end = value; // El nuevo valor enviado por la prop
    const increment = (end - start) / (duration / 10); // Calcula el incremento
    let currentValue = start;

    const interval = setInterval(() => {
      currentValue += increment;
      if ((increment > 0 && currentValue >= end) || (increment < 0 && currentValue <= end)) {
        currentValue = end; // Asegura que el valor final sea el objetivo exacto
        clearInterval(interval);
      }
      setDisplayValue(Math.round(currentValue)); // Actualiza el valor mostrado
    }, 10); // Actualización cada 10ms

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, [value, duration]); // Solo se ejecuta cuando `value` o `duration` cambian

  return <span>{displayValue}%</span>;
}