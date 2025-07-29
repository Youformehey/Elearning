import React from "react";
import { Outlet } from "react-router-dom";
import SidebarStudent from "./SidebarStudent";
import HomeNavbarStudent from "../../Components/HomeNavbarStudent";

const StudentLayout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      {/* Sidebar */}
      <SidebarStudent />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <HomeNavbarStudent />
        
        {/* Main Content Area */}
        <main className="flex-1 pt-20 md:pt-24 lg:pt-28 px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
