import React from "react";

export default function InputItemTask({label,value,onChange}) {
  return (
    <div className="relative">
      <label className="absolute px-3 top-1 text-violet-main block text-xs font-bold">
        {label}
      </label>
      <input
        className="w-full p-3 pb-1 pt-5 bg-[#2A2B31] rounded-lg text-white focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        //disabled
      />
    </div>
  );
}
