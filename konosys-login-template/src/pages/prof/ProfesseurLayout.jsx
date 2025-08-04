import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import SidebarProfesseur from "./SidebarProfesseur";
import HomeNavbar from "../../Components/HomeNavbar";
import MobileNavbar from "../../Components/MobileNavbar";
import { ThemeContext } from "../../context/ThemeContext";

export default function ProfesseurLayout() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen w-full flex bg-[#f5f7fb] dark:bg-gray-900 text-gray-800 dark:text-white`}>
      {/* Sidebar (Desktop) */}
      <div className="hidden lg:flex fixed top-0 left-0 h-screen z-40">
        <SidebarProfesseur />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full lg:pl-[320px] min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 w-full bg-transparent">
          <div className="hidden md:block">
            <HomeNavbar userName="Professeur" />
          </div>
          <div className="md:hidden">
            <MobileNavbar userName="Professeur" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 w-full min-h-[calc(100vh-90px)] flex items-start justify-center bg-[#f5f7fb] dark:bg-gray-900 pt-[90px]">
          <div className="w-full px-0 py-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
