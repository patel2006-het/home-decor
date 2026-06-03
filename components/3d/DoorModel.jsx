"use client";

import React from "react";

/**
 * DoorModel — Renders a 3D door frame, panel, and handle.
 * 
 * Supports customizable colors and materials to prepare for future design customization.
 *
 * @param {object} props
 * @param {object} props.instance - The placed door instance configuration
 * @param {string} [props.frameColor="#FAF8F5"] - Color of the door frame
 * @param {string} [props.panelColor="#8D6E63"] - Color of the door panel (defaults to wood tone)
 */
export default function DoorModel({
  instance,
  frameColor = "#FAF8F5",
  panelColor,
}) {
  const { color, width, height } = instance;

  const w3D = (width ?? 90) / 100;
  const h3D = (height ?? 200) / 100;
  const activePanelColor = panelColor || color || "#8D6E63";

  return (
    <group name="DoorModel">
      {/* 1. Door Frame (Left, Right, Top trim) */}
      {/* Left Frame */}
      <mesh castShadow receiveShadow position={[-w3D / 2 - 0.04, h3D / 2, 0]}>
        <boxGeometry args={[0.08, h3D + 0.04, 0.12]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>

      {/* Right Frame */}
      <mesh castShadow receiveShadow position={[w3D / 2 + 0.04, h3D / 2, 0]}>
        <boxGeometry args={[0.08, h3D + 0.04, 0.12]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>

      {/* Top Frame */}
      <mesh castShadow receiveShadow position={[0, h3D + 0.02, 0]}>
        <boxGeometry args={[w3D + 0.16, 0.04, 0.12]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>

      {/* 2. Main Door Panel */}
      <mesh castShadow receiveShadow position={[0, h3D / 2, -0.02]}>
        <boxGeometry args={[w3D, h3D, 0.04]} />
        <meshStandardMaterial
          color={activePanelColor}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* 3. Door Handle (Brass/Gold metal) */}
      <group position={[w3D / 2 - 0.12, h3D / 2, 0.02]}>
        {/* Handle stem */}
        <mesh castShadow position={[0, 0, -0.015]}>
          <cylinderGeometry args={[0.01, 0.01, 0.03]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Handle lever */}
        <mesh castShadow position={[0.04, 0, 0]}>
          <boxGeometry args={[0.08, 0.015, 0.01]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}
