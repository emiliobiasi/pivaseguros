import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <>
      {/* Rodapé */}
      <footer className="p-6" style={{ backgroundColor: "#f1efef" }}>
        <div className="container mx-auto h-50 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Seção de Direitos Reservados */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-500">
              © Copyright 2024 - Piva Corretora de Seguros - Todos os direitos
              reservados
            </p>
          </div>

          {/* Seção de Contatos */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="flex items-center">
              <a
                href="https://api.whatsapp.com/send?phone=551145875550&text=Ola%20Seja%20bem%20vindo%20a%20Piva%20Seguros"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <FaWhatsapp className="mr-2 text-green-600" />
                <span className="text-sm text-gray-500">11 4587-5550</span>
              </a>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2 text-green-600" />
              <span className="text-sm text-gray-500">
                Rua Itália, 111 - Jd. Bonfiglioli - Jundiaí/SP
              </span>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="mr-2 text-green-600" />
              <span className="text-sm text-gray-500">
                contato@pivaseguros.com.br
              </span>
            </div>
          </div>

          {/* Seção de Redes Sociais */}
          <div className="flex justify-center md:justify-end space-x-4">
            <a
              href="https://web.facebook.com/pivaseguros/?_rdc=1&_rdr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="transform hover:scale-110 transition-transform duration-300"
            >
              <FaFacebookF className="w-6 h-6 text-green-500 hover:text-green-300" />
            </a>
            <a
              href="https://www.instagram.com/pivacorretoradeseguros/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transform hover:scale-110 transition-transform duration-300"
            >
              <FaInstagram className="w-6 h-6 text-green-500 hover:text-green-300" />
            </a>
          </div>
        </div>
      </footer>

      {/* Ícone fixo do WhatsApp */}
      {/* <a
        href="https://api.whatsapp.com/send?phone=551145875550&text=Ola%20Seja%20bem%20vindo%20a%20Piva%20Seguros"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed lg:bottom-20 lg:right-20 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-500 transition duration-300"
      >
        <FaWhatsapp className="w-8 h-8" />
      </a> */}
    </>
  );
};

export default Footer;
