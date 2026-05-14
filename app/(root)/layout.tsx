import type React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";


export default function RootPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <Header />
        <main className="min-h-screen bg-background">{children}</main>
        <Footer />
    </>
  );
}
