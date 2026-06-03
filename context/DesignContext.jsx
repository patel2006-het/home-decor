"use client";

import { createContext, useContext, useState } from "react";

const DesignContext = createContext(undefined);

export function DesignProvider({ children }) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState(null);
  const [transformMode, setTransformMode] = useState("translate");

  const defaultMaterials = {
    walls: { type: "paint", color: "#FAF8F5", swatchId: "white-linen" },
    flooring: { type: "wood", color: "#E6C594", swatchId: "light-oak" },
    ceiling: { type: "standard", color: "#FAF8F5" },
  };

  const [roomMaterials, setRoomMaterials] = useState(defaultMaterials);

  const handleSetSelectedRoom = (room) => {
    setSelectedRoom(room);
    setFurnitureItems([]); // Reset furniture items when room changes
    setSelectedInstanceId(null); // Clear selected item
    setRoomMaterials(defaultMaterials); // Reset materials
  };

  const updateRoomMaterials = (target, materialData) => {
    setRoomMaterials((prev) => ({
      ...prev,
      [target]: {
        ...prev[target],
        ...materialData,
      },
    }));
    console.log(`[MaterialsStudio] Updated ${target} materials:`, materialData);
  };

  const addFurnitureItem = (item) => {
    setFurnitureItems((prev) => {
      // Prevent adding the same furniture item type twice, but allow multiple doors, windows, and curtains
      if (!item.isArchitectural && prev.some((p) => p.id === item.id)) return prev;
      const newInstance = {
        ...item,
        instanceId: `${item.id}-${Date.now()}`,
        type: item.category || "Furniture", // Explicitly store type
        position: { x: 50, y: 50 }, // default relative position coordinates (centered)
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      };
      // Auto-select the newly added item
      setSelectedInstanceId(newInstance.instanceId);
      console.log(`[FurnitureManager] Added item ${item.name} (type: ${newInstance.type}) to room`);
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
    console.log(`[FurnitureManager] Removed instance ${instanceId}`);
    setFurnitureItems((prev) => prev.filter((p) => p.instanceId !== instanceId));
  };

  const updateFurniturePosition = (instanceId, x, y) => {
    console.log(`[FurnitureManager] Position updated for instance ${instanceId}: X: ${x.toFixed(1)}%, Y: ${y.toFixed(1)}%`);
    setFurnitureItems((prev) =>
      prev.map((p) =>
        p.instanceId === instanceId ? { ...p, position: { x, y } } : p
      )
    );
  };

  const updateFurnitureTransform = (instanceId, updates) => {
    const { position, rotation, scale, heightOffset, material } = updates;
    if (position) {
      console.log(`[FurnitureManager] Position updated for instance ${instanceId}: X: ${position.x.toFixed(1)}%, Z: ${position.y.toFixed(1)}%`);
    }
    if (rotation) {
      console.log(`[FurnitureManager] Rotation updated for instance ${instanceId}: Y-angle: ${((rotation.y * 180) / Math.PI).toFixed(0)}°`);
    }
    if (scale) {
      console.log(`[FurnitureManager] Scale updated for instance ${instanceId}: X: ${scale.x.toFixed(2)}, Y: ${scale.y.toFixed(2)}, Z: ${scale.z.toFixed(2)}`);
    }

    setFurnitureItems((prev) =>
      prev.map((p) => {
        if (p.instanceId !== instanceId) return p;
        return {
          ...p,
          position: position !== undefined ? position : p.position,
          rotation: rotation !== undefined ? rotation : p.rotation,
          scale: scale !== undefined ? scale : p.scale,
          heightOffset: heightOffset !== undefined ? heightOffset : p.heightOffset,
          material: material !== undefined ? material : p.material,
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
        roomMaterials,
        updateRoomMaterials,
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
