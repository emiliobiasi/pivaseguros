import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Atualiza o horário a cada segundo
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-200">
      {/* Saudação de boas-vindas */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
        Bem-vindo de volta!
      </h1>

      {/* Relógio Digital */}
      <div className="relative bg-gray-900 text-white rounded-[40px] shadow-lg p-8 flex flex-col items-center w-[350px] h-[450px]">
        {/* Efeito de brilho ao redor do relógio */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-[40px] blur-xl opacity-30"></div>

        {/* Relógio */}
        <div className="relative z-10 text-6xl font-bold font-mono tracking-wide">
          {format(currentTime, "HH:mm:ss")}
        </div>

        {/* Data */}
        <div className="relative z-10 text-xl mt-4 text-gray-300">
          {format(currentTime, "EEEE, dd 'de' MMMM 'de' yyyy", {
            locale: ptBR,
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
