import React from "react";
import logo from "../assets/logo.png";
import desktopView from "../assets/desktop.png";
import mobileView from "../assets/mobile.png";
import mobileTaskSkew from "../assets/mobileTaskSkew.png";
import mobileExpensesSkew from "../assets/mobileExpensesSkew.png";
import taskItemsSkew from "../assets/card2.png";
import calendarSkew from "../assets/card3.png";


export default function Landing() {
  return (
    <div className="overflow-hidden">
      <header className="px-5 h-[75px] grid items-center ">
        <img src={logo} alt="logo productive life" className="max-w-[150px] " />
      </header>
      <main className="px-5">
        <section className="text-center grid justify-items-center gap-4 py-12">
          <h1 className="text-4xl font-bold">
            Organiza Tu Vida, Alcanzando Tu Máximo Potencial
          </h1>
          <p className="text-dark-100 text-lg">
            La plataforma de gestión personal diseñada para ayudarte a optimizar
            tu día a día.
          </p>
          <button className="bg-gradient-to-bl from-violet-main to-[#4C4599] px-4 py-2 w-fit rounded-lg">
            Únete a la Lista de Espera
          </button>
        </section>
        <section className="mb-16 grid place-content-center">
          <img src={mobileView} alt="" className="max-w-[300px] card-3d" />
        </section>

        <section className="text-center grid gap-12">
          <div className="grid gap-2">
            <h2 className="text-2xl font-bold">
              Todo lo que Necesitas para Organizar tu Vida
            </h2>
            <p className="text-dark-100">
              Con Productive Life tendrás acceso a herramientas que te ayudarán
              a mantener el control de tus días. Desde tareas pendientes hasta
              objetivos a largo plazo, todo está a tu alcance.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="relative w-full bg-gradient-to-bl from-[#26272D] to-[#1B1C20] px-6 py-8 overflow-hidden  h-[600px] rounded-lg">
              <div>
                <span className="text-3xl">✅</span>
                <h3 className="font-bold text-lg">Gestión de Tareas</h3>
                <p className="text-dark-100">
                  {" "}
                  Organiza tus pendientes con fechas, horarios y recordatorios.
                </p>
              </div>
              <img
                src={mobileTaskSkew}
                className="absolute scale-125 top-[210px] translate-x-6 "
                alt=""
              />
            </div>
            <div className="w-full bg-gradient-to-bl from-[#26272D] to-[#1B1C20] px-6 py-8 grid gap-4 rounded-lg">
              <div>
                <span className="text-3xl">📊</span>
                <h3 className="font-bold text-lg">Seguimiento de Hábitos</h3>
                <p className="text-dark-100">
                  Establece hábitos saludables y monitorea tu progreso.
                </p>
              </div>
              <img src={taskItemsSkew} className="" alt="" />
            </div>
            <div className="w-full bg-gradient-to-bl from-[#26272D] to-[#1B1C20] px-6 py-8 grid gap-4 rounded-lg">
              <div>
                <span className="text-3xl">📅</span>
                <h3 className="font-bold text-lg">Calendario Integrado</h3>
                <p className="text-dark-100">
                  Visualiza y planea tu semana o mes de forma sencilla.
                </p>
              </div>
              <img src={calendarSkew} className="" alt="" />
            </div>
            <div className="relative w-full bg-gradient-to-bl from-[#26272D] to-[#1B1C20] px-6 py-8 overflow-hidden h-[600px] rounded-lg">
              <div>
                <span className="text-3xl">💰</span>
                <h3 className="font-bold text-lg">Control de Gastos</h3>
                <p className="text-dark-100">
                  Registra tus finanzas y analiza tus gastos de forma
                  inteligente.
                </p>
              </div>
              <img
                src={mobileExpensesSkew}
                className="absolute scale-125 top-[210px] translate-x-6 "
                alt=""
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
