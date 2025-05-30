import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopBar from "../../components/TopBar";
import SideBar from "../../components/SideBar";
import SportsBar from "../../components/SportsBar";
import HomeBar from "../../components/HomeBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Welcome to 99exch",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col`}
      >
        <TopBar />
        <div>
          <HomeBar />
        </div>

        {/* for desktop */}
        <div className="hidden md:flex md:flex-1">
          <SideBar />
          <div className="flex-6 w-1/2 bg-gray-200 h-full">
            {children}
          </div>
        </div>

        {/* for mobile */}
         <div className="flex md:hidden w-full">
          <div className="flex-6 w-[100%] bg-gray-200 h-full">
            {children}
          </div>
        </div>
  
      </body>
    </html>
  );
}
