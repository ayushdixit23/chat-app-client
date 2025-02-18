import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import NextAuthProvider from "@/components/providers/session-provider";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Lets Chat",
  description: "A Simple Chatting Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={` antialiased`}>
        <NextAuthProvider >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            // defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ToastContainer />
            {children}
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
