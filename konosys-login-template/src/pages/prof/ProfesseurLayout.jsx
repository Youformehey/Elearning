import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import SidebarProfesseur from "./SidebarProfesseur";
import HomeNavbar from "../../Components/HomeNavbar";
import MobileNavbar from "../../Components/MobileNavbar";
import { ThemeContext } from "../../context/ThemeContext";

export default function ProfesseurLayout() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-[#f5f7fb]'} text-gray-800`}>
      {/* Sidebar - Desktop only */}
      <div className="hidden md:block">
        <SidebarProfesseur />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Navbar du haut - Desktop only */}
        <div className="hidden md:block">
          <HomeNavbar userName="Professeur" />
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden">
          <MobileNavbar userName="Professeur" />
        </div>

        {/* Zone de contenu avec padding-top pour la navbar fixe */}
        <main className={`flex-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} overflow-y-auto pt-16 sm:pt-20 md:pt-24`}>
          <div className="h-full w-full p-4 sm:p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
