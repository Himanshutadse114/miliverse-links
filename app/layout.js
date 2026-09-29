import './globals.css';
import { Baloo_2, Quicksand } from 'next/font/google';

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-baloo',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
});

export const metadata = {
  title: 'Mili 💗 Meesho Finds',
  description: 'Budget Meesho fashion finds picked with love by Mili',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${baloo.variable} ${quicksand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
