import { QueryClientProvider } from "@tanstack/react-query";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "react-router";

import { queryClient } from "~/lib/query-client";
import { AuthProvider } from "~/context/auth-context";
import { OfflineProvider } from "~/context/offline-context";
import { OfflineBanner } from "~/components/offline/offline-banner";
import { ThemeProvider } from "next-themes";
import { Toaster } from "~/components/ui/sonner";
import { Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* Dojah Widget Script */}
        <script src="https://widget.dojah.io/widget.js"></script>
      </head>
      <body className="font-sans">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
      <AuthProvider>
        <OfflineProvider>
          <QueryClientProvider client={queryClient}>
            {isLoading && (
              <div className="fixed inset-0 z-[9999] pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
                  <div className="h-full bg-[#10b981] animate-progress-bar shadow-[0_0_10px_#10b981]" />
                </div>
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-auto transition-all">
                  <div className="bg-white px-6 py-4 rounded-md shadow-2xl border border-gray-100 flex items-center gap-4 animate-in fade-in zoom-in duration-300">
                    <Loader2 className="size-6 text-[#10b981] animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">Loading...</span>
                  </div>
                </div>
              </div>
            )}
            <OfflineBanner />
            <Outlet />
            <Toaster position="top-right" richColors />
          </QueryClientProvider>
        </OfflineProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
