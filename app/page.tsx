import "./globals.css";

export const metadata = {
  title: "StrongPack – Pack Fitness",
  description: "Whey + Creatina + Omega-3 + Multivitamínico",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
