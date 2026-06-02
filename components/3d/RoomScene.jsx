"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import RoomFloor from "@/components/3d/RoomFloor";
import RoomWalls from "@/components/3d/RoomWalls";
import FurnitureModel3D from "@/components/3d/FurnitureModel3D";

/**
 * RoomScene — Renders the WebGL 3D Room Scene using React Three Fiber.
 *
 * Combines RoomFloor, RoomWalls, and FurnitureModel3D components inside a Canvas
 * wrapper with interactive camera and lights.
 *
 * @param {object} props
 * @param {string} props.wallColor       - Active wall color hex
 * @param {object} props.selectedFloor   - Active floor configuration
 * @param {Array}  props.furnitureItems  - Placed furniture items list
 */
export default function RoomScene({
  wallColor,
  selectedFloor,
  furnitureItems = [],
}) {
  return (
    <div className="h-full w-full bg-stone-100">
      <Canvas
        shadows
        camera={{ position: [0, 2.5, 7.5], fov: 45 }}
        style={{ pointerEvents: "auto" }}
      >
        {/* ── Lighting ── */}
        <ambientLight intensity={0.55} />
        
        {/* Key directional light cast from top-right-front */}
        <directionalLight
          position={[6, 9, 6]}
          intensity={1.0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={25}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
        />
        
        {/* Soft fill point light in the back left corner */}
        <pointLight position={[-4, 2.2, -2]} intensity={0.4} />

        {/* ── Room Diorama Group ── */}
        <group position={[0, -0.7, 0]}>
          
          {/* Reusable Floor Component */}
          <RoomFloor selectedFloor={selectedFloor} />

          {/* Reusable Walls & Ceiling Component */}
          <RoomWalls wallColor={wallColor} />

          {/* Render Furniture meshes */}
          {furnitureItems.map((instance) => (
            <FurnitureModel3D
              key={instance.instanceId}
              instance={instance}
            />
          ))}
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
