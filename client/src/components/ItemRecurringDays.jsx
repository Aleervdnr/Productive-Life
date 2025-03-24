import useWindowSize from "../hooks/useWindowSize";

export default function ItemRecurringDays({
  name,
  isoDay,
  isActive,
  handleToggle,
}) {
  const { width } = useWindowSize();

  const handleClick = () => {
    handleToggle(isoDay);
  };

  return (
    <div
      className={`border px-[8px] py-[2px] rounded-full  transition-colors text-sm cursor-pointer ${
        isActive
          ? `bg-violet-main text-white border-violet-main`
          : ` text-dark-100 border-violet-main`
      }`}
      onClick={handleClick}
    >
      {width <= 375
        ? name.charAt(0)
        : width < 1024
        ? name.slice(0, 3)
        : name.slice()}{" "}
    </div>
  );
}
