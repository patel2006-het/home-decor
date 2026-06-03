"use client";

import React, { useMemo } from "react";
import { useDesign } from "@/context/DesignContext";
import {
  generateWoodTexture,
  generateMarbleTexture,
  generateTilesTexture,
  generateGraniteTexture,
} from "@/components/3d/textureGenerator";

/**
 * RoomFloor — Renders the 3D Floor plane with grid alignment helper and procedural materials.
 */
export default function RoomFloor() {
  const { roomMaterials } = useDesign();
  const flooring = roomMaterials.flooring;

  // Generate procedural texture dynamically based on flooring type and color
  const floorTexture = useMemo(() => {
    switch (flooring.type) {
      case "wood":
        return generateWoodTexture(flooring.color);
      case "laminate":
        // Laminate uses a wood board texture
        return generateWoodTexture(flooring.color);
      case "marble":
        return generateMarbleTexture(flooring.color, flooring.secondary || "#A0A0A0");
      case "tiles":
        return generateTilesTexture(flooring.color, flooring.secondary || "#CCCCCC");
      case "granite":
        return generateGraniteTexture(flooring.color);
      default:
        return null;
    }
  }, [flooring.type, flooring.color, flooring.secondary]);

  // Adjust material parameters depending on material type
  const materialProps = useMemo(() => {
    switch (flooring.type) {
      case "marble":
        return { roughness: 0.1, metalness: 0.2 }; // highly polished, reflective
      case "tiles":
        return { roughness: 0.2, metalness: 0.05 }; // semi-gloss
      case "wood":
      case "laminate":
        return { roughness: 0.45, metalness: 0.05 }; // satin wood sheen
      case "granite":
      default:
        return { roughness: 0.6, metalness: 0.1 }; // matte stone finish
    }
  }, [flooring.type]);

  return (
    <group name="RoomFloor">
      {/* Floor Box (0.1 units thick to give clean edges) */}
      <mesh receiveShadow position={[0, -0.05, 0]}>
        <boxGeometry args={[6, 0.1, 5]} />
        <meshStandardMaterial
          map={floorTexture}
          color={floorTexture ? "#ffffff" : flooring.color} // white base if texture map is active to avoid double tinting
          {...materialProps}
        />
      </mesh>

      {/* Modern technical design grid helper */}
      <gridHelper
        args={[6, 6, "#78716c", "#d6d3d1"]}
        position={[0, 0.01, 0]}
      />
    </group>
  );
}
