import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: " brahim boughezroun // Interactive Resume",
  description:
    "A futuristic interactive resume for an AI systems engineer, presented as a cyber-terminal mission.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
