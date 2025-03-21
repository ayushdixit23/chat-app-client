import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import NextAuthProvider from "@/components/providers/session-provider";
import { ToastContainer } from "react-toastify";
import ReactQueryProvider from "@/components/providers/react-query-provider";
import { SocketContextProvider } from "@/components/providers/socket";
import NextTopLoader from 'nextjs-toploader';

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
        <NextTopLoader showSpinner={false}/>
        <NextAuthProvider>
          <SocketContextProvider>
            <ReactQueryProvider>
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
            </ReactQueryProvider>
          </SocketContextProvider>

        </NextAuthProvider>


      </body>
    </html>
  );
}
