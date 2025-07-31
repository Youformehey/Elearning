import React from "react";
import { Outlet } from "react-router-dom";
import SidebarStudent from "./SidebarStudent";
import HomeNavbarStudent from "../../Components/HomeNavbarStudent";

const StudentLayout = () => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <SidebarStudent />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <HomeNavbarStudent />
        
        {/* Main Content Area */}
        <main className="flex-1 pt-40 px-6 sm:px-8 lg:px-10 pb-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
