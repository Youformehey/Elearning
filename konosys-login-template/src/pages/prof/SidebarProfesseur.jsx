import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  BookOpen,
  Calendar,
  FileBarChart2,
  FolderKanban,
  Bell,
  FilePlus2,
  GraduationCap,
  Clock,
  Settings,
  LogOut,
  Menu,
  BarChart3,
  MessageSquare,
  X
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const links = [
  { to: "/prof", icon: GraduationCap, label: "Accueil", emoji: "🏠" },
  { to: "/prof/dashboard", icon: BarChart3, label: "Dashboard", emoji: "📊" },
  { to: "/prof/cours", icon: BookOpen, label: "Mes cours", emoji: "📚" },
  { to: "/prof/notes", icon: FileBarChart2, label: "Notes", emoji: "📝" },
  { to: "/prof/absences", icon: Clock, label: "Absences", emoji: "⏰" },
  { to: "/prof/planning", icon: Calendar, label: "Planning", emoji: "📅" },
  { to: "/prof/documents", icon: FolderKanban, label: "Documents", emoji: "📁" },
  { to: "/prof/rappels", icon: Bell, label: "Rappels", emoji: "🔔" },
  { to: "/prof/rappels/1/faits", icon: FilePlus2, label: "Rappels faits", emoji: "✅" },
  { to: "/prof/demandes", icon: MessageSquare, label: "Demandes", emoji: "💬" },
  { to: "/prof/profil", icon: User, label: "Profil", emoji: "👤" },
  { to: "/prof/parametres", icon: Settings, label: "Paramètres", emoji: "⚙️" },
];

export default function SidebarProfesseur() {
  const [open, setOpen] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    setOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* Hamburger bouton (mobile uniquement) */}
      <motion.button
        className="fixed top-4 left-4 z-[110] md:hidden p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </motion.button>

      {/* Overlay pour mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[90] md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar principal */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-[100] w-[280px]
          ${darkMode 
            ? 'bg-gray-900 text-gray-100' 
            : 'bg-blue-800 text-white'
          }
          md:static md:translate-x-0
          transition-all duration-300 ease-in-out
          shadow-xl
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className={`flex flex-col items-center px-6 py-8 border-b ${
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-blue-700 bg-blue-900'
        }`}>
          {/* Bouton fermer mobile */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
          >
            <X size={20} className="text-white" />
          </button>
          
          {/* Logo et titre */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <GraduationCap size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Espace Professeur
            </h2>
            <p className="text-sm text-blue-200">
              Gestion de vos cours
            </p>
          </motion.div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {links.map((link, index) => (
              <motion.li
                key={link.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <NavLink
                  to={link.to}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                      : 'hover:bg-white/10 text-white hover:text-white'
                    }
                  `}
                  onClick={() => setOpen(false)}
                >
                  <link.icon size={20} />
                  <span>{link.label}</span>
                  <span className="ml-auto">{link.emoji}</span>
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Footer avec logout */}
        <div className={`px-4 py-6 border-t ${darkMode ? 'border-gray-700' : 'border-blue-700'}`}>
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </motion.button>
        </div>
      </aside>
    </>
  );
}

