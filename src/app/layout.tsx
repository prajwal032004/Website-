import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import PageLoader from '@/components/PageLoader'

export const metadata: Metadata = {
  title: 'by RAVEN - International Music Agency',
  description:
    'by RAVEN is an international music agency crafting bold, cinematic, and award-winning scores.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <PageLoader />
        <Header />
        {children}
        <Navbar />
      </body>
    </html>
  )
}