import { useState } from "react";

export default function ItemRecurrent({ handleCheck, register, status, isoDay, day }) {
  const handleClick = () => {
    handleCheck(isoDay, status)
  };
  return (
    <div
      className={`border px-2 rounded-full border-violet-main transition-colors text-sm ${
        status ? `bg-violet-main text-white` : ` text-dark-100`
      }`}
      onClick={() => handleClick()}
    >
      {day.slice(0, 3)}
    </div>
  );
}
