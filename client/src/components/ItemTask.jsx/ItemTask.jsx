import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";

import ModalItemTask from "./ModalItemTask";
import { useUi } from "../../context/UiContext";
import { useTasks } from "../../context/TasksContext";

export default function ItemTask({task}) {
    const {title, status,startTime,endTime,} = task
    const [modalIsActive, setModalIsActive] = useState(false)
    const [parentTask, setparentTask] = useState()
    const {setOverlayActive} = useUi()
    const {parentTasks} = useTasks()
    useEffect(() => {
      if(modalIsActive)setOverlayActive(true)
    }, [modalIsActive])

    const handleCloseModal = () => {
        setModalIsActive(false)
        setOverlayActive(false)
    }

    useEffect(() => {
      if(task.recurrenceOf){
        setparentTask(parentTasks.find(tasks => tasks._id == task.recurrenceOf))
      }
    }, [])
    

  return (
    <>
      <div
        className={`w-full  ${
          status == "pending" && `bg-dark-400  border-transparent`
        } ${
          status == "completed" && ` border-dark-400`
        }  rounded-xl px-3 border-2 py-[10px] flex items-center justify-between cursor-pointer`}
        onClick={() => setModalIsActive(true)}
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
          //onClick={handleChangeStatus}
        >
          {status == "completed" && (
            <FaCheck className="text-sm" id={`status_icon_${task._id}`} />
          )}
        </div>
      </div>
      <ModalItemTask task={task} parentTask={parentTask} modalIsActive={modalIsActive} onClose={handleCloseModal}/>
    </>
  );
}
