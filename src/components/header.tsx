import { Building2 } from 'lucide-react'

export function Header() {
  return (
    <div className="relative overflow-hidden border-b border-green-100 bg-white">
      <div className="ps-20 container flex h-24 items-center">
        <div className="mr-4 hidden md:flex">
          <Building2 className="h-6 w-6 text-green-600" />
        </div>
        <div className=" flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-green-800 md:text-3xl">
            Upload de Boletos
          </h1>
          {/* <p className="text-green-600 text-sm">
            Sistema de gerenciamento de boletos para seguradoras
          </p> */}
        </div>
      </div>
    </div>
  )
}

