import React from "react"
import { Link } from "react-router-dom"
import {
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa"
import logo from "../../assets/logo.png"

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      aria-label="Rodapé"
      className="relative border-t border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950"
    >
      {/* Top accent bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600" />

      <div className="container mx-auto px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {/* Brand + tagline */}
          <div>
            <div className="inline-flex items-center gap-3 group">
              <img
                src={logo}
                alt="Piva Seguros"
                className="h-12 p-[0.2rem]  w-auto rounded-md bg-white shadow-sm ring-1 ring-zinc-200/80 dark:ring-zinc-700"
                loading="lazy"
              />
              <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 transition-colors">
                PMJ & PIVA
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Soluções sob medida para imobiliárias e clientes. Atendimento
              humano, processos simples e seguros que funcionam.
            </p>

            {/* WhatsApp CTA */}
            <div className="mt-4">
              <a
                href="https://api.whatsapp.com/send?phone=551145875550&text=Olá!%20Quero%20falar%20com%20um%20especialista%20da%20Piva%20Seguros."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm ring-1 ring-emerald-700/30 hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition"
                aria-label="Falar no WhatsApp"
              >
                <FaWhatsapp className="h-4 w-4" />
                Fale no WhatsApp
              </a>
            </div>
          </div>

          {/* Links úteis */}
          <nav aria-label="Links úteis" className="">
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">
                Para imobiliárias
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    to="/imobiliaria/formulario"
                    className="text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors"
                  >
                    Formulários
                  </Link>
                </li>
                <li>
                  <Link
                    to="/imobiliaria/download-boletos"
                    className="text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors"
                  >
                    Boletos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/imobiliaria/protocolo-cancelamento"
                    className="text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors"
                  >
                    Cancelamentos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/imobiliaria/protocolo-abertura-sinistro"
                    className="text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors"
                  >
                    Abertura de Sinistro
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* Contato */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">
              Contato
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <FaWhatsapp className="text-emerald-600 dark:text-emerald-500" />
                <a
                  href="https://api.whatsapp.com/send?phone=551145875550&text=Olá%20Seja%20bem-vindo(a)%20à%20Piva%20Seguros"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  11 4587-5550
                </a>
              </li>
              <li className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                <FaMapMarkerAlt className="mt-0.5 text-emerald-600 dark:text-emerald-500" />
                <span>
                  Rua Itália, 111 - Jd. Bonfiglioli
                  <br /> Jundiaí/SP
                </span>
              </li>
              <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <FaEnvelope className="text-emerald-600 dark:text-emerald-500" />
                <a
                  href="mailto:solucoes@pivaseguros.com.br"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  solucoes@pivaseguros.com.br
                </a>
              </li>
            </ul>

            {/* Social */}
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://web.facebook.com/pivaseguros/?_rdc=1&_rdr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200/80 transition hover:text-emerald-600 hover:ring-emerald-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:text-emerald-400"
              >
                <FaFacebookF className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/pivacorretoradeseguros/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200/80 transition hover:text-emerald-600 hover:ring-emerald-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:text-emerald-400"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-zinc-200/60 pt-4 dark:border-zinc-800/60">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              © {currentYear} PMJ & PIVA — Todos os direitos
              reservados.
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Desenvolvido por{" "}
              <a
                href="https://crzweb.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                CRZ
              </a>{" "}
              e{" "}
              <a
                href="https://emiliobiasi.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Emílio Biasi
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
