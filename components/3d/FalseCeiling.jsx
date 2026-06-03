"use client";

import React from "react";

/**
 * FalseCeiling — Renders a luxury tiered ceiling diorama.
 *
 * Consists of an outer border frame, a recessed center board, and an
 * emissive yellow/warm glow strip simulating LED cove lighting.
 * Fits the room dimensions: Width 6 x Depth 5, sitting at Y = 3.
 */
export default function FalseCeiling() {
  const borderThickness = 0.6; // width of the ceiling border
  const borderHeight = 0.15; // drop depth
  const roomW = 6;
  const roomD = 5;

  return (
    <group name="FalseCeiling">
      {/* 1. Outer Border Trim Panels (Gypsum board dropping down from ceiling plane) */}
      {/* Back Border */}
      <mesh castShadow receiveShadow position={[0, 3 - borderHeight / 2, -roomD / 2 + borderThickness / 2]}>
        <boxGeometry args={[roomW, borderHeight, borderThickness]} />
        <meshStandardMaterial color="#FAF8F5" roughness={0.9} />
      </mesh>

      {/* Front Border */}
      <mesh castShadow receiveShadow position={[0, 3 - borderHeight / 2, roomD / 2 - borderThickness / 2]}>
        <boxGeometry args={[roomW, borderHeight, borderThickness]} />
        <meshStandardMaterial color="#FAF8F5" roughness={0.9} />
      </mesh>

      {/* Left Border */}
      <mesh castShadow receiveShadow position={[-roomW / 2 + borderThickness / 2, 3 - borderHeight / 2, 0]}>
        <boxGeometry args={[borderThickness, borderHeight, roomD - borderThickness * 2]} />
        <meshStandardMaterial color="#FAF8F5" roughness={0.9} />
      </mesh>

      {/* Right Border */}
      <mesh castShadow receiveShadow position={[roomW / 2 - borderThickness / 2, 3 - borderHeight / 2, 0]}>
        <boxGeometry args={[borderThickness, borderHeight, roomD - borderThickness * 2]} />
        <meshStandardMaterial color="#FAF8F5" roughness={0.9} />
      </mesh>

      {/* 2. Central Recessed Ceiling Panel (Shifted upwards to Y = 3.0) */}
      <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomW - borderThickness * 2, roomD - borderThickness * 2]} />
        <meshStandardMaterial color="#FAF8F5" roughness={0.9} />
      </mesh>

      {/* 3. Cove Lighting Strips (Warm emissive mesh lines sitting inside the tiered edge) */}
      {/* Back glow strip */}
      <mesh position={[0, 3 - borderHeight + 0.02, -roomD / 2 + borderThickness + 0.01]}>
        <boxGeometry args={[roomW - borderThickness * 2, 0.015, 0.02]} />
        <meshStandardMaterial
          color="#ffedd5"
          emissive="#ffcc80"
          emissiveIntensity={3.0}
          roughness={0.9}
        />
      </mesh>

      {/* Front glow strip */}
      <mesh position={[0, 3 - borderHeight + 0.02, roomD / 2 - borderThickness - 0.01]}>
        <boxGeometry args={[roomW - borderThickness * 2, 0.015, 0.02]} />
        <meshStandardMaterial
          color="#ffedd5"
          emissive="#ffcc80"
          emissiveIntensity={3.0}
          roughness={0.9}
        />
      </mesh>

      {/* Left glow strip */}
      <mesh position={[-roomW / 2 + borderThickness + 0.01, 3 - borderHeight + 0.02, 0]}>
        <boxGeometry args={[0.02, 0.015, roomD - borderThickness * 2 - 0.04]} />
        <meshStandardMaterial
          color="#ffedd5"
          emissive="#ffcc80"
          emissiveIntensity={3.0}
          roughness={0.9}
        />
      </mesh>

      {/* Right glow strip */}
      <mesh position={[roomW / 2 - borderThickness - 0.01, 3 - borderHeight + 0.02, 0]}>
        <boxGeometry args={[0.02, 0.015, roomD - borderThickness * 2 - 0.04]} />
        <meshStandardMaterial
          color="#ffedd5"
          emissive="#ffcc80"
          emissiveIntensity={3.0}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}
