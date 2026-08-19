import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthInitializer } from "@/components/auth-initializer";
import { VoiceCallProvider } from "@/components/providers/voice-call-provider";
import { IncomingCallModal } from "@/components/emergency/IncomingCallModal";
import EmergencyNotificationListener from "@/components/emergency/EmergencyNotificationListener";
import ComplaintNotificationListener from "@/components/complaints/ComplaintNotificationListener";
import ChatNotificationListener from "@/components/chat/ChatNotificationListener";
import ProfileUpdateNotificationListener from "@/components/profile/ProfileUpdateNotificationListener";
import VisitorNotificationListener from "@/components/visitors/VisitorNotificationListener";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Socity | Modern Community Living",
  description: "Complete society management solution for modern communities",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthInitializer />
            <VoiceCallProvider>
              <EmergencyNotificationListener />
              <ComplaintNotificationListener />
              <ChatNotificationListener />
              <ProfileUpdateNotificationListener />
              <VisitorNotificationListener />
              <IncomingCallModal />
              {children}
            </VoiceCallProvider>
            <Toaster position="top-right" />
            <SonnerToaster position="top-right" richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
