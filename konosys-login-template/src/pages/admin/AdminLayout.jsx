import React from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "../../Components/SidebarAdmin";
import AdminNavbar from "../../Components/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <SidebarAdmin />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-80 overflow-auto">
        {/* Navbar */}
        <AdminNavbar />
        
        {/* Content */}
        <div className="min-h-screen p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
} 