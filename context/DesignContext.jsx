"use client";

import { createContext, useContext, useState } from "react";

const DesignContext = createContext(undefined);

export function DesignProvider({ children }) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);

  return (
    <DesignContext.Provider
      value={{
        selectedRoom,
        setSelectedRoom,
        selectedStyle,
        setSelectedStyle,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const context = useContext(DesignContext);
  if (context === undefined) {
    throw new Error("useDesign must be used within a DesignProvider");
  }
  return context;
}
