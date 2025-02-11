import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './AuthContext'
import Footer from './home/footer/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zenska vizija',
  description:
    'Zenska vizija je nevladina organizacija koja se bori protiv femicida i pruza podrsku zenama koje su zrtve nasilja',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className} id="__next">
        <AuthProvider>{children}</AuthProvider>
        <Footer />
      </body>
    </html>
  )
}
