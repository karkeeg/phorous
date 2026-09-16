import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phorous — Heavyweight No. 01",
  description:
    "Three hundred grams of long-staple cotton, knitted slow on vintage loopwheel frames and garment-dyed in small lots. A t-shirt built like outerwear.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
