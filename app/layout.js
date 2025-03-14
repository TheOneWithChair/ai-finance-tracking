import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "SmartBudget AI",
  description: "AI Financial advisor",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body className={outfit.className}>
          <Toaster />
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
