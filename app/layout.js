import './globals.css'
import Header from '@/components/header'

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body
        sx={{ margin: 0 }}
        // className={inter.className}
      >
        <Header />
        {children}
      </body>
    </html>
  )
}
