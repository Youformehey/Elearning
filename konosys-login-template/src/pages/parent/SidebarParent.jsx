import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Users,
  BookOpen,
  Calendar,
  ClipboardList,
  MessageSquare,
  Menu,
  LogOut,
  GraduationCap,
  Clock,
  Target,
  Brain,
  Award,
  Moon,
  Sun,
  Home,
  FileText,
  Bell,
  Settings
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const links = [
  { to: "/parent", icon: Home, label: "Accueil", emoji: "🏠" },
  { to: "/parent/enfants", icon: Users, label: "Mes Enfants", emoji: "👨‍👩‍👧‍👦" },
  { to: "/parent/cours", icon: BookOpen, label: "Cours", emoji: "📚" },
  { to: "/parent/planning", icon: Calendar, label: "Planning", emoji: "📅" },
  { to: "/parent/notes", icon: Target, label: "Notes", emoji: "🎯" },
  { to: "/parent/absences", icon: Clock, label: "Absences", emoji: "⏰" },
  { to: "/parent/demandes", icon: MessageSquare, label: "Demandes", emoji: "💬" },
  { to: "/parent/formations", icon: Award, label: "Formations", emoji: "🏆" },
  { to: "/parent/rappels", icon: Bell, label: "Rappels", emoji: "🔔" },
  { to: "/parent/documents", icon: FileText, label: "Documents", emoji: "📄" },
  { to: "/parent/profil", icon: User, label: "Profil", emoji: "👤" },
  { to: "/parent/parametres", icon: Settings, label: "Paramètres", emoji: "⚙️" },
];

export default function SidebarParent() {
  const [open, setOpen] = useState(false);
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Hamburger bouton (mobile uniquement) */}
      <motion.button
        className="fixed top-4 left-4 z-[110] md:hidden p-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
            : 'bg-white text-gray-800'
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
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          {/* Theme toggle */}
          <motion.button
            className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg shadow-md font-medium text-sm transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-700 text-gray-100' 
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
            onClick={() => setDarkMode && setDarkMode(!darkMode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={darkMode ? "Mode clair" : "Mode sombre"}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span className="hidden sm:inline">{darkMode ? "Clair" : "Sombre"}</span>
          </motion.button>

          {/* Logo et titre */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <Users size={32} className="text-white" />
            </div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Espace Parent
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Suivi de vos enfants
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
                      ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg' 
                      : `hover:bg-opacity-10 ${darkMode ? 'hover:bg-white text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700'}`
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
        <div className={`px-4 py-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
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