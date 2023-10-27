import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TV Bland',
  description: 'View your favorites movie',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">   
      <body className={inter.className}> <div className='px-12 pt-6'>
      <Link href={'/'}>
        <h1 className='sm:text-4xl text-2xl font-bold'>TV Bland</h1>
        </Link>
      </div>{children}</body>
    </html>
  )
}
