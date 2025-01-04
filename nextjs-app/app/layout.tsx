import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Spin } from "antd";
import { Suspense } from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import LambdaHealthCheck from "@/components/lambda-health-check";
import localFont from "next/font/local";
import Navbar from "@/components/navbar";
import type { Metadata } from "next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AntdRegistry>
            <Suspense fallback={<Spin />}>
              <LambdaHealthCheck />
            </Suspense>
            <Suspense fallback={<Spin />}>
              <Navbar />
            </Suspense>
            <main className={"p-6"}>{children}</main>
          </AntdRegistry>
        </body>
      </UserProvider>
    </html>
  );
}
