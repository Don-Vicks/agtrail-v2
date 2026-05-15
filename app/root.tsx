import * as React from "react";
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

/** Wraps all route UI so auth / theme / query work during SSR and for every root child. */
function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
      <AuthProvider>
        <OfflineProvider>
          <QueryClientProvider client={queryClient}>
            <OfflineBanner />
            {children}
            <Toaster position="top-right" richColors />
          </QueryClientProvider>
        </OfflineProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* Dojah Widget Script */}
        <script src="https://widget.dojah.io/widget.js" defer></script>
      </head>
      <body className="font-sans">
        <RootProviders>{children}</RootProviders>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigation = useNavigation();
  const [showProgressBar, setShowProgressBar] = React.useState(false);
  const [showFullLoader, setShowFullLoader] = React.useState(false);

  const isNavigating = navigation.state !== "idle";
  const isSubmitting = navigation.state === "submitting";

  React.useEffect(() => {
    let progressTimeout: ReturnType<typeof setTimeout>;
    let fullLoaderTimeout: ReturnType<typeof setTimeout>;

    if (isNavigating) {
      // Show progress bar quickly (100ms)
      progressTimeout = setTimeout(() => setShowProgressBar(true), 100);

      // Only show full screen loader if it takes a long time (1000ms) or if we are submitting a form
      if (isSubmitting) {
        setShowFullLoader(true);
      } else {
        fullLoaderTimeout = setTimeout(() => setShowFullLoader(true), 1000);
      }
    } else {
      setShowProgressBar(false);
      setShowFullLoader(false);
    }

    return () => {
      clearTimeout(progressTimeout);
      clearTimeout(fullLoaderTimeout);
    };
  }, [isNavigating, isSubmitting]);

  return (
    <>
      {/* Top Progress Bar - less intrusive */}
      {showProgressBar && (
        <div className="fixed top-0 left-0 right-0 z-[10000] h-1 overflow-hidden pointer-events-none">
          <div className="h-full bg-[#10b981] animate-progress-bar shadow-[0_0_10px_#10b981]" />
        </div>
      )}

      {/* Full Screen Loader - only for very slow navigations or submissions */}
      {showFullLoader && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/40 backdrop-blur-[2px] transition-all animate-in fade-in duration-300">
          <div className="bg-white px-6 py-4 rounded-md shadow-2xl border border-gray-100 flex items-center gap-4 animate-in zoom-in duration-300">
            <Loader2 className="size-6 text-[#10b981] animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">
              {navigation.state === "submitting" ? "Processing..." : "Loading..."}
            </span>
          </div>
        </div>
      )}
      <Outlet />
    </>
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
