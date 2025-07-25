import React, { useContext, useState } from "react";
import { Bell, CalendarCheck, ClipboardList, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RappelsContext } from "../context/RappelsContext";

export default function NotificationRappels() {
  const { rappels, fetchRappels } = useContext(RappelsContext);
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!open);
    if (!open) fetchRappels();
  };

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="relative p-2 hover:bg-blue-100 rounded-full transition"
        aria-label="Afficher les notifications"
      >
        <Bell className="w-6 h-6 text-blue-800" />
        {rappels.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {rappels.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-[360px] bg-white shadow-2xl rounded-xl z-50 p-4"
          >
            <h3 className="text-blue-700 font-bold mb-3 text-lg flex items-center gap-2">
              📌 Vos rappels
            </h3>

            <div className="max-h-80 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
              {rappels.length === 0 ? (
                <p className="text-gray-500">Aucun rappel pour l’instant.</p>
              ) : (
                rappels.map((rappel) => (
                  <div
                    key={rappel._id}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3 items-start hover:bg-blue-100 transition"
                  >
                    <div className="pt-1">
                      {rappel.type === "devoir" ? (
                        <CalendarCheck className="w-5 h-5 text-blue-600" />
                      ) : (
                        <ClipboardList className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-800 font-medium capitalize">
                        {rappel.type} – <span className="font-normal">{rappel.texte}</span>
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                        <span>{new Date(rappel.date).toLocaleDateString()}</span>
                        {rappel.classe && (
                          <span className="flex items-center gap-1">
                            <GraduationCap size={14} />
                            {rappel.classe}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
