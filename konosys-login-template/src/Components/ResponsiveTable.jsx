import React, { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";

export default function ResponsiveTable({ 
  headers, 
  data, 
  className = "",
  onRowClick = null,
  emptyMessage = "Aucune donnée disponible"
}) {
  const { darkMode } = useContext(ThemeContext);
  return (
    <div className={`table-responsive ${className}`}>
      <table className="w-full">
        <thead>
          <tr className={`border-b-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {headers.map((header, index) => (
              <th 
                key={index}
                className={`px-4 py-3 text-left font-semibold text-sm sm:text-base ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={headers.length}
                className="px-4 py-8 text-center text-sm sm:text-base text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.1 }}
                className={`border-b ${
                  darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'
                } transition-colors duration-200 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex}
                    className="px-4 py-3 text-sm sm:text-base"
                  >
                    {cell}
                  </td>
                ))}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function MobileCardList({ 
  data, 
  renderCard, 
  className = "",
  emptyMessage = "Aucune donnée disponible"
}) {
  return (
    <div className={`space-y-3 sm:hidden ${className}`}>
      {data.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {renderCard(item, index)}
          </motion.div>
        ))
      )}
    </div>
  );
}

export function ResponsiveDataDisplay({ 
  headers, 
  data, 
  renderMobileCard,
  className = "",
  emptyMessage = "Aucune donnée disponible"
}) {
  return (
    <div className={className}>
      {/* Desktop Table */}
      <div className="hidden sm:block">
        <ResponsiveTable 
          headers={headers} 
          data={data} 
          emptyMessage={emptyMessage}
        />
      </div>

      {/* Mobile Cards */}
      <MobileCardList 
        data={data} 
        renderCard={renderMobileCard}
        emptyMessage={emptyMessage}
      />
    </div>
  );
} 