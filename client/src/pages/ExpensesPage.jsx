import { useEffect } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { useExpenses } from "../context/ExpensesContext";
import { useAuth } from "../context/AuthContext";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

export default function ExpensesPage({ setActiveItem }) {
  useEffect(() => {
    setActiveItem("gastos");
  }, []);

  const { width } = useWindowSize();
  const { expenses, incomes, fixedExpenses, totalExpenses, createExpense } =
    useExpenses();
  const { user } = useAuth();

  const handleSubmit = () => {
    const expense = {
      title: "Sobro mes anterior",
      amount: 41699.58,
      date: "2025-01-01",
      category: "Credito",
      type: "Income",
    };

    createExpense(expense);
  };

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  // Obtener mes y año actual
  const currentMonth = new Date().getMonth(); // Mes actual (0-11)
  const currentYear = new Date().getFullYear(); // Año actual

  // Filtrar los datos del mes actual
  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(parseISO(expense.date));
    return (
      (expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear &&
        expense.type === "Expense") ||
      expense.type === "Fixed Expense"
    );
  });

  const currentMonthIncomes = expenses.filter((expense) => {
    const expenseDate = new Date(parseISO(expense.date));
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear &&
      expense.type === "Income"
    );
  });

  // Generar datos para el gráfico (agrupar por día del mes)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Días en el mes actual
  const dailyExpenses = new Array(daysInMonth).fill(0);
  const dailyIncomes = new Array(daysInMonth).fill(0);

  currentMonthExpenses.forEach((expense) => {
    const day = new Date(parseISO(expense.date)).getDate() - 1; // Día del mes (1-31)
    dailyExpenses[day] += expense.amount;
  });

  currentMonthIncomes.forEach((income) => {
    const day = new Date(parseISO(income.date)).getDate() - 1;
    dailyIncomes[day] += income.amount;
  });

  const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const data = {
    labels,
    datasets: [
      {
        label: "Gastos Totales",
        data: dailyExpenses,
        borderColor: "rgb(126, 115, 255)",
        backgroundColor: "rgba(126, 115, 255, 0.5)",
      },
      {
        label: "Ingresos Totales",
        data: dailyIncomes,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gastos del Mes',
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            // Formatear los valores para evitar decimales innecesarios
            if (value >= 1000) {
              const formattedValue = value / 1000;
              return Number.isInteger(formattedValue)
                ? `${formattedValue}k` // Sin decimales si el número es entero
                : `${formattedValue.toFixed(1)}k`; // Con un decimal si no es entero
            }
            return value; // Para valores menores a 1000, se muestran tal cual
          },
        },
      },
    },
  };
  
  

  return (
    <div className="w-full h-[calc(100dvh-55px)] lg:h-dvh overflow-hidden relative">
      <div className="grid px-5 lg:hidden">
        <span className="text-2xl capitalize">
          Hola, {user.name.split(" ")[0]}!{" "}
        </span>
        <span className="text-xs text-dark-100">
          {format(new Date(), "d 'de' MMMM yyyy", { locale: es })}
        </span>
      </div>
      <div className="px-5">
        <div className="flex flex-col py-3">
          <span className="font-medium text-xl">Balance Total</span>
          <span className="font-semibold text-4xl">
            {(incomes - totalExpenses).toLocaleString("es-ar", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 0,
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className=" text-sm">Ingresos</span>
            <span className="font-medium">
              {incomes.toLocaleString("es-ar", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
              })}
            </span>
          </div>
          <div className="flex flex-col">
            <span className=" text-sm">Gastos Totales</span>
            <span className="font-medium">
              {totalExpenses.toLocaleString("es-ar", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
              })}
            </span>
          </div>
          <div className="flex flex-col">
            <span className=" text-sm">Gastos Fijos</span>
            <span className="font-medium">
              {fixedExpenses.toLocaleString("es-ar", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5">
        <Line options={options} data={data} />
      </div>

      <div className="px-5">
        <span className="font-semibold text-lg">Actividad</span>
      </div>
      <button onClick={handleSubmit}>Crear Gasto</button>
    </div>
  );
}
