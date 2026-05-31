import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import CartSync from "@/components/cart/CartSync";
import FlyProvider from "@/components/providers/FlyProvider";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "MyRestaurant",
  description: "Demo Restaurant App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${poppins.variable} antialiased min-h-screen flex flex-col`}>
          <FlyProvider>
            <CartSync />
            <main className="flex-1">
              {children}
              <Toaster />
            </main>
          </FlyProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}