import { useEffect } from "react";
import useWindowSize from "../hooks/useWindowSize";

export default function GastosPage({ setActiveItem }) {
  useEffect(() => {
    setActiveItem("gastos");
  }, []);

  const { width } = useWindowSize();

  return (
    <div className="h-[calc(100vh-55px)] lg:h-screen w-full flex flex-col justify-center items-center font-medium px-5">

    </div>
  );
}
