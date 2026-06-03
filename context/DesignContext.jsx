"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { roomSelectionData } from "@/lib/data";

const DesignContext = createContext(undefined);

export function DesignProvider({ children }) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [roomsList, setRoomsList] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [selectedInstanceId, setSelectedInstanceId] = useState(null);
  const [transformMode, setTransformMode] = useState("translate");

  const defaultMaterials = {
    walls: { type: "paint", color: "#FAF8F5", swatchId: "white-linen" },
    flooring: { type: "wood", color: "#E6C594", swatchId: "light-oak" },
    ceiling: { type: "standard", color: "#FAF8F5" },
  };

  const defaultGlobalLighting = {
    ambientIntensity: 0.55,
    ambientColor: "#ffffff",
    ambientTemp: 4000,
    directionalIntensity: 1.0,
    shadowsEnabled: true,
  };

  // Derive active room state on the fly
  const activeRoom = roomsList.find((r) => r.id === activeRoomId) || roomsList[0];
  const furnitureItems = activeRoom ? activeRoom.furnitureItems : [];
  const roomMaterials = activeRoom ? activeRoom.roomMaterials : defaultMaterials;
  const globalLighting = activeRoom ? activeRoom.globalLighting : defaultGlobalLighting;

  const initializeHouse = (room) => {
    if (!room) return;
    setSelectedRoom(room);
    setRoomsList((prev) => {
      if (prev.length > 0) return prev; // Do not overwrite if already initialized
      const initialRoomObj = {
        id: `${room.slug}-${Date.now()}`,
        type: room.slug,
        name: room.name,
        furnitureItems: [],
        roomMaterials: { ...defaultMaterials },
        globalLighting: { ...defaultGlobalLighting },
      };
      setActiveRoomId(initialRoomObj.id);
      return [initialRoomObj];
    });
  };

  const handleSetSelectedRoom = (room) => {
    setSelectedRoom(room);
    const initialRoomObj = {
      id: `${room.slug}-${Date.now()}`,
      type: room.slug,
      name: room.name,
      furnitureItems: [],
      roomMaterials: { ...defaultMaterials },
      globalLighting: { ...defaultGlobalLighting },
    };
    setRoomsList([initialRoomObj]);
    setActiveRoomId(initialRoomObj.id);
    setSelectedInstanceId(null);
  };

  const addRoom = (type, customName) => {
    const roomData = roomSelectionData.find((r) => r.slug === type);
    const defaultName = roomData ? roomData.name : type.charAt(0).toUpperCase() + type.slice(1);
    
    // Count how many rooms of this type already exist
    const typeCount = roomsList.filter((r) => r.type === type).length;
    const name = customName?.trim() || (typeCount > 0 ? `${defaultName} ${typeCount + 1}` : defaultName);

    const newRoom = {
      id: `${type}-${Date.now()}`,
      type,
      name,
      furnitureItems: [],
      roomMaterials: { ...defaultMaterials },
      globalLighting: { ...defaultGlobalLighting },
    };

    setRoomsList((prev) => [...prev, newRoom]);
    setActiveRoomId(newRoom.id);
    setSelectedInstanceId(null);
    console.log(`[HouseBuilder] Added new room: ${name} (${type})`);
  };

  const removeRoom = (roomId) => {
    if (roomsList.length <= 1) {
      console.warn("[HouseBuilder] Cannot remove the only room in the house.");
      return;
    }
    
    setRoomsList((prev) => {
      const filtered = prev.filter((r) => r.id !== roomId);
      if (activeRoomId === roomId) {
        const deletedIndex = prev.findIndex((r) => r.id === roomId);
        const nextActiveIndex = deletedIndex > 0 ? deletedIndex - 1 : 0;
        const nextActiveRoom = filtered[nextActiveIndex] || filtered[0];
        setActiveRoomId(nextActiveRoom.id);
        setSelectedInstanceId(null);
      }
      return filtered;
    });
    console.log(`[HouseBuilder] Removed room: ${roomId}`);
  };

  const renameRoom = (roomId, newName) => {
    if (!newName || !newName.trim()) return;
    setRoomsList((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, name: newName.trim() } : r))
    );
    console.log(`[HouseBuilder] Renamed room ${roomId} to "${newName.trim()}"`);
  };

  const handleSetFurnitureItems = (updater) => {
    setRoomsList((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id !== activeRoomId) return room;
        const updated = typeof updater === "function" ? updater(room.furnitureItems) : updater;
        return {
          ...room,
          furnitureItems: updated,
        };
      })
    );
  };

  const updateGlobalLighting = (updates) => {
    setRoomsList((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id !== activeRoomId) return room;
        return {
          ...room,
          globalLighting: {
            ...room.globalLighting,
            ...updates,
          },
        };
      })
    );
    console.log("[LightingStudio] Updated global lighting settings:", updates);
  };

  const updateRoomMaterials = (target, materialData) => {
    setRoomsList((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id !== activeRoomId) return room;
        return {
          ...room,
          roomMaterials: {
            ...room.roomMaterials,
            [target]: {
              ...room.roomMaterials[target],
              ...materialData,
            },
          },
        };
      })
    );
    console.log(`[MaterialsStudio] Updated ${target} materials:`, materialData);
  };

  const addFurnitureItem = (item) => {
    setRoomsList((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id !== activeRoomId) return room;

        const prevItems = room.furnitureItems;
        if (!item.isArchitectural && !item.isLight && prevItems.some((p) => p.id === item.id)) return room;

        const newInstance = {
          ...item,
          instanceId: `${item.id}-${Date.now()}`,
          type: item.category || "Furniture",
          position: { x: 50, y: 50 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
        };
        if (item.isLight) {
          newInstance.lightSettings = {
            color: "#ffedd5",
            intensity: 1.5,
            temperature: 3000,
            range: 5,
          };
        }
        setSelectedInstanceId(newInstance.instanceId);
        console.log(`[FurnitureManager] Added item ${item.name} to room ${room.name}`);
        return {
          ...room,
          furnitureItems: [...prevItems, newInstance],
        };
      })
    );
  };

  const removeFurnitureItemById = (itemId) => {
    setRoomsList((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id !== activeRoomId) return room;

        const prevItems = room.furnitureItems;
        const remaining = prevItems.filter((p) => p.id !== itemId);
        const isSelectedRemoved = prevItems.find((p) => p.id === itemId)?.instanceId === selectedInstanceId;
        if (isSelectedRemoved) {
          setSelectedInstanceId(null);
        }
        return {
          ...room,
          furnitureItems: remaining,
        };
      })
    );
  };

  const removeFurnitureItemByInstance = (instanceId) => {
    if (selectedInstanceId === instanceId) {
      setSelectedInstanceId(null);
    }
    console.log(`[FurnitureManager] Removed instance ${instanceId}`);
    setRoomsList((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id !== activeRoomId) return room;
        return {
          ...room,
          furnitureItems: room.furnitureItems.filter((p) => p.instanceId !== instanceId),
        };
      })
    );
  };

  const updateFurniturePosition = (instanceId, x, y) => {
    console.log(`[FurnitureManager] Position updated for instance ${instanceId}: X: ${x.toFixed(1)}%, Y: ${y.toFixed(1)}%`);
    setRoomsList((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id !== activeRoomId) return room;
        return {
          ...room,
          furnitureItems: room.furnitureItems.map((p) =>
            p.instanceId === instanceId ? { ...p, position: { x, y } } : p
          ),
        };
      })
    );
  };

  const updateFurnitureTransform = (instanceId, updates) => {
    const { position, rotation, scale, heightOffset, material, lightSettings } = updates;
    setRoomsList((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id !== activeRoomId) return room;
        return {
          ...room,
          furnitureItems: room.furnitureItems.map((p) => {
            if (p.instanceId !== instanceId) return p;
            return {
              ...p,
              position: position !== undefined ? position : p.position,
              rotation: rotation !== undefined ? rotation : p.rotation,
              scale: scale !== undefined ? scale : p.scale,
              heightOffset: heightOffset !== undefined ? heightOffset : p.heightOffset,
              material: material !== undefined ? material : p.material,
              lightSettings: lightSettings !== undefined ? { ...p.lightSettings, ...lightSettings } : p.lightSettings,
            };
          }),
        };
      })
    );
  };

  const saveDesign = () => {
    const designData = {
      selectedRoom,
      selectedStyle,
      roomsList,
      activeRoomId,
    };
    console.log("Saving multi-room design:", designData);
    return designData;
  };

  const loadDesign = (designData) => {
    if (!designData) return;
    if (designData.roomsList) {
      setRoomsList(designData.roomsList);
      if (designData.activeRoomId) setActiveRoomId(designData.activeRoomId);
      if (designData.selectedRoom) setSelectedRoom(designData.selectedRoom);
    } else {
      // Legacy single-room load
      const legacyRoom = designData.room || selectedRoom;
      if (legacyRoom) {
        setSelectedRoom(legacyRoom);
        const legacyRoomObj = {
          id: `${legacyRoom.slug}-legacy`,
          type: legacyRoom.slug,
          name: legacyRoom.name,
          furnitureItems: designData.furniture || [],
          roomMaterials: designData.roomMaterials || defaultMaterials,
          globalLighting: designData.globalLighting || defaultGlobalLighting,
        };
        setRoomsList([legacyRoomObj]);
        setActiveRoomId(legacyRoomObj.id);
      }
    }
    if (designData.selectedStyle) setSelectedStyle(designData.selectedStyle);
    else if (designData.style) setSelectedStyle(designData.style);
    
    setSelectedInstanceId(null);
    console.log("Multi-room design loaded successfully.");
  };

  return (
    <DesignContext.Provider
      value={{
        selectedRoom,
        setSelectedRoom: handleSetSelectedRoom,
        selectedStyle,
        setSelectedStyle,
        furnitureItems,
        setFurnitureItems: handleSetFurnitureItems,
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
        globalLighting,
        updateGlobalLighting,
        saveDesign,
        loadDesign,
        // Multi-Room states and actions
        roomsList,
        activeRoomId,
        setActiveRoomId,
        addRoom,
        removeRoom,
        renameRoom,
        initializeHouse,
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
