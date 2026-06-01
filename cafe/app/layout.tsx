import "./globals.css";
import { ReactNode } from "react";
import { CartProvider } from "@/context/cart.context";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body><CartProvider>{children}</CartProvider></body>
    </html>
  );
}