import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import NextAuthProvider from "@/components/providers/session-provider";
import { ToastContainer } from "react-toastify";
import ReactQueryProvider from "@/components/providers/react-query-provider";
import { SocketContextProvider } from "@/components/providers/socket";
import ProgressBarClient from "@/components/providers/progress-bar";

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
    <html lang="en" suppressHydrationWarning>
      <body className={` antialiased`}>
        <ProgressBarClient>
          <NextAuthProvider>
            <SocketContextProvider>
              <ReactQueryProvider>
                <ThemeProvider
                  attribute="class"
                  // defaultTheme="light"
                  defaultTheme="dark"
                  enableSystem
                  disableTransitionOnChange
                >
                  <ToastContainer />
                  {children}
                </ThemeProvider>
              </ReactQueryProvider>
            </SocketContextProvider>

          </NextAuthProvider>
        </ProgressBarClient>

      </body>
    </html>
  );
}
