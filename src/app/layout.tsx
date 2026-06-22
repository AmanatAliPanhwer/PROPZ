import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { getCurrentUser } from "@/lib/queries";
import { Web3Provider } from "@/components/providers/Web3Provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PROPZ - Thank Platform",
  description: "A decentralized appreciation platform for real workers.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Web3Provider>
          <Header
            initialUser={currentUser ? { name: currentUser.name, picture: currentUser.profilePicture, role: currentUser.role } : null}
          />
          <main className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full">
            {children}
          </main>
        </Web3Provider>
      </body>
    </html>
  );
}
