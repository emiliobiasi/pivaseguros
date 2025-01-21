import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { BoletosProvider } from '../contexts/BoletosContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portal de Boletos',
  description: 'Sistema de gerenciamento de boletos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <BoletosProvider>
          {children}
        </BoletosProvider>
      </body>
    </html>
  )
}

