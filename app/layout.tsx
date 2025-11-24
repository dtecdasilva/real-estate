import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brico",
  description: "The best real estate website in Cameroon",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

          {/* Google Translate Loader */}
          <Script
            src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
            strategy="afterInteractive"
          />

          {/* Google Translate Init */}
          <Script id="google-translate-init" strategy="afterInteractive">
            {`
              function googleTranslateElementInit() {
                new google.translate.TranslateElement(
                  {
                    pageLanguage: 'en',
                    includedLanguages: 'en,fr',
                    autoDisplay: false
                  },
                  'google_translate_element'
                );
              }
            `}
          </Script>

          {/* Auto Translate for French Users */}
          <Script id="auto-translate-fr" strategy="afterInteractive">
            {`
              document.addEventListener("DOMContentLoaded", function () {
                const userLang = navigator.language || navigator.userLanguage;

                if (userLang.startsWith("fr")) {
                  const interval = setInterval(() => {
                    const select = document.querySelector(".goog-te-combo");

                    if (select) {
                      select.value = "fr";
                      select.dispatchEvent(new Event("change"));
                      clearInterval(interval);
                    }
                  }, 500);
                }
              });
            `}
          </Script>

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
