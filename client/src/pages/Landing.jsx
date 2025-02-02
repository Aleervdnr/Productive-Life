import React from "react";
import logo from "../assets/logo.png";
import desktopView from "../assets/desktop.png";
import mobileView from "../assets/mobile.png";
import mobileTaskSkew from "../assets/mobileTaskSkew.png";
import mobileExpensesSkew from "../assets/mobileExpensesSkew.png";
import taskItemsSkew from "../assets/card2.png";
import calendarSkew from "../assets/card3.png";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import InputForm from "../components/InputForm";
import { useForm } from "react-hook-form";
import useWindowSize from "../hooks/useWindowSize";

export default function Landing() {
  const { width } = useWindowSize();

  const refImg1 = useRef(null);
  const isInViewImg1 = useInView(refImg1, {
    once: true,
    margin: width < 1024 ? "0px" : "-30% 0px -30% 0px",
  });
  const refImg2 = useRef(null);
  const isInViewImg2 = useInView(refImg2, {
    once: true,
    margin: "-5% 0px -5% 0px",
  });
  const refImg3 = useRef(null);
  const isInViewImg3 = useInView(refImg3, {
    once: true,
    margin: "-5% 0px -5% 0px",
  });

  const { register } = useForm();

  return (
    <div className="overflow-hidden">
      <header className="px-5 md:px-16 xl:px-20 h-[75px] grid items-center ">
        <img src={logo} alt="logo productive life" className="max-w-[150px] " />
      </header>
      <main className="px-5 md:px-16 xl:px-20">
        <section className="py-12">
          <motion.div
            className="max-w-screen-lg mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center grid justify-items-center gap-4 ">
              <h1 className="text-4xl font-bold sm:max-w-[600px] ">
                Organiza Tu Vida, Alcanzando Tu Máximo Potencial
              </h1>
              <p className="text-dark-100 text-lg sm:max-w-[600px] ">
                La plataforma de gestión personal diseñada para ayudarte a
                optimizar tu día a día.
              </p>
              <button className="bg-gradient-to-bl from-violet-main to-[#4C4599] px-4 py-2 w-fit rounded-lg">
                Únete a la Lista de Espera
              </button>
            </div>
          </motion.div>
        </section>
        <section className="relative mb-16 grid place-content-center">
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[50%] h-[50%]">
            <motion.div
              ref={refImg1}
              className="max-w-screen-lg w-full h-full mx-auto"
              initial={{ scale: 0 }}
              animate={isInViewImg1 && width < 1024 ? { scale: 1 } : {}}
              whileInView={width >= 1024 && { scale: 1 }}
              transition={{ duration: 1.2 }}
            >
              <div className="bg-violet-main w-full h-full blur-3xl"></div>
            </motion.div>
          </div>
          <motion.div
            ref={refImg1}
            className="max-w-screen-lg mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={isInViewImg1 && width < 1024 ? { opacity: 1, y: 0 } : {}}
            whileInView={width >= 1024 && { opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <img
              src={width >= 768 ? desktopView : mobileView}
              alt="Mobile View"
              className={
                width >= 768
                  ? "max-w-[620px] card-3d"
                  : "h-[450px] max-w-full card-3d"
              }
            />
          </motion.div>
        </section>

        <section className="text-center grid gap-12">
          <div className="grid gap-2">
            <motion.div
              className="max-w-screen-lg mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold">
                Todo lo que Necesitas para Organizar tu Vida
              </h2>
            </motion.div>
            <motion.div
              className="max-w-screen-lg mx-auto"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-dark-100 text-sm sm:max-w-[550px]">
                Con Productive Life tendrás acceso a herramientas que te
                ayudarán a mantener el control de tus días. Desde tareas
                pendientes hasta objetivos a largo plazo, todo está a tu
                alcance.
              </p>
            </motion.div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[310px,391px]">
            <motion.div
              className="max-w-screen-lg mx-auto lg:row-span-2"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.2 }}
            >
              <div className="relative w-full bg-gradient-to-bl from-[#26272D] to-[#1B1C20] px-6 py-8 overflow-hidden  h-[600px] lg:h-full rounded-lg max-w-[430px]">
                <div>
                  <motion.div
                    className="max-w-screen-lg mx-auto"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    <span className="text-3xl">✅</span>
                    <h3 className="font-bold text-lg py-1">
                      Gestión de Tareas
                    </h3>
                  </motion.div>
                  <motion.div
                    className="max-w-screen-lg mx-auto"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <p className="text-dark-100 text-sm">
                      {" "}
                      Organiza tus pendientes con fechas, horarios y
                      recordatorios.
                    </p>
                  </motion.div>
                </div>
                <motion.div
                  ref={refImg2}
                  className="max-w-screen-lg mx-auto relative"
                  initial={{ opacity: 0, y: 210, scale: 1.25 }}
                  animate={
                    isInViewImg2 ? { opacity: 1, y: 0, scale: 1.25 } : {}
                  }
                  transition={{ duration: 1 }}
                >
                  <img
                    src={mobileTaskSkew}
                    className="absolute top-[50%] left-[50%] translate-x-[-50%] max-w-[280px]"
                    alt=""
                  />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="max-w-screen-lg mx-auto lg:col-start-2"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.2 }}
            >
              <div className="w-full h-full bg-gradient-to-bl from-[#26272D] to-[#1B1C20] px-6 py-8 grid gap-4 rounded-lg">
                <div>
                  <motion.div
                    className="max-w-screen-lg mx-auto"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="text-3xl">📊</span>
                    <h3 className="font-bold text-lg py-1">
                      Seguimiento de Hábitos
                    </h3>
                  </motion.div>
                  <motion.div
                    className="max-w-screen-lg mx-auto"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <p className="text-dark-100 text-sm">
                      Establece hábitos saludables y monitorea tu progreso.
                    </p>
                  </motion.div>
                </div>
                <motion.div
                  className="max-w-screen-lg mx-auto"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <img src={taskItemsSkew} className="" alt="" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="max-w-screen-lg mx-auto lg:col-start-2 lg:row-start-2"
              initial={{ scale: 0.7 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.2 }}
            >
              <div className="w-full h-full bg-gradient-to-bl from-[#26272D] to-[#1B1C20] px-6 py-8 grid gap-4 rounded-lg">
                <div>
                  <motion.div
                    className="max-w-screen-lg mx-auto"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="text-3xl">📅</span>
                    <h3 className="font-bold text-lg py-1">
                      Calendario Integrado
                    </h3>
                  </motion.div>
                  <motion.div
                    className="max-w-screen-lg mx-auto"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <p className="text-dark-100 text-sm">
                      Visualiza y planea tu semana o mes de forma sencilla.
                    </p>
                  </motion.div>
                </div>
                <motion.div
                  className="max-w-screen-lg mx-auto"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <img src={calendarSkew} className="" alt="" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="max-w-screen-lg mx-auto md:row-start-1 md:col-start-2 lg:col-start-3 lg:row-span-2"
              initial={{ scale: 0.7 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.2 }}
            >
              <div className="relative w-full bg-gradient-to-bl from-[#26272D] to-[#1B1C20] px-6 py-8 overflow-hidden h-[600px] lg:h-full rounded-lg max-w-[430px]">
                <div>
                  <motion.div
                    className="max-w-screen-lg mx-auto"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="text-3xl">💰</span>
                    <h3 className="font-bold text-lg py-1">
                      Control de Gastos
                    </h3>
                  </motion.div>
                  <motion.div
                    className="max-w-screen-lg mx-auto"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <p className="text-dark-100 text-sm">
                      Registra tus finanzas y analiza tus gastos de forma
                      inteligente.
                    </p>
                  </motion.div>
                </div>
                <motion.div
                  ref={refImg3}
                  className="max-w-screen-lg mx-auto"
                  initial={{ opacity: 0, y: 210, scale: 1.25 }}
                  animate={
                    isInViewImg3 ? { opacity: 1, y: 0, scale: 1.25 } : {}
                  }
                  transition={{ duration: 1 }}
                >
                  <img
                    src={mobileExpensesSkew}
                    className="absolute top-[50%] left-[50%] translate-x-[-50%] max-w-[280px]"
                    alt=""
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
        <section className="text-center grid gap-12 py-14">
          <div className="grid gap-2">
            <motion.div
              className="max-w-screen-lg mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold">
                Transforma tu Productividad en Resultados Reales
              </h2>
            </motion.div>
            <motion.div
              className="max-w-screen-lg mx-auto"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-dark-100 text-sm md:max-w-[640px]">
                Productive Life no es solo una herramienta, es tu compañero para
                alcanzar metas. Ya sea que quieras maximizar tu tiempo,
                establecer hábitos consistentes o mantener tus finanzas en
                orden, nuestra plataforma te da todo lo necesario para triunfar.
              </p>
            </motion.div>
          </div>
          <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-[270px,255px,270px] lg:gap-x-12 lg:grid-rows-2 lg:items-center lg:place-content-center">
            <motion.div
              className="max-w-[270px] h-fit mx-auto bg-dark-400 p-6 rounded-lg shadow-xl z-10"
              initial={{ scale: 0.7 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.2 }}
            >
              <div className="text-dark-100 grid gap-2">
                <h4 className="text-white font-semibold">
                  Análisis de Productividad
                </h4>
                <span className="text-3xl">📊</span>
                <p className="text-xs">
                  Estadísticas semanales sobre tu rendimiento.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="max-w-[270px] h-fit mx-auto bg-dark-400 p-6 rounded-lg shadow-xl z-10"
              initial={{ scale: 0.7 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.2 }}
            >
              <div className="text-dark-100 grid gap-2">
                <h4 className="text-white font-semibold">Modo Enfoque</h4>
                <span className="text-3xl">🎯</span>
                <p className="text-xs">
                  Integración con el Reloj Pomodoro para mejorar la
                  concentración.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="max-w-screen-lg max-lg:hidden lg:row-start-1 lg:row-end-3 lg:col-start-2 z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={mobileView}
                alt="Mobile View"
                className={"h-[450px] max-w-full card-3d"}
              />
            </motion.div>

            <motion.div
              className="max-w-[270px] h-fit mx-auto bg-dark-400 p-6 rounded-lg shadow-xl z-10"
              initial={{ scale: 0.7 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.2 }}
            >
              <div className="text-dark-100 grid gap-2">
                <h4 className="text-white font-semibold">
                  Planificación Avanzada
                </h4>
                <span className="text-3xl">📆</span>
                <p className="text-xs">
                  Organiza eventos, proyectos y hábitos a largo plazo con un
                  calendario intuitivo.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="max-w-[270px] h-fit mx-auto bg-dark-400 p-6 rounded-lg shadow-xl z-10"
              initial={{ scale: 0.7 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.2 }}
            >
              <div className="text-dark-100 grid gap-2">
                <h4 className="text-white font-semibold"> Todo en Uno</h4>
                <span className="text-3xl">🌀</span>
                <p className="text-xs">
                  Productive Life combina gestión de tareas, hábitos, finanzas y
                  planificación en una sola plataforma intuitiva y eficiente.
                </p>
              </div>
            </motion.div>
            <div className="max-lg:hidden absolute z-[0] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[50%] h-[50%] opacity-50">
              <motion.div
                className="max-w-screen-lg w-full h-full mx-auto"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.2 }}
              >
                <div className="bg-violet-main w-full h-full blur-3xl"></div>
              </motion.div>
            </div>
          </div>
        </section>
        <section className="grid gap-4 text-center pb-6 lg:flex lg:bg-dark-400 lg:py-12 lg:px-10 lg:rounded-md lg:mb-14">
          <div className="text-center lg:grid lg:place-content-center lg:gap-2">
            <h3 className="text-white font-semibold text-2xl lg:text-xl">
              Sé el Primero en Probar Productive
              <span className="text-violet-main">Life</span>{" "}
            </h3>
            <p className="text-dark-100 text-sm max-w-[480px] mx-auto">
              Estamos a punto de lanzar nuestra versión inicial. Únete a la
              lista de espera para recibir actualizaciones exclusivas y ser
              parte del inicio de Productive Life.
            </p>
          </div>
          <div className="grid gap-2 bg-dark-400 p-4 rounded-md w-fit lg:w-1/2 mx-auto">
            <span className="text-xs font-semibold py-2 ">
              ¡Forma parte de los primeros usuarios y obtén beneficios
              exclusivos al lanzar el producto!
            </span>
            <form className="w-full grid grid-cols-[clamp(250px,50vw,300px)] gap-2 justify-center justify-items-center sm:grid-cols-[clamp(150px,100%,300px),100px] sm:gap-0 lg:grid-cols-1 lg:gap-2 lg:justify-items-end mx-auto">
              <InputForm
                typeInput={"email"}
                placeholder={"Ingrese su email"}
                name={"email"}
                register={register}
              />

              <button className="bg-gradient-to-bl from-violet-main to-[#4C4599] px-2 py-2 w-fit h-[44px]  rounded-md sm:rounded-none sm:rounded-tr-md sm:rounded-br-md lg:rounded-md lg:h-fit  text-xs font-semibold">
                ¡Únete Ahora!
              </button>
            </form>
          </div>
        </section>
      </main>
      <footer className="px-5 md:px-16 xl:px-20 border-t-dark-400 border-t-[0.5px] py-2">
        <img src={logo} alt="logo productive life" className="max-w-[100px] " />
        <span className="text-dark-100 text-xs">
          ©2025. All rights reserved
        </span>
      </footer>
    </div>
  );
}
