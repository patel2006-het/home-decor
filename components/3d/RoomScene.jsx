"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import RoomFloor from "@/components/3d/RoomFloor";
import RoomWalls from "@/components/3d/RoomWalls";
import FurnitureManager from "@/components/3d/FurnitureManager";
import RoomLighting from "@/components/3d/RoomLighting";
import { useDesign } from "@/context/DesignContext";

/**
 * RoomScene — Renders the WebGL 3D Room Scene using React Three Fiber.
 *
 * Combines RoomFloor, RoomWalls, and FurnitureManager components inside a Canvas
 * wrapper with interactive camera and lights.
 *
 * @param {object} props
 * @param {string} props.wallColor       - Active wall color hex
 * @param {object} props.selectedFloor   - Active floor configuration
 * @param {Array}  props.furnitureItems  - Placed furniture items list
 */
export default function RoomScene({
  furnitureItems = [],
}) {
  const { setSelectedInstanceId } = useDesign();

  return (
    <div className="h-full w-full bg-stone-100">
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [0, 2.5, 7.5], fov: 45 }}
        style={{ pointerEvents: "auto" }}
        // Deselect if clicking completely off the room diorama
        onPointerMissed={() => setSelectedInstanceId(null)}
      >
        {/* Reusable Scene Lighting */}
        <RoomLighting />

        {/* ── Room Diorama Group ── */}
        <group
          position={[0, -0.7, 0]}
          // Deselect when clicking on walls or floor
          onClick={() => setSelectedInstanceId(null)}
        >
          
          {/* Reusable Floor Component */}
          <RoomFloor />

          {/* Reusable Walls & Ceiling Component */}
          <RoomWalls />

          {/* Centralized Furniture Coordinator Component */}
          <FurnitureManager furnitureItems={furnitureItems} />
        </group>

        {/* ── Camera controls ── */}
        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from passing below floor plane
        />
      </Canvas>
    </div>
  );
}
