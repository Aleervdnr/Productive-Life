import { useForm } from "react-hook-form";
import { useTasks } from "../../context/TasksContext.jsx";
import { useDate } from "../../context/DateContext.jsx";
import { isBefore } from "date-fns";
import TaskFormModalContent from "./TaskFormModalContent.jsx";
import { useEffect, useState } from "react";
import useWindowSize from "../../hooks/useWindowSize.jsx";
import TaskFormModal from "./TaskFormModal.jsx";
import { useUi } from "../../context/UiContext.jsx";
import { MdOutlineAdd } from "react-icons/md";
import { useTranslation } from "../../hooks/UseTranslation.jsx";

export default function TaskFormButton({ styles }) {
  //Handle Steps
  const [step, setStep] = useState(1);
  const { width } = useWindowSize();
  const { setOverlayActive, setTaskFormActive } = useUi();
  const { t } = useTranslation();

  const handleClick = () => {
    setOverlayActive(true);
    setTaskFormActive(true);
  };
  return (
    <>
      <button
        className={`bg-violet-main w-11 h-11 rounded-full text-2xl absolute bottom-5 right-5 flex justify-center items-center lg:bottom-0 lg:right-0 lg:relative lg:w-fit lg:h-fit lg:py-[10px] lg:px-4 lg:text-xs lg:flex lg:m-0 lg:my-auto lg:justify-self-end ${styles}`}
        onClick={handleClick}
      >
        <span className="hidden lg:block lg:font-semibold">{t("tasks.addTaskButton")}</span>
        <span
          id={width >= 1024 ? "step-4" : "step-3"}
          className="lg:text-md lg:leading-3 lg:font-medium lg:pl-1 "
        >
          <MdOutlineAdd />
        </span>
      </button>
      <TaskFormModal />
    </>
  );
}

{
  /* <dialog id="my_modal_50" className="modal">
<div className="modal-box bg-dark-400 overflow-hidden">
  <form method="dialog" onSubmit={() => setStep(1)}>
    //if there is a button in form, it will close the modal
    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
      ✕
    </button>
  </form>
  <TaskFormModalContent step={step} setStep={setStep} />
</div>
</dialog> */
}
