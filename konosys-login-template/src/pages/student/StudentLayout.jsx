import React from "react";
import { Outlet } from "react-router-dom";
import SidebarStudent from "./SidebarStudent";
import HomeNavbarStudent from "../../Components/HomeNavbarStudent";

const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar (fixe à gauche dans ton composant) */}
      <SidebarStudent />

      {/* Main Content (décalé de la largeur de la sidebar en ≥ md) */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-72">
        {/* Navbar (fixe/sticky dans ton composant) */}
        <HomeNavbarStudent />

        {/* Main Content Area (padding-top pour laisser la place à la navbar) */}
        <main className="flex-1 pt-[7rem]">
          <div className="w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;