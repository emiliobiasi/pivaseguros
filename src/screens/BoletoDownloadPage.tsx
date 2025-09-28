import { BoletoCard } from "@/components/boleto-card"
import BoletosDownload from "@/components/boletos-download"
import { HamburguerMenu } from "@/components/HambuguerMenu/hamburguer-menu"

export default function BoletoDownloadPage() {
  return (
    <>
      <div className="px-4 pt-4">
        <div className="container mx-auto flex justify-start">
          <HamburguerMenu />
        </div>
      </div>
      <BoletoCard>
        <BoletosDownload />
      </BoletoCard>
    </>
  )
}
