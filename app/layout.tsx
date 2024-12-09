import "./globals.css"

export const metadata = {
  title: "Internal App - American Express",
  description: "American Express Internal Application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}

