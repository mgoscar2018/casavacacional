
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CasaVacacional',
  description: 'CasaVacacional - Encuentra tu escapada perfecta.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <div id="portal-root"></div> {/* For potential future Portals if needed by shadcn or other libraries */}
      </body>
    </html>
  );
}

    