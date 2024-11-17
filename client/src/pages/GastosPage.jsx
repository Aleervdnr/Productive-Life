import { useEffect } from "react";
import mockupDesktop from "../assets/PLMockDesktop.png";
import mockMobile from "../assets/PLMockMobile.png";
import useWindowSize from "../hooks/useWindowSize";

export default function GastosPage({ setActiveItem }) {
  useEffect(() => {
    setActiveItem("gastos");
  }, []);

  const { width } = useWindowSize();

  return (
    <div className="h-[calc(100vh-55px)] lg:h-screen w-full flex flex-col justify-center items-center font-medium px-5">
      <img
        src={width > 475 ? mockupDesktop : mockMobile}
        alt=""
        className={`${width > 475 ? "w-[600px] " : "w-[250px]"} ${
          width > 1024 && "w-[750px]"
        }`}
      />
      <p className="text-center font-semibold">
        ¡Estamos trabajando en esto! 🔧
      </p>
      <p className="text-center font-semibold">
        Esta sección estará disponible pronto. ¡Mantente atento a las novedades!
      </p>
    </div>
  );
}
