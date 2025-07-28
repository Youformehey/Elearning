import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

export default function ResponsiveModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = "",
  maxWidth = "max-w-lg"
}) {
  const { darkMode } = useContext(ThemeContext);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-responsive"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`modal-content-responsive ${maxWidth} ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 sm:p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-lg sm:text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {title}
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ResponsiveForm({ 
  onSubmit, 
  children, 
  submitText = "Soumettre",
  cancelText = "Annuler",
  onCancel = null,
  loading = false,
  className = ""
}) {
  const { darkMode } = useContext(ThemeContext);

  return (
    <form onSubmit={onSubmit} className={`space-y-4 sm:space-y-6 ${className}`}>
      {children}
      
      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`flex-1 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {cancelText}
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-all duration-200 ${
            loading 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? "Chargement..." : submitText}
        </button>
      </div>
    </form>
  );
}

export function ResponsiveInput({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder = "",
  required = false,
  error = null,
  className = ""
}) {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className={`block text-sm sm:text-base font-medium ${
        darkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border-2 transition-all duration-200 text-sm sm:text-base ${
          darkMode 
            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
        } ${error ? 'border-red-500' : ''}`}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

export function ResponsiveTextarea({ 
  label, 
  value, 
  onChange, 
  placeholder = "",
  required = false,
  error = null,
  rows = 4,
  className = ""
}) {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className={`block text-sm sm:text-base font-medium ${
        darkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border-2 transition-all duration-200 text-sm sm:text-base resize-vertical ${
          darkMode 
            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
        } ${error ? 'border-red-500' : ''}`}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 