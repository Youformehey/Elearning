import React from "react";
import { Outlet } from "react-router-dom";
import SidebarProfesseur from "./SidebarProfesseur";
import HomeNavbar from "../../Components/HomeNavbar";

export default function ProfesseurLayout() {
  return (
    <div className="flex min-h-screen max-h-screen h-screen bg-[#f5f7fb] text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <SidebarProfesseur />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col h-full max-h-screen overflow-hidden">
        {/* Navbar du haut */}
        <HomeNavbar userName="Professeur" />

        {/* Zone de contenu */}
        <main className="flex-1 bg-gray-100 overflow-y-auto max-h-[calc(100vh-64px)]">
          <div className="h-full w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
