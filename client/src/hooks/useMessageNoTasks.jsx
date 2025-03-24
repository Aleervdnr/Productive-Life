import { useLanguage } from "../context/LanguageContext";

export default function useMessageNoTasks() {
  const { language } = useLanguage();
  let messages = [
    "¡Hoy está en blanco! 🎨 ¿Qué te gustaría lograr hoy? Agrega una tarea y comienza a avanzar.",
    "¡Es un buen día para empezar algo nuevo! 🌱 Añade una tarea y alcanza tus metas.",
    "Sin tareas por aquí... ¿Listo para hacer del día algo productivo? ✨ Planifica tu siguiente paso.",
    "Nada en la lista por ahora, ¡pero hoy puede ser un gran día! 🌞 ¿Qué te gustaría conseguir?",
    "Tu día está esperando... 📝 ¿Qué tal si le damos un propósito? ¡Agrega tu primera tarea!",
    "¡Todo despejado por aquí! Pero recuerda: las grandes metas se logran paso a paso. ¿Qué harás hoy?",
    "Parece que no tienes nada por hacer… ¡Es la oportunidad perfecta para iniciar algo nuevo! 🎉",
    "Un día sin tareas, ¿quizá quieras cambiar eso? Añade una actividad y alcanza algo importante.",
  ];
  if(language == "en"){
    messages = [
      "It's a blank slate today! 🎨 What would you like to achieve? Add a task and get started.",
      "A great day to start something new! 🌱 Add a task and reach your goals.",
      "No tasks here... Ready to make today productive? ✨ Plan your next move.",
      "Nothing on the list yet, but today can be amazing! 🌞 What would you like to accomplish?",
      "Your day is waiting... 📝 How about giving it a purpose? Add your first task!",
      "All clear here! But remember: big goals are achieved step by step. What will you do today?",
      "Looks like you have nothing to do… This is the perfect chance to start something new! 🎉",
      "A day without tasks—maybe you’d like to change that? Add an activity and achieve something meaningful.",
      "The day is yours to shape! 💡 What’s the first thing you’ll tackle?",
      "Time to turn this empty space into action! 🚀 What’s on your mind?",
      "No tasks yet? No problem! Today is full of possibilities. What’s your plan?",
      "An empty list is just the beginning! ✍️ What’s worth doing today?",
      "The canvas is empty—what masterpiece will you create today? 🖼️ Add a task!",
      "Every great journey starts with a single step. What’s your step today? 👣",
      "You’re starting fresh today! 🌟 What’s the first thing you’ll add to your list?",
      "A clean slate awaits! 📋 What’s the one thing you’ll commit to today?",
      "No tasks? No stress! Let’s make today count. What’s your goal? 🎯",
      "Today is a gift—what will you unwrap? 🎁 Add a task and get moving!",
      "The day is young and full of potential! 🌈 What will you achieve?",
      "Empty list? That’s a sign to dream big and start small! ✨ What’s next?"
    ];
  }

  const randomMessage =
    messages[Math.floor(Math.random() * messages.length)];

  return {randomMessage};
}
