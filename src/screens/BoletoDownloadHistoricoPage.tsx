import { BoletoCard } from "@/components/boleto-card"
import BoletosHistorico from "@/components/boletos-historico"
import { HamburguerMenu } from "@/components/HambuguerMenu/hamburguer-menu"

export default function BoletoDownloadHistoricoPage() {
  return (
    <>
      <div className="px-4 pt-4">
        <div className="container mx-auto flex justify-start">
          <HamburguerMenu />
        </div>
      </div>
      <BoletoCard>
        <BoletosHistorico />
      </BoletoCard>
    </>
  )
}
