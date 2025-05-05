"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./globals.css";

import Header from "@/components/header";

import ReduxProvider from "../../redux/reduxProvider";
import { ScrollProvider } from "../../context/scrollContext";
import ScrollToTopButton from "./components/scrollToTop";
import { usePathname } from "next/navigation";

const hideFooterRoutes = ["/login"];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const shouldShowFooter = !hideFooterRoutes.includes(pathname);
  return (
    <html lang="en">
      <head>
        <title>SMS Admin Dashboard</title>
      </head>
      <body className="bg-gray-100">
        <ReduxProvider>
          <ScrollProvider>
            <div className="flex flex-row w-full h-screen bg-gray-300">
              {shouldShowFooter && (
                <div className="w-[20%] h-full">
                  <Header />
                </div>
              )}
              {shouldShowFooter ? (
                <div className="w-[80%] h-full overflow-y-auto">{children}</div>
              ) : (
                <div>{children}</div>
              )}
            </div>
            <ScrollToTopButton />
          </ScrollProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
