import { Outfit } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import { Providers } from "@/components/client-providers";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Surprez - Admin Dashboard",
  description: "Admin dashboard for Surprez e-commerce platform",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <Providers>{children}</Providers>
          </SidebarProvider>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar
            pauseOnFocusLoss={false}
            pauseOnHover
            draggable
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
