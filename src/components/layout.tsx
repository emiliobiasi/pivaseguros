import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useBoletosContext } from '../contexts/BoletosContext'
import { useEffect } from 'react'

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { allBoletosDownloaded, hasBoletosToDownload, isProcessFinalized } = useBoletosContext()

  useEffect(() => {
    if (pathname === '/historico' && hasBoletosToDownload && !isProcessFinalized) {
      router.push('/')
    }
  }, [pathname, hasBoletosToDownload, isProcessFinalized, router])

  const canAccessHistory = !hasBoletosToDownload || isProcessFinalized

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-xl">
        <div className="p-6 border-b flex items-center justify-between">
          <h1 className="text-2xl font-bold">Portal de Boletos</h1>
          <div className="flex gap-3">
            <Button
              variant={pathname === '/' ? 'default' : 'outline'}
              className={pathname === '/' ? 'bg-gradient-to-r from-green-700 to-green-800 text-white hover:from-green-800 hover:to-green-900' : ''}
              asChild
            >
              <Link href="/">Boletos Atuais</Link>
            </Button>
            <Button
              variant={pathname === '/historico' ? 'default' : 'outline'}
              className={`${pathname === '/historico' ? 'bg-gradient-to-r from-green-700 to-green-800 text-white hover:from-green-800 hover:to-green-900' : ''} 
                ${!canAccessHistory ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!canAccessHistory}
              onClick={(e) => {
                if (!canAccessHistory) {
                  e.preventDefault()
                }
              }}
              asChild
            >
              <Link href={canAccessHistory ? "/historico" : "#"}>Histórico</Link>
            </Button>
          </div>
        </div>
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}

