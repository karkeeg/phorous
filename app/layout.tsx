import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "./cart-context";
import CartBadge from "./CartBadge";
import BagDrawer from "./BagDrawer";

export const metadata: Metadata = {
  title: "Phorous — Heavyweight No. 01",
  description:
    "Three hundred grams of long-staple cotton, knitted slow on vintage loopwheel frames and garment-dyed in small lots. A t-shirt built like outerwear.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <CartBadge />
          <BagDrawer />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
