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

  // Calcula os ângulos para os ponteiros do relógio analógico
  const seconds = currentTime.getSeconds();
  const minutes = currentTime.getMinutes();
  const hours = currentTime.getHours();

  const secondDeg = seconds * 6; // 360 / 60
  const minuteDeg = minutes * 6 + seconds * 0.1; // Movimento suave
  const hourDeg = (hours % 12) * 30 + minutes * 0.5; // Movimento suave

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#008834] to-green-500 p-4">
      {/* Saudação de boas-vindas */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-8 drop-shadow-lg text-center">
        Bem-vindo de volta!
      </h1>

      {/* Relógio */}
      <div className="relative bg-gray-900 bg-opacity-50 text-white rounded-[40px] shadow-2xl p-6 flex flex-col items-center w-full max-w-md">
        {/* Efeito de brilho ao redor do relógio */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-[#008834] rounded-[40px] blur-2xl opacity-60 animate-pulse"></div>

        {/* Relógio Analógico 3D */}
        <div
          className="relative z-10 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-[#ffffff] to-[#d1d1d1] rounded-full flex items-center justify-center shadow-inner mt-4 border-4 border-opacity-20 border-gray-700"
          style={{ perspective: "800px" }}
        >
          {/* Marcadores do relógio */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-4 md:h-6 bg-gray-800 rounded"
              style={{
                transform: `rotate(${i * 30}deg) translateY(-80px)`,
              }}
            ></div>
          ))}

          {/* Ponteiro das horas */}
          <div
            className="absolute w-2 bg-gray-800 origin-bottom rounded-full shadow-md"
            style={{
              height: "35%", // Ajusta a altura do ponteiro para centralizar melhor
              top: "50%",
              left: "50%",
              transformOrigin: "bottom center",
              transform: `translateX(-50%) translateY(-100%) rotate(${hourDeg}deg) skewY(-10deg)`,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
            }}
          ></div>

          {/* Ponteiro dos minutos */}
          <div
            className="absolute w-1.5 bg-gray-600 origin-bottom rounded-full shadow-md"
            style={{
              height: "45%", // Ajusta a altura do ponteiro para centralizar melhor
              top: "50%",
              left: "50%",
              transformOrigin: "bottom center",
              transform: `translateX(-50%) translateY(-100%) rotate(${minuteDeg}deg) skewY(-10deg)`,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
            }}
          ></div>

          {/* Ponteiro dos segundos */}
          <div
            className="absolute w-1 bg-red-500 origin-bottom rounded-full"
            style={{
              height: "50%", // Ajusta a altura do ponteiro para centralizar melhor
              top: "50%",
              left: "50%",
              transformOrigin: "bottom center",
              transform: `translateX(-50%) translateY(-100%) rotate(${secondDeg}deg) skewY(-10deg)`,
              boxShadow: "0px 4px 10px rgba(255, 0, 0, 0.5)",
            }}
          ></div>

          {/* Centro do relógio */}
          <div className="absolute w-5 h-5 md:w-6 md:h-6 bg-black rounded-full shadow-xl"></div>

          {/* Reflexo do vidro */}
          <div
            className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-br from-transparent to-white opacity-20 z-0"
            style={{ transform: "rotateX(25deg) rotateY(-20deg)" }}
          ></div>
        </div>

        {/* Relógio Digital */}
        <div className="relative z-10 text-4xl md:text-6xl font-bold font-mono tracking-wide mt-8 drop-shadow-lg text-white">
          {format(currentTime, "HH:mm:ss")}
        </div>

        {/* Data */}
        <div className="relative z-10 text-lg md:text-xl mt-4 text-white text-center">
          {format(currentTime, "EEEE, dd 'de' MMMM 'de' yyyy", {
            locale: ptBR,
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
