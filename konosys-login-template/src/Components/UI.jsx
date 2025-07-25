// src/components/UI.jsx
import React from "react";
import { motion } from "framer-motion";

// ----- Btn -----
export function Btn({ children, variant = "primary", className = "", ...props }) {
  const base =
    "px-5 py-2.5 rounded-lg font-semibold text-base flex items-center justify-center gap-2 transition";
  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white",
    blue:
      "bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white",
    light:
      "bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

// ----- InputModern -----
export function InputModern({ label, error, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-indigo-700 font-semibold text-base mb-1">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`border border-indigo-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
          error ? "border-red-400 focus:ring-red-300" : ""
        }`}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}

// ----- ActionBtn -----
export function ActionBtn({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 border border-indigo-200 rounded-lg bg-white hover:bg-indigo-50 text-indigo-700"
    >
      <Icon size={18} /> {label}
    </button>
  );
}

// ----- IconText -----
export function IconText({ icon: Icon, children }) {
  return (
    <span className="flex items-center gap-2 text-indigo-500 font-semibold">
      <Icon size={16} /> {children}
    </span>
  );
}

// ----- Modal -----
export function Modal({ children, onClose }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg"
      >
        {children}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
}
