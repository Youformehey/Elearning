import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight,
  Home,
  Calendar,
  FileText,
  Award,
  GraduationCap,
  Bell,
  User,
  Users,
  Settings,
  LogOut,
  Search
} from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

const SidebarParent = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || { name: "Parent" };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Tableau de bord", path: "/parent/dashboard", description: "Vue d'ensemble complète" },
    { id: "absences", icon: Calendar, label: "Absences", path: "/parent/absences", description: "Suivi des présences" },
    { id: "notes", icon: Award, label: "Notes", path: "/parent/notes", description: "Progression scolaire" },
    { id: "formations", icon: GraduationCap, label: "Formations", path: "/parent/formations", description: "Gestion des paiements" },
    { id: "notifications", icon: Bell, label: "Notifications", path: "/parent/notifications", description: "Alertes importantes" },
    { id: "demandes", icon: FileText, label: "Demandes", path: "/parent/demandes", description: "Communications" },
    { id: "profil", icon: User, label: "Profil", path: "/parent/profil", description: "Informations personnelles" }
  ];

  const quickStats = [
    { icon: Users, label: "Enfants", value: "1" },
    { icon: Bell, label: "Alertes", value: "1" },
    { icon: Award, label: "Moyenne", value: "14.2" }
  ];

  return (
    <motion.div
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-xl z-50 transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-6 border-b border-blue-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold">Espace Parent</h1>
                <p className="text-xs text-blue-200">Gestion scolaire avancée</p>
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-blue-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <p className="font-semibold">{userInfo.name}</p>
              <p className="text-xs text-blue-200">Parent • Connecté</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveItem(item.id);
              window.location.href = item.path;
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeItem === item.id
                ? "bg-white bg-opacity-20 text-white shadow-lg"
                : "text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {!isCollapsed && (
              <div className="flex-1 text-left">
                <div>{item.label}</div>
                <div className="text-xs text-blue-200 opacity-75">{item.description}</div>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Quick Stats */}
      {!isCollapsed && (
        <div className="p-4 border-t border-blue-500">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 bg-blue-200 rounded"></div>
            <h3 className="text-sm font-semibold">Statistiques rapides</h3>
          </div>
          <div className="space-y-2">
            {quickStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white bg-opacity-10 rounded-lg">
                <div className="flex items-center gap-2">
                  <stat.icon className="w-4 h-4 text-blue-200" />
                  <span className="text-xs">{stat.label}</span>
                </div>
                <span className="text-sm font-semibold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-blue-500">
        <div className="space-y-2">
          {/* Dark Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white transition-colors"
          >
            {darkMode ? (
              <>
                <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                {!isCollapsed && <span className="text-sm">Mode Sombre</span>}
              </>
            ) : (
              <>
                <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                {!isCollapsed && <span className="text-sm">Mode Clair</span>}
              </>
            )}
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
            {!isCollapsed && <span className="text-sm">Paramètres</span>}
          </motion.button>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-300 hover:bg-red-500 hover:bg-opacity-20 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span className="text-sm">Déconnexion</span>}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default SidebarParent; 