import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";

import { useUi } from "../../context/UiContext";
import { useTasks } from "../../context/TasksContext";

export default function ItemTask({ task }) {
  const { title, status, startTime, endTime } = task;
  const { setOverlayActive, setTaskModalActive, taskModalActive } = useUi();
  const { updateTask, parentTasks, setCurrentTask } = useTasks();

  const handleChangeStatus = () => {
    if (!task.recurrenceOf) {
      const newTask = task;
      if (status == "completed") newTask.status = "pending";
      if (status == "pending") newTask.status = "completed";
      updateTask(newTask, true);
    } else {
      const parent = parentTasks.find(
        (pTask) => pTask._id == task.recurrenceOf
      );

      const newTask = {
        description: task.description,
        startTime: task.startTime,
        endTime: task.endTime,
        taskDate: task.taskDate,
        status: task.status,
        _id: task._id,
      };
      if (status == "completed") newTask.status = "pending";
      if (status == "pending") newTask.status = "completed";

      const updatedRecurrences = parent.recurrences.map((recu) =>
        recu._id != newTask._id ? recu : newTask
      );

      parent.recurrences = updatedRecurrences;
      updateTask(parent, true, false);
    }
  };

  const handleShowModal = (e) => {
    if (
      e.target.id == `status_${task._id}` ||
      e.target.id == `status_icon_${task._id}`
    ) {
      e.preventDefault();
    } else {
      setCurrentTask(task)
      setTaskModalActive(true);
    }
  };

  useEffect(() => {
    if (taskModalActive) setOverlayActive(true);
  }, [taskModalActive]);

  return (
    <>
      <div
        className={`w-full  ${
          status == "pending" && `bg-dark-400  border-transparent`
        } ${
          status == "completed" && ` border-dark-400`
        }  rounded-xl px-3 border-2 py-[10px] flex items-center justify-between cursor-pointer`}
        onClick={(e) => handleShowModal(e)}
      >
        <div className="grid max-w-[85%]">
          <span
            className={`font-semibold capitalize truncate ...${
              status == "completed" && "line-through text-dark-100"
            }`}
          >
            {title}
          </span>
          <span
            className={`text-sm font-extralight ${
              status == "completed" && "text-dark-100"
            }`}
          >{`${startTime.slice(0, -3)} - ${endTime.slice(0, -3)}`}</span>
        </div>
        <div
          id={`status_${task._id}`}
          className={`w-5 h-5 rounded-full ${
            status == "pending" && `border`
          }  ${
            status == "completed" &&
            `bg-green-complete flex items-center justify-center`
          }`}
          onClick={handleChangeStatus}
        >
          {status == "completed" && (
            <FaCheck className="text-sm" id={`status_icon_${task._id}`} />
          )}
        </div>
      </div>
    </>
  );
}
