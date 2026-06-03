"use client";

import React from "react";

/**
 * WindowModel — Renders a 3D window frame, dividers, and glass panes.
 * 
 * Supports customizable frame colors and glass transparency.
 *
 * @param {object} props
 * @param {object} props.instance - The window instance details
 * @param {string} [props.frameColor="#ffffff"] - Outer and inner frame color
 * @param {string} [props.glassColor="#bae6fd"] - Color of the glass pane
 * @param {number} [props.glassOpacity=0.4] - Opacity of the glass (0.0 to 1.0)
 */
export default function WindowModel({
  instance,
  frameColor = "#ffffff",
  glassColor = "#bae6fd",
  glassOpacity = 0.4,
}) {
  const { width, height } = instance;

  const w3D = (width ?? 120) / 100;
  const h3D = (height ?? 150) / 100;
  const frameThickness = 0.05;

  return (
    <group name="WindowModel">
      {/* 1. Glass Pane (Transparent, metallic) */}
      <mesh position={[0, h3D / 2, 0]}>
        <planeGeometry args={[w3D, h3D]} />
        <meshStandardMaterial
          color={glassColor}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={glassOpacity}
        />
      </mesh>

      {/* 2. Window Frame Trim */}
      {/* Left Trim */}
      <mesh castShadow receiveShadow position={[-w3D / 2 - frameThickness / 2, h3D / 2, 0]}>
        <boxGeometry args={[frameThickness, h3D + frameThickness * 2, 0.08]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>

      {/* Right Trim */}
      <mesh castShadow receiveShadow position={[w3D / 2 + frameThickness / 2, h3D / 2, 0]}>
        <boxGeometry args={[frameThickness, h3D + frameThickness * 2, 0.08]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>

      {/* Bottom Trim */}
      <mesh castShadow receiveShadow position={[0, -frameThickness / 2, 0]}>
        <boxGeometry args={[w3D, frameThickness, 0.12]} /> {/* thicker bottom sill */}
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>

      {/* Top Trim */}
      <mesh castShadow receiveShadow position={[0, h3D + frameThickness / 2, 0]}>
        <boxGeometry args={[w3D, frameThickness, 0.08]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>

      {/* 3. Window Mullions (Inner Dividers - 4 quadrants) */}
      {/* Vertical divider */}
      <mesh castShadow position={[0, h3D / 2, 0.01]}>
        <boxGeometry args={[0.03, h3D, 0.04]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>

      {/* Horizontal divider */}
      <mesh castShadow position={[0, h3D / 2, 0.01]}>
        <boxGeometry args={[w3D, 0.03, 0.04]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} />
      </mesh>
    </group>
  );
}
