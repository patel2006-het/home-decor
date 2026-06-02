"use client";

import { createContext, useContext, useState } from "react";

const DesignContext = createContext(undefined);

export function DesignProvider({ children }) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [furnitureItems, setFurnitureItems] = useState([]);

  const handleSetSelectedRoom = (room) => {
    setSelectedRoom(room);
    setFurnitureItems([]); // Reset furniture items when room changes
  };

  const addFurnitureItem = (item) => {
    setFurnitureItems((prev) => {
      // Prevent adding the same item type twice in the current step
      if (prev.some((p) => p.id === item.id)) return prev;
      return [
        ...prev,
        {
          ...item,
          instanceId: `${item.id}-${Date.now()}`,
          position: { x: 50, y: 50 }, // default relative position coordinates (centered)
        },
      ];
    });
  };

  const removeFurnitureItemById = (itemId) => {
    setFurnitureItems((prev) => prev.filter((p) => p.id !== itemId));
  };

  const removeFurnitureItemByInstance = (instanceId) => {
    setFurnitureItems((prev) => prev.filter((p) => p.instanceId !== instanceId));
  };

  const updateFurniturePosition = (instanceId, x, y) => {
    setFurnitureItems((prev) =>
      prev.map((p) =>
        p.instanceId === instanceId ? { ...p, position: { x, y } } : p
      )
    );
  };

  const saveDesign = () => {
    const designData = {
      room: selectedRoom,
      style: selectedStyle,
      furniture: furnitureItems,
    };
    console.log("Saving design:", designData);
    return designData;
  };

  const loadDesign = (designData) => {
    if (!designData) return;
    if (designData.room) setSelectedRoom(designData.room);
    if (designData.style) setSelectedStyle(designData.style);
    if (designData.furniture) setFurnitureItems(designData.furniture);
    console.log("Design loaded successfully.");
  };

  return (
    <DesignContext.Provider
      value={{
        selectedRoom,
        setSelectedRoom: handleSetSelectedRoom,
        selectedStyle,
        setSelectedStyle,
        furnitureItems,
        setFurnitureItems,
        addFurnitureItem,
        removeFurnitureItemById,
        removeFurnitureItemByInstance,
        updateFurniturePosition,
        saveDesign,
        loadDesign,
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
