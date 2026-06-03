"use client";

import { createContext, useContext, useState } from "react";

const DesignContext = createContext(undefined);

export function DesignProvider({ children }) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState(null);
  const [transformMode, setTransformMode] = useState("translate");

  const handleSetSelectedRoom = (room) => {
    setSelectedRoom(room);
    setFurnitureItems([]); // Reset furniture items when room changes
    setSelectedInstanceId(null); // Clear selected item
  };

  const addFurnitureItem = (item) => {
    setFurnitureItems((prev) => {
      // Prevent adding the same item type twice in the current step
      if (prev.some((p) => p.id === item.id)) return prev;
      const newInstance = {
        ...item,
        instanceId: `${item.id}-${Date.now()}`,
        position: { x: 50, y: 50 }, // default relative position coordinates (centered)
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      };
      // Auto-select the newly added item
      setSelectedInstanceId(newInstance.instanceId);
      return [...prev, newInstance];
    });
  };

  const removeFurnitureItemById = (itemId) => {
    setFurnitureItems((prev) => {
      const remaining = prev.filter((p) => p.id !== itemId);
      // If the currently selected item is removed, deselect it
      const isSelectedRemoved = prev.find((p) => p.id === itemId)?.instanceId === selectedInstanceId;
      if (isSelectedRemoved) {
        setSelectedInstanceId(null);
      }
      return remaining;
    });
  };

  const removeFurnitureItemByInstance = (instanceId) => {
    if (selectedInstanceId === instanceId) {
      setSelectedInstanceId(null);
    }
    setFurnitureItems((prev) => prev.filter((p) => p.instanceId !== instanceId));
  };

  const updateFurniturePosition = (instanceId, x, y) => {
    setFurnitureItems((prev) =>
      prev.map((p) =>
        p.instanceId === instanceId ? { ...p, position: { x, y } } : p
      )
    );
  };

  const updateFurnitureTransform = (instanceId, { position, rotation, scale }) => {
    setFurnitureItems((prev) =>
      prev.map((p) => {
        if (p.instanceId !== instanceId) return p;
        return {
          ...p,
          position: position !== undefined ? position : p.position,
          rotation: rotation !== undefined ? rotation : p.rotation,
          scale: scale !== undefined ? scale : p.scale,
        };
      })
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
    setSelectedInstanceId(null);
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
        updateFurnitureTransform,
        selectedInstanceId,
        setSelectedInstanceId,
        transformMode,
        setTransformMode,
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
