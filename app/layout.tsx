import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/firebase-auth-context";
import { MainLayout } from "@/components/layout/main-layout";
import { QueryProviders } from "@/components/providers/query-providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TorchKB AI - Your AI Powered Knowledge Base",
  description:
    "Save YouTube summaries, LinkedIn posts & web pages to your knowledge base & search anytime effortlessly.",
  keywords: [
    "YouTube summaries",
    "LinkedIn posts",
    "web pages",
    "knowledge base",
    "search anytime",
  ],
  authors: [{ name: "TorchKB AI" }],
  creator: "TorchKB AI",
  publisher: "TorchKB AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_WEBSITE_URL ||
      "https://knugget-youtube-client.vercel.app"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TorchKB AI - Your AI Powered Knowledge Base",
    description:
      "Save YouTube summaries, LinkedIn posts & web pages to your knowledge base & search anytime effortlessly.",
    url: "/",
    siteName: "TorchKB AI",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "TorchKB AI - Your AI Powered Knowledge Base",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TorchKB AI - Your AI Powered Knowledge Base",
    description:
      "Save YouTube summaries, LinkedIn posts & web pages to your knowledge base & search anytime effortlessly.",
    images: ["/logo.png"],
    creator: "@TorchKBai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="icon" href="/logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />

        {/* Theme Color */}
        <meta name="theme-color" content="#f97316" />
        <meta name="msapplication-TileColor" content="#f97316" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS Prefetch */}
        <link
          rel="dns-prefetch"
          href="https://knugget-youtube-backend.onrender.com"
        />

        {/* Chrome Extension Connection - Extension ID is now auto-discovered */}
      </head>
      <body
        className={`${inter.className} dark bg-gray-950 text-white`}
        suppressHydrationWarning={true}
      >
        <QueryProviders>
          <AuthProvider>
            <MainLayout>{children}</MainLayout>
          </AuthProvider>
        </QueryProviders>

        {/* Development helpers */}
        {process.env.NODE_ENV === "development" && <DevTools />}
      </body>
    </html>
  );
}

// Development tools (only shown in development)
function DevTools() {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white text-xs p-2 rounded font-mono">
      DEV: {process.env.NODE_ENV}
    </div>
  );
}
