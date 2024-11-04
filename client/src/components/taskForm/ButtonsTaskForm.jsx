import { RiArrowRightSLine } from "react-icons/ri";
import { RiArrowLeftSLine } from "react-icons/ri";
import { RiSave3Line } from "react-icons/ri";

export function NextButton({ disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center px-[5px] py-[3px] text-sm font-medium  w-fit bg-violet-main rounded disabled:opacity-50"
      disabled={disabled}
      // disabled={titleText?.length > 0 ? false : true}
    >
      Siguiente
      <RiArrowRightSLine className="text-2xl" />
    </button>
  );
}

export function BackButton({ onClick }) {
  return (
    <button onClick={onClick} className="flex items-center">
      <RiArrowLeftSLine className="text-xl" />
      Volver
    </button>
  );
}

export function SaveButton() {
  return (
    <button className="flex items-center px-[5px] py-[3px] text-sm font-medium  w-fit bg-violet-main rounded">
      <RiSave3Line className="text-xl pr-1" />
      Guardar
    </button>
  );
}
