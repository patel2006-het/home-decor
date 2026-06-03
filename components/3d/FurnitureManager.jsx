"use client";

import React from "react";
import FurnitureItem from "./FurnitureItem";

/**
 * FurnitureManager — Centralized scene manager for rendering placed elements.
 * 
 * Takes the list of furniture items and maps them to active 3D meshes, 
 * housing any group transforms or scene-wide helpers.
 */
export default function FurnitureManager({ furnitureItems = [] }) {
  return (
    <group name="FurnitureManager">
      {furnitureItems.map((instance) => (
        <FurnitureItem
          key={instance.instanceId}
          instance={instance}
        />
      ))}
    </group>
  );
}
