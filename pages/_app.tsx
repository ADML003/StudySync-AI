import type { AppProps } from "next/app";
import "@/styles/globals.css";
import "@/styles/layout.css";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Component {...pageProps} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: "dark:bg-gray-800 dark:text-white dark:border-gray-700",
            style: {
              background: "white",
              color: "black",
              border: "1px solid #e5e7eb",
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
