import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // 添加这行优化字体加载
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" className="h-full">
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#0D1117]`}>
        <div className="flex-1 flex flex-col overflow-auto">
          {children}
        </div>
      </body>
    </html>
  )
}