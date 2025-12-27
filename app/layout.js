import MobileFooter from "@/components/organism/MobileFooter";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DashboardContextProvider } from "../app/context/DashboardContext";
import "../app/globals.css";
import Foter from "../components/molecules/Foter";
import ThemeWrapper from "../components/molecules/ThemeWrapper";
import TopLoaderProvider from "../components/molecules/TopLoaderProvider";
import { CartProvider } from "../context/CartProvider";
import AuthProvider from "../hooks/useAuth";
import GlobalVariableProvider from "../hooks/useGlobalVariabels";
import CatProvider from "@/hooks/useCategory";
import FakePurchaseNotifications from "@/components/atom/FakePurchaseNotifications";
import Script from "next/script";
import ClientFacebookWrapper from "@/components/facebook-pixle/ClientFacebookWrapper";
import { SessionProvider } from "next-auth/react";
import { Providers } from "./providers";
import AdvancedWhatsAppButton from "@/components/atom/AdvancedWhatsAppButton";
import MobileHeader from "@/components/molecules/MobileHeader";
import DesktopHeader from "@/components/organism/DesktopHeader";
import VoiceWidget, { PageVoiceGuide } from "./features/voice-ai";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: {
        default:
            "Buy Premium Martial Arts Equipment & Taekwondo Uniforms Pakistan ",
        template: "%s | Champion Choice",
    },
    description:
        "Discover premium quality sports uniforms and martial arts equipment designed for performance, durability, and style. Whether you're a beginner or a professional athlete, we bring you a wide range of gear that empowers your training and boosts your confidence.",
    keywords:
        "martial arts equipment, taekwondo uniforms, sports gear, training equipment",
    authors: [{ name: "Champion Choice" }],
    creator: "Champion Choice",
    publisher: "Champion Choice",
    metadataBase: new URL("https://www.champzones.com/"), // Replace with your actual domain
    openGraph: {
        title: "Buy Premium Martial Arts Equipment & Taekwondo Uniforms Pakistan",
        description:
            "Discover premium quality sports uniforms and martial arts equipment designed for performance, durability, and style.",
        url: "https://www.champzones.com/", // Replace with your actual domain
        siteName: "Champion Choice",
        images: [
            {
                url: "https://res.cloudinary.com/do58gkhav/image/upload/v1755692437/IMG-20250820-WA0033_auqytq.jpg", // Add your OG image
                width: 800,
                height: 800,
                alt: "Champion Choice - Premium Martial Arts Equipment",
            },
            {
                url: "https://res.cloudinary.com/do58gkhav/image/upload/v1755692435/IMG-20250820-WA0028_ollelz.jpg", // Add your OG image
                width: 1200,
                height: 630,
                alt: "Champion Choice - Premium Martial Arts Equipment",
            },
            {
                url: "https://res.cloudinary.com/do58gkhav/image/upload/v1755692436/IMG-20250820-WA0024_aixy5p.jpg", // Add your OG image
                width: 1200,
                height: 630,
                alt: "Champion Choice - Premium Martial Arts Equipment",
            },
            {
                url: "https://res.cloudinary.com/do58gkhav/image/upload/v1755692437/IMG-20250820-WA0031_pyn2wj.jpg", // Add your OG image
                width: 1200,
                height: 630,
                alt: "Champion Choice - Premium Martial Arts Equipment",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Buy Premium Martial Arts Equipment & Taekwondo Uniforms Pakistan",
        description:
            "Discover premium quality sports uniforms and martial arts equipment.",
        images: [
            "https://res.cloudinary.com/do58gkhav/image/upload/v1755692437/IMG-20250820-WA0033_auqytq.jpg",
            "https://res.cloudinary.com/do58gkhav/image/upload/v1755692437/IMG-20250820-WA0031_pyn2wj.jpg",
            "https://res.cloudinary.com/do58gkhav/image/upload/v1755692435/IMG-20250820-WA0028_ollelz.jpg",
        ], // Add your Twitter image
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
    icons: {
        icon: "/images/championchoice-logo.png",
        shortcut: "/images/championchoice-logo.png",
        apple: "/images/championchoice-logo.png",
    },
    verification: {
        google: "qCNmybA9NO4SfownCTp8dkYsHTx0XOvdRk0Kr7PmOBs",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta
                    name="facebook-domain-verification"
                    content="nacpytod5s5ffuq77lmy9ws820jyiz"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta
                    name="google-site-verification"
                    content="VJejj7reIcd0mDSKEBtoji8V3TPr6yJOxDFRW8HAqRg"
                />

                {/* Google Analytics */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-38MD4ZPE2T"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-38MD4ZPE2T');
          `}
                </Script>
            </head>
            <body className={inter.className}>
                <Providers>
                    <AuthProvider>
                        <CatProvider>
                            <GlobalVariableProvider>
                                <CartProvider>
                                    <TopLoaderProvider />
                                    <MobileHeader />
                                    <DesktopHeader />
                                    <ToastContainer
                                        position="top-center"
                                        autoClose={4000}
                                        hideProgressBar={false}
                                        newestOnTop={false}
                                        closeOnClick={true}
                                        rtl={false}
                                        pauseOnFocusLoss
                                        draggable
                                        pauseOnHover
                                        theme="light"
                                    />
                                    <FakePurchaseNotifications />
                                    <SpeedInsights />
                                    <Analytics />
                                    <ClientFacebookWrapper />
                                    {children}
                                    {/* <AdvancedWhatsAppButton /> */}
                                    <VoiceWidget />
                                    <PageVoiceGuide />
                                    <Foter />
                                    <MobileFooter />
                                </CartProvider>
                            </GlobalVariableProvider>
                        </CatProvider>
                    </AuthProvider>
                </Providers>
            </body>
        </html>
    );
}