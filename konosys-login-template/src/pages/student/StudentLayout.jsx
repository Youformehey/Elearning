import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import SidebarStudent from "./SidebarStudent";
import HomeNavbarStudent from "../../Components/HomeNavbarStudent";
import MobileNavbar from "../../Components/MobileNavbar";
import { ThemeContext } from "../../context/ThemeContext";

export default function StudentLayout() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`flex min-h-screen max-h-screen h-screen ${darkMode ? 'bg-gray-900' : 'bg-[#f5f7fb]'} text-gray-800 overflow-hidden`}>
      {/* Sidebar - Desktop only */}
      <div className="hidden md:block">
      <SidebarStudent />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col h-full max-h-screen overflow-hidden">
        {/* Navbar du haut - Desktop only */}
        <div className="hidden sm:block">
        <HomeNavbarStudent userName="Élève" />
        </div>

        {/* Mobile Navbar */}
        <div className="sm:hidden">
          <MobileNavbar userName="Élève" />
        </div>

        {/* Zone de contenu */}
        <main className={`flex-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} overflow-y-auto max-h-[calc(100vh-64px)] sm:max-h-[calc(100vh-64px)]`}>
          <div className="h-full w-full p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
