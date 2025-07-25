import React from "react";
import { Outlet } from "react-router-dom";
import SidebarStudent from "./SidebarStudent";
import HomeNavbarStudent from "../../Components/HomeNavbarStudent";

export default function StudentLayout() {
  return (
    <div className="flex min-h-screen bg-blue-50 text-blue-900 font-semibold" style={{ fontFamily: "'Quicksand', sans-serif" }}>
      {/* Sidebar */}
      <SidebarStudent />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar du haut */}
        <HomeNavbarStudent userName="Élève" />

        {/* Zone de contenu */}
        <main className="flex-1 px-6 py-8 lg:px-12 bg-white shadow-inner rounded-t-3xl overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
