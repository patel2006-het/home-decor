"use client";

import React from "react";

/**
 * CurtainModel — Renders a 3D horizontal curtain rod and two wavy fabric panels.
 * 
 * Fabric panels are constructed using a series of vertical cylinders to simulate draped folds.
 * Exposes color and material properties to prepare for future texture/material updates.
 *
 * @param {object} props
 * @param {object} props.instance - The curtain instance config
 * @param {string} [props.rodColor="#b0bec5"] - Curtain rod metal color
 * @param {string} [props.fabricColor] - Custom fabric color (falls back to item color or linen)
 */
export default function CurtainModel({
  instance,
  rodColor = "#cfd8dc",
  fabricColor,
}) {
  const { color, width, height } = instance;

  const w3D = (width ?? 140) / 100;
  const h3D = (height ?? 160) / 100;
  const activeFabricColor = fabricColor || color || "#ECEFF1";

  // Create fabric folds programmatically to achieve a premium "wavy" look
  const foldCount = 6;
  const foldWidth = 0.08;
  const panelWidth = w3D * 0.35; // Each curtain panel covers 35% of the rod width

  const leftPanelFolds = Array.from({ length: foldCount }).map((_, idx) => {
    // Distribute folds from -w3D/2 to -w3D/2 + panelWidth
    const startX = -w3D / 2;
    const step = panelWidth / (foldCount - 1);
    const xPos = startX + idx * step;
    // Alternate depth slightly to create a wave pattern (sin/cos)
    const zPos = Math.sin(idx * (Math.PI / 2)) * 0.02 + 0.03;
    return { id: `l-fold-${idx}`, x: xPos, z: zPos };
  });

  const rightPanelFolds = Array.from({ length: foldCount }).map((_, idx) => {
    // Distribute folds from w3D/2 - panelWidth to w3D/2
    const startX = w3D / 2 - panelWidth;
    const step = panelWidth / (foldCount - 1);
    const xPos = startX + idx * step;
    const zPos = Math.sin(idx * (Math.PI / 2)) * 0.02 + 0.03;
    return { id: `r-fold-${idx}`, x: xPos, z: zPos };
  });

  return (
    <group name="CurtainModel">
      {/* 1. Curtain Rod (Extend slightly wider than fabric width) */}
      <mesh castShadow position={[0, h3D, 0.06]}>
        <cylinderGeometry args={[0.015, 0.015, w3D + 0.2]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color={rodColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Wall Brackets (Left/Right ends of rod) */}
      <mesh castShadow position={[-w3D / 2 - 0.08, h3D, 0.03]}>
        <cylinderGeometry args={[0.012, 0.012, 0.06]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color={rodColor} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh castShadow position={[w3D / 2 + 0.08, h3D, 0.03]}>
        <cylinderGeometry args={[0.012, 0.012, 0.06]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color={rodColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 2. Left Curtain Panel Folds */}
      <group>
        {leftPanelFolds.map((fold) => (
          <mesh key={fold.id} castShadow position={[fold.x, h3D / 2, fold.z]}>
            {/* Vertical cylinder simulating a fabric fold */}
            <cylinderGeometry args={[foldWidth / 2, foldWidth / 2, h3D, 8]} />
            <meshStandardMaterial
              color={activeFabricColor}
              roughness={0.9}
              metalness={0.0}
            />
          </mesh>
        ))}
      </group>

      {/* 3. Right Curtain Panel Folds */}
      <group>
        {rightPanelFolds.map((fold) => (
          <mesh key={fold.id} castShadow position={[fold.x, h3D / 2, fold.z]}>
            <cylinderGeometry args={[foldWidth / 2, foldWidth / 2, h3D, 8]} />
            <meshStandardMaterial
              color={activeFabricColor}
              roughness={0.9}
              metalness={0.0}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
