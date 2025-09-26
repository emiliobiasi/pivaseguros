import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { ArrowUp } from "lucide-react"
import { SeguroFiancaEmpresarialMais2AnosForms } from "@/components/SeguroFiancaEmpresarialMais2AnosForms/seguro-fianca-empresarial-mais-2-anos-forms"

const SeguroFiancaEmpresarialMais2AnosScreen = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const location = useLocation()
  const [showTop, setShowTop] = useState(false)
  const [highlight, setHighlight] = useState(false)

  useEffect(() => {
    const shouldScroll =
      location.hash === "#form" || (location.state as any)?.scrollTo === "form"
    if (shouldScroll) {
      let attempts = 0
      const tryScroll = () => {
        const el = ref.current
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
          setHighlight(true)
          setTimeout(() => setHighlight(false), 800)
        } else if (attempts < 5) {
          attempts += 1
          setTimeout(tryScroll, 60)
        }
      }
      setTimeout(tryScroll, 0)
    }
  }, [location])

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      id="form"
      ref={ref}
      className={
        "scroll-mt-24 " +
        (highlight
          ? "ring-2 ring-emerald-500/70 bg-emerald-50/60 transition-colors duration-700"
          : "")
      }
    >
      <SeguroFiancaEmpresarialMais2AnosForms />
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-1 rounded-full bg-green-600 px-3 py-2 text-sm font-medium text-white shadow-md transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="h-4 w-4" /> Topo
        </button>
      )}
    </div>
  )
}

export default SeguroFiancaEmpresarialMais2AnosScreen
