import React, { useEffect, useRef, useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useTranslation } from "../../hooks/UseTranslation";

export default function DropDownItemTask({ status = "pending", onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropDownState, setDropDownState] = useState(status);
  const detailsRef = useRef(null);
  const { t } = useTranslation();

  const statusOptions = [
    {
      value: "completed",
      label: t("tasks.modalTask.statusCompleted"),
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      value: "pending",
      label: t("tasks.modalTask.statusPending"),
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      value: "overdue",
      label: t("tasks.modalTask.statusOverdue"),
      icon: AlertCircle,
      color: "text-red-500",
    },
  ];

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (detailsRef.current && !detailsRef.current.contains(event.target)) {
        detailsRef.current.removeAttribute("open");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Find the current status object
  const currentStatus =
    statusOptions.find((option) => option.value === dropDownState) ||
    statusOptions[1];
  const Icon = currentStatus.icon;

  // Handle status change
  const handleStatusChange = (newStatus) => {
    setDropDownState(newStatus.value);
    if (onChange) {
      onChange(newStatus.value);
    }
    detailsRef.current.removeAttribute("open");
  };
  return (
    <>
      <details className=" max-sm:col-span-2" ref={detailsRef}>
        <summary className="p-3 pt-5 bg-[#2A2B31] rounded-lg text-white relative list-none px-3 flex items-center cursor-pointer">
          <label className="absolute top-1 text-violet-main block text-xs font-bold">
            {t("tasks.modalTask.status")}
          </label>
          <Icon className={`h-4 w-4 ${currentStatus.color}`} />
          <span className="pl-1">{currentStatus.label}</span>
          <RiArrowDownSLine className="absolute right-4 text-lg text-violet-main" />
          <div className="px-3"></div>
        </summary>

        <ul className="absolute bg-dark-200 w-fit z-10">
          {statusOptions.map((option) => {
            const OptionIcon = option.icon;
            return (
              <li
                key={option.value}
                className="flex items-center gap-2 p-3 hover:bg-[#3A3B41] cursor-pointer"
                onClick={() => handleStatusChange(option)}
              >
                <OptionIcon className={`h-4 w-4 ${option.color}`} />
                <span className="text-white">{option.label}</span>
              </li>
            );
          })}
        </ul>
      </details>
    </>
  );
}
