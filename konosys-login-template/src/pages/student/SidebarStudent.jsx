import React from "react";
import { NavLink } from "react-router-dom";
import {
  User,
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  MessageSquare,
  Bot,
} from "lucide-react";

const links = [
  { to: "/student", icon: BookOpen, label: "Accueil" },
  { to: "/student/cours", icon: FileText, label: "Mes cours" },
  { to: "/student/planning", icon: Calendar, label: "Planning" },
  { to: "/student/rappels", icon: ClipboardList, label: "Rappels" },
  { to: "/student/absences", icon: Calendar, label: "Absences" },
  { to: "/student/demandes", icon: MessageSquare, label: "Demandes" },
  { to: "/student/formations", icon: BookOpen, label: "Formations" },
  { to: "/student/assistant", icon: Bot, label: "Assistant" },
  { to: "/student/profil", icon: User, label: "Profil" },
];

export default function SidebarStudent() {
  return (
    <aside
      className="
        fixed top-0 left-0 h-full w-64
        bg-white shadow-lg
        text-gray-800 flex flex-col justify-between
        py-8 px-6
        font-sans select-none
      "
      style={{ fontFamily: "'Quicksand', sans-serif" }}
    >
      {/* Espace en haut avec avatar + statut */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center shadow-md">
          <User size={26} className="text-white" strokeWidth={2} />
        </div>
        <div>
          <p className="text-lg font-semibold text-cyan-600">Élève</p>
          <p className="text-sm text-gray-500">Connecté</p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-5">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-4 px-5 py-3 rounded-md text-base font-semibold transition
              ${
                isActive
                  ? "bg-cyan-500 text-white shadow-lg"
                  : "hover:bg-cyan-100 hover:text-cyan-600 text-gray-700"
              }
              `
            }
            aria-label={label}
            title={label}
            tabIndex={0}
          >
            <Icon
              size={22}
              className="transition-colors duration-300 group-hover:text-cyan-600"
              aria-hidden="true"
              strokeWidth={2}
              style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.1))" }}
            />
            <span className="select-none">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto w-full pt-8 border-t border-gray-300">
        <NavLink
          to="/login"
          className="flex items-center gap-4 px-5 py-3 rounded-md bg-red-600 text-white font-semibold justify-center text-base shadow-md hover:bg-red-700 transition focus:outline-none focus:ring-4 focus:ring-red-400"
          aria-label="Se déconnecter"
          title="Se déconnecter"
          tabIndex={0}
        >
          <User size={22} aria-hidden="true" />
          Se déconnecter
        </NavLink>
      </div>
    </aside>
  );
}
