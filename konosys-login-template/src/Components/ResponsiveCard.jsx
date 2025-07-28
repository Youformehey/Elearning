import React from "react";
import { motion } from "framer-motion";

export default function ResponsiveCard({ 
  children, 
  className = "", 
  delay = 0, 
  whileHover = { scale: 1.02 }, 
  whileTap = { scale: 0.98 },
  onClick = null 
}) {
  return (
    <motion.div
      className={`dashboard-card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={whileHover}
      whileTap={whileTap}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

export function StatCard({ 
  icon, 
  title, 
  value, 
  change, 
  color, 
  bgColor, 
  iconBg, 
  trend = "up",
  delay = 0 
}) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "↗️";
      case "down":
        return "↘️";
      default:
        return "→";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <ResponsiveCard delay={delay}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`p-2 sm:p-3 rounded-xl ${iconBg} text-white`}>
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
              {icon}
            </div>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">
              {title}
            </h3>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
        </div>
        {change && (
          <div className="text-right">
            <div className={`text-xs sm:text-sm font-medium ${getTrendColor()}`}>
              {getTrendIcon()} {change}
            </div>
          </div>
        )}
      </div>
    </ResponsiveCard>
  );
}

export function ActionCard({ 
  icon, 
  title, 
  color, 
  onClick, 
  delay = 0 
}) {
  return (
    <ResponsiveCard 
      delay={delay}
      onClick={onClick}
      className="cursor-pointer hover:shadow-xl transition-all duration-300"
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className={`p-3 sm:p-4 rounded-xl bg-gradient-to-r ${color} text-white shadow-lg`}>
          <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">
          {title}
        </h3>
      </div>
    </ResponsiveCard>
  );
}

export function GridContainer({ children, className = "" }) {
  return (
    <div className={`responsive-grid ${className}`}>
      {children}
    </div>
  );
} 