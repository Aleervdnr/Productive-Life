import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Slide from "./Slide";
import slide1 from "../../assets/slide1.png";
import slide2 from "../../assets/slide2.png";

export function EmblaCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({delay:4000})]);

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        <div className="embla__slide">
          <Slide img={slide1}>
            <p className="text-[#232429] text-3xl text-center font-medium w-[400px]">
              La <span className="text-white font-semibold">App</span> que hará
              tus días mas{" "}
              <span className="text-white font-semibold">productivos</span>
            </p>
          </Slide>
        </div>
        <div className="embla__slide">
          <Slide img={slide2}>
            <p className="text-[#232429] text-3xl text-center font-medium w-[400px]">
              Tus <span className="text-white font-semibold">Hábitos</span>,
              <span className="text-white font-semibold">Tareas</span> y{" "}
              <span className="text-white font-semibold">Gastos</span> en una
              sola <span className="text-white font-semibold">App</span>
            </p>
          </Slide>
        </div>
      </div>
    </div>
  );
}