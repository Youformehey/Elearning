import React from "react";
import { Outlet, Link } from "react-router-dom";
import { FileText, Calendar, ClipboardList, Receipt } from "lucide-react";

export default function ParentLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-blue-800 text-white p-5 space-y-4">
        <h2 className="text-xl font-bold mb-6">Espace Parent</h2>
        <NavItem to="/parent/notes" icon={<FileText size={20} />}>Notes</NavItem>
        <NavItem to="/parent/absences" icon={<Calendar size={20} />}>Absences</NavItem>
        <NavItem to="/parent/factures" icon={<Receipt size={20} />}>Factures</NavItem>
        <NavItem to="/parent/demandes" icon={<ClipboardList size={20} />}>Demandes</NavItem>
      </aside>

      <div className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
            Se déconnecter
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

function NavItem({ to, icon, children }) {
  return (
    <Link to={to} className="flex items-center gap-3 text-white hover:bg-blue-700 px-4 py-3 rounded-lg transition">
      {icon}
      <span>{children}</span>
    </Link>
  );
}
