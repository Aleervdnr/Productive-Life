import { useEffect } from "react";
import Lottie from "react-lottie-player";
import lottieJson from "../assets/Animation - 1729962365245.json"
import useWindowSize from "../hooks/useWindowSize";

export default function ComprasPage({ setActiveItem }) {
  useEffect(() => {
    setActiveItem("compras");
  }, []);
  const { width } = useWindowSize();

  return (
    <div className="h-[calc(100vh-55px)] lg:h-screen w-full flex flex-col justify-center items-center font-medium px-5">
      <Lottie
        loop
        animationData={lottieJson}
        play
        style={
          width > 1024
            ? { width: 350, height: 350 }
            : { width: 220, height: 220 }
        }
      />
      <p className="text-center">
      Esta área aún está en construcción 🛠️. Pronto podrás disfrutar de nuevas
      funcionalidades aquí.
      </p>
    </div>
  );
}
