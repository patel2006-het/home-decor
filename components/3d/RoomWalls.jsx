import React, { useMemo } from "react";
import * as THREE from "three";
import { useDesign } from "@/context/DesignContext";
import {
  generateWoodTexture,
  generateWallpaperTexture,
  generateStoneTexture,
} from "@/components/3d/textureGenerator";
import FalseCeiling from "@/components/3d/FalseCeiling";

/**
 * RoomWalls — Renders 4 single-sided walls and a ceiling.
 *
 * Implements inwards-facing planes so they auto-cull when viewed from outside the room box,
 * allowing OrbitControls to easily inspect the room contents.
 */
export default function RoomWalls() {
  const { roomMaterials } = useDesign();
  const { walls, ceiling } = roomMaterials;

  // Generate procedural texture dynamically based on walls type and colors
  const wallTexture = useMemo(() => {
    switch (walls.type) {
      case "wallpaper":
        return generateWallpaperTexture(
          walls.wallpaperType || "stripes",
          walls.color,
          walls.secondary || "#C8D5C0"
        );
      case "wood":
        return generateWoodTexture(walls.color);
      case "stone":
        return generateStoneTexture(walls.color);
      default:
        return null;
    }
  }, [walls.type, walls.color, walls.secondary, walls.wallpaperType]);

  // Generate ceiling wood texture if applicable
  const ceilingWoodTexture = useMemo(() => {
    if (ceiling.type === "wooden") {
      return generateWoodTexture(ceiling.color || "#C4A882");
    }
    return null;
  }, [ceiling.type, ceiling.color]);

  // Adjust material parameters depending on material type
  const materialProps = useMemo(() => {
    switch (walls.type) {
      case "wood":
        return { roughness: 0.5, metalness: 0.05 };
      case "stone":
        return { roughness: 0.85, metalness: 0.05 };
      case "wallpaper":
        return { roughness: 0.7, metalness: 0.05 };
      case "paint":
      default:
        return { roughness: 0.8, metalness: 0.05 };
    }
  }, [walls.type]);

  const activeWallColor = wallTexture ? "#ffffff" : walls.color;

  return (
    <group>
      {/* ── 4 Walls (Inward-facing single-sided planes) ── */}

      {/* Back Wall (Facing +Z) */}
      <mesh receiveShadow position={[0, 1.5, -2.5]}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial
          map={wallTexture}
          color={activeWallColor}
          {...materialProps}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Left Wall (Facing +X) */}
      <mesh receiveShadow position={[-3, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[5, 3]} />
        <meshStandardMaterial
          map={wallTexture}
          color={activeWallColor}
          {...materialProps}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Right Wall (Facing -X) */}
      <mesh receiveShadow position={[3, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[5, 3]} />
        <meshStandardMaterial
          map={wallTexture}
          color={activeWallColor}
          {...materialProps}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Front Wall (Facing -Z) — Culled from outside, visible if camera goes inside */}
      <mesh position={[0, 1.5, 2.5]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial
          map={wallTexture}
          color={activeWallColor}
          {...materialProps}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* ── Ceiling (Facing -Y / Downwards) ── */}
      {ceiling.type === "false-ceiling" ? (
        <FalseCeiling />
      ) : ceiling.type === "wooden" ? (
        <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 5]} />
          <meshStandardMaterial
            map={ceilingWoodTexture}
            color="#ffffff"
            roughness={0.55}
            metalness={0.05}
            side={THREE.FrontSide}
          />
        </mesh>
      ) : (
        <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 5]} />
          <meshStandardMaterial
            color={ceiling.color || "#FAF8F5"}
            roughness={0.9}
            side={THREE.FrontSide}
          />
        </mesh>
      )}

      {/* ── Window Frame & Pane (on Back Wall) ── */}
      <group position={[0, 1.6, -2.48]}>
        {/* Window glass pane */}
        <mesh>
          <planeGeometry args={[1.5, 1.8]} />
          <meshStandardMaterial
            color="#bae6fd"
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.4}
          />
        </mesh>
        {/* Outer trim frame */}
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[1.6, 1.9, 0.02]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      </group>

      {/* Baseboard trim along the bottom of the Back Wall */}
      <mesh position={[0, 0.06, -2.45]}>
        <boxGeometry args={[6, 0.12, 0.04]} />
        <meshStandardMaterial color="#FAF8F5" roughness={0.7} />
      </mesh>
    </group>
  );
}
