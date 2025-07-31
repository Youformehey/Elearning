import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import SidebarParent from "../../Components/SidebarParent";
import HomeNavbarParent from "../../Components/HomeNavbarParent";
import { ThemeContext } from "../../context/ThemeContext";

const ParentLayout = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <SidebarParent />
      
      {/* Main Content */}
      <div className="ml-80 transition-all duration-300">
        {/* Desktop Top Navigation */}
        <div className="hidden md:block">
          <HomeNavbarParent />
        </div>
        
        {/* Main Content Area */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default ParentLayout; 