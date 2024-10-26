import { useEffect, useState } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { toast } from "sonner";

export default function ItemRecurrent({
  handleCheck,
  register,
  status,
  isoDay,
  day,
  setRecurringDays,
  recurringDays,
  disabled,
}) {
  const handleClick = () => {
    if (!disabled) {
      handleCheck(isoDay, setRecurringDays, recurringDays);
    }
    if (disabled) {
      toast.info("Be at the area 10 minutes before the event time");
    }
  };

  useEffect(() => {
    if (disabled) {
      setRecurringDays([
        { name: "Lunes", isoDay: "1", status: false },
        { name: "Martes", isoDay: "2", status: false },
        { name: "Miercoles", isoDay: "3", status: false },
        { name: "Jueves", isoDay: "4", status: false },
        { name: "Viernes", isoDay: "5", status: false },
        { name: "Sabado", isoDay: "6", status: false },
        { name: "Domingo", isoDay: "0", status: false },
      ]);
    }
  }, [disabled]);

  const { width } = useWindowSize();

  return (
    <div
      className={`border px-2 rounded-full border-violet-main transition-colors text-sm cursor-pointer ${
        status ? `bg-violet-main text-white` : ` text-dark-100`
      } ${disabled && "text-dark-100 border-dark-100 cursor-default"}`}
      onClick={() => handleClick()}
    >
      {width < 425 ? day.charAt(0) : day.slice(0, 3)}
    </div>
  );
}
