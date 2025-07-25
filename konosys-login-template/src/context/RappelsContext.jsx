import React, { createContext, useState, useCallback } from "react";

export const RappelsContext = createContext();

export const RappelsProvider = ({ children }) => {
  const [rappels, setRappels] = useState([]);

  const fetchRappels = useCallback(async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo?.token) {
      setRappels([]);
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/rappels", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      if (!res.ok) throw new Error("Erreur récupération rappels");
      const data = await res.json();
      setRappels(data);
    } catch (error) {
      console.error("Erreur fetchRappels:", error);
      setRappels([]);
    }
  }, []);

  return (
    <RappelsContext.Provider value={{ rappels, fetchRappels }}>
      {children}
    </RappelsContext.Provider>
  );
};
