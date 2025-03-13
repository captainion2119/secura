import '../styles/globals.css';
import { Manrope } from 'next/font/google';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata = {
  title: 'Secura',
  description: 'Secura Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={manrope.className}>{children}</body>
    </html>
  );
}
