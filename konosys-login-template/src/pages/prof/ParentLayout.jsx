import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { FileText, Calendar, ClipboardList, Receipt, Menu, X } from "lucide-react";

export default function ParentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 font-inter">
      {/* Mobile Top Bar */}
      <div className="flex items-center justify-between md:hidden bg-blue-800 text-white px-4 py-3 shadow">
        <h2 className="text-lg font-semibold">Espace Parent</h2>
        <button onClick={toggleSidebar}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-blue-800 text-white w-64 p-5 space-y-4 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:block fixed h-full z-50 top-0 left-0`}
      >
        <h2 className="text-xl font-bold mb-6 hidden md:block">Espace Parent</h2>
        <nav className="space-y-2">
          <NavItem to="/parent/notes" icon={<FileText size={20} />}>Notes</NavItem>
          <NavItem to="/parent/absences" icon={<Calendar size={20} />}>Absences</NavItem>
          <NavItem to="/parent/factures" icon={<Receipt size={20} />}>Factures</NavItem>
          <NavItem to="/parent/demandes" icon={<ClipboardList size={20} />}>Demandes</NavItem>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-64 transition-all duration-300 ease-in-out">
        <div className="flex justify-end mb-6">
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all">
            Se déconnecter
          </button>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, children }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
        ${isActive ? "bg-blue-700 font-semibold" : "hover:bg-blue-700"} `}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
