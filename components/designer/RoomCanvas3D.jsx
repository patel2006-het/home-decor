"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import FurnitureModel3D from "@/components/designer/FurnitureModel3D";

/**
 * Maps the selected floor type ID to a realistic 3D mesh color.
 */
function getFloorColor(floorId) {
  switch (floorId) {
    case "light-oak":
      return "#E6C594"; // Warm light wood
    case "dark-walnut":
      return "#5C3E35"; // Deep rich brown
    case "marble-white":
      return "#EAE8E4"; // Off-white clean marble
    case "concrete":
      return "#9CA3AF"; // Neutral cool concrete grey
    case "terracotta-tile":
      return "#C25E3E"; // Earthy red clay tile
    default:
      return "#D4B896";
  }
}

/**
 * RoomCanvas3D — Renders the WebGL 3D Room using React Three Fiber.
 *
 * Implements:
 * - OrbitControls for pan, zoom, rotate.
 * - Dynamic lighting (Ambient, Directional with shadows, Point Light).
 * - Floor box mesh dynamically colored by selectedFloor.
 * - Four wall planes oriented inwards (Back, Left, Right, Front) so they cull
 *   automatically when the camera is outside the room looking in.
 * - Dynamic 3D model list from furnitureItems.
 */
export default function RoomCanvas3D({
  wallColor,
  selectedFloor,
  furnitureItems = [],
}) {
  const floorColor = getFloorColor(selectedFloor?.id);

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
          
          {/* Floor Box (0.1 units thick to give clean edges) */}
          <mesh receiveShadow position={[0, -0.05, 0]}>
            <boxGeometry args={[6, 0.1, 5]} />
            <meshStandardMaterial
              color={floorColor}
              roughness={0.5}
              metalness={0.05}
            />
          </mesh>

          {/* Floor wireframe outline to enhance modern dsiplay aesthetics */}
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[6.01, 0.11, 5.01]} />
            <meshBasicMaterial color="#78716c" wireframe transparent opacity={0.1} />
          </mesh>

          {/* ── 4 Walls (Inward-facing single-sided planes) ── */}
          
          {/* Back Wall (Facing +Z) */}
          <mesh receiveShadow position={[0, 1.5, -2.5]}>
            <planeGeometry args={[6, 3]} />
            <meshStandardMaterial
              color={wallColor}
              roughness={0.8}
              side={THREE.FrontSide}
            />
          </mesh>

          {/* Left Wall (Facing +X) */}
          <mesh receiveShadow position={[-3, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[5, 3]} />
            <meshStandardMaterial
              color={wallColor}
              roughness={0.8}
              side={THREE.FrontSide}
            />
          </mesh>

          {/* Right Wall (Facing -X) */}
          <mesh receiveShadow position={[3, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[5, 3]} />
            <meshStandardMaterial
              color={wallColor}
              roughness={0.8}
              side={THREE.FrontSide}
            />
          </mesh>

          {/* Front Wall (Facing -Z) — Culled when viewed from outside, visible if camera goes inside */}
          <mesh position={[0, 1.5, 2.5]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[6, 3]} />
            <meshStandardMaterial
              color={wallColor}
              roughness={0.8}
              side={THREE.FrontSide}
            />
          </mesh>

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
            {/* Window Frame (Outer trim) */}
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

          {/* ── Furniture Models ── */}
          {furnitureItems.map((instance) => (
            <FurnitureModel3D
              key={instance.instanceId}
              instance={instance}
            />
          ))}
        </group>

        {/* ── Orbit Camera Controls ── */}
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
