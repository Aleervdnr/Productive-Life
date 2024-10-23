import { useState } from "react";
import useWindowSize from "../hooks/useWindowSize";

export default function ItemRecurrent({
  handleCheck,
  register,
  status,
  isoDay,
  day,
  setRecurringDays,
  recurringDays,
}) {
  const handleClick = () => {
    handleCheck(isoDay,setRecurringDays, recurringDays);
  };

  const { width } = useWindowSize();

  return (
    <div
      className={`border px-2 rounded-full border-violet-main transition-colors text-sm ${
        status ? `bg-violet-main text-white` : ` text-dark-100`
      }`}
      onClick={() => handleClick()}
    >
      {width < 425 ? day.charAt(0) : day.slice(0, 3)}
    </div>
  );
}
