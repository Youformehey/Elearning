import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  User,
  BookOpen,
  Calendar,
  FileBarChart2,
  FolderKanban,
  Bell,
  FilePlus2,
} from "lucide-react";

const links = [
  { to: "/prof/cours", icon: BookOpen, label: "Mes cours" },
  { to: "/prof/notes", icon: FileBarChart2, label: "Notes" },
  { to: "/prof/absences", icon: Calendar, label: "Absences" },
  { to: "/prof/planning", icon: Calendar, label: "Planning" },
  { to: "/prof/documents", icon: FolderKanban, label: "Documents" },
  { to: "/prof/rappels", icon: Bell, label: "Rappels" },
  { to: "/prof/rappels/1/faits", icon: FilePlus2, label: "Rappels faits" },
  { to: "/prof/profil", icon: User, label: "Profil" },
];

export default function SidebarProfesseur() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bouton hamburger mobile */}
      <button
        className="fixed top-4 left-4 z-60 md:hidden p-2 rounded-md bg-blue-900 text-white shadow-lg"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <aside
        className={`
          fixed top-0 left-0 h-screen bg-blue-900 text-white shadow-2xl z-50
          w-full max-w-xs sm:max-w-[240px] md:max-w-[240px] 
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex md:flex-col md:justify-between
          overflow-y-auto
          scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-900
        `}
        style={{ height: "100vh" }}
      >
        {/* HEADER */}
        <div className="flex flex-col items-center px-4 py-6 border-b border-blue-800">
          <img
            src="/image pfe.png"
            alt="LearnUp Logo"
            className="w-12 h-12 mb-2 rounded-full shadow"
          />
          <h1 className="text-lg font-semibold">LearnUp</h1>
          <p className="text-xs text-blue-300 mt-1 tracking-wide">Espace Prof</p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-4 px-2 py-6 flex-grow">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg text-base font-semibold transition duration-150
                ${isActive ? "bg-white text-blue-900" : "hover:bg-blue-800"}`
              }
              onClick={() => setOpen(false)} // ferme menu mobile au clic
            >
              <Icon size={24} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-blue-800">
          <NavLink
            to="/login"
            className="flex items-center gap-3 py-2 text-base hover:bg-blue-800 rounded-lg transition"
            onClick={() => setOpen(false)}
          >
            <User size={24} />
            <span>Se déconnecter</span>
          </NavLink>
        </div>
      </aside>

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
