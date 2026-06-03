import React, { useMemo } from "react";
import { generateWoodTexture } from "@/components/3d/textureGenerator";

/**
 * DoorModel — Renders a 3D door frame, panel, and handle.
 * 
 * Supports customizable colors and materials to prepare for future design customization.
 *
 * @param {object} props
 * @param {object} props.instance - The placed door instance configuration
 * @param {string} [props.frameColor="#FAF8F5"] - Color of the door frame
 * @param {string} [props.panelColor] - Color of the door panel
 */
export default function DoorModel({
  instance,
  frameColor = "#FAF8F5",
  panelColor,
}) {
  const { color, width, height, material } = instance;

  const w3D = (width ?? 90) / 100;
  const h3D = (height ?? 200) / 100;

  // Read panel and frame configurations from instance material or default
  const activePanelColor = material?.panelColor || panelColor || color || "#8D6E63";
  const activeFrameColor = material?.frameColor || frameColor || "#FAF8F5";

  // Generate wood texture if wood panel type is selected
  const woodTexture = useMemo(() => {
    if (material?.type === "wood") {
      return generateWoodTexture(activePanelColor);
    }
    return null;
  }, [material?.type, activePanelColor]);

  return (
    <group name="DoorModel">
      {/* 1. Door Frame (Left, Right, Top trim) */}
      {/* Left Frame */}
      <mesh castShadow receiveShadow position={[-w3D / 2 - 0.04, h3D / 2, 0]}>
        <boxGeometry args={[0.08, h3D + 0.04, 0.12]} />
        <meshStandardMaterial color={activeFrameColor} roughness={0.7} />
      </mesh>

      {/* Right Frame */}
      <mesh castShadow receiveShadow position={[w3D / 2 + 0.04, h3D / 2, 0]}>
        <boxGeometry args={[0.08, h3D + 0.04, 0.12]} />
        <meshStandardMaterial color={activeFrameColor} roughness={0.7} />
      </mesh>

      {/* Top Frame */}
      <mesh castShadow receiveShadow position={[0, h3D + 0.02, 0]}>
        <boxGeometry args={[w3D + 0.16, 0.04, 0.12]} />
        <meshStandardMaterial color={activeFrameColor} roughness={0.7} />
      </mesh>

      {/* 2. Main Door Panel */}
      <mesh castShadow receiveShadow position={[0, h3D / 2, -0.02]}>
        <boxGeometry args={[w3D, h3D, 0.04]} />
        <meshStandardMaterial
          map={woodTexture}
          color={woodTexture ? "#ffffff" : activePanelColor}
          roughness={material?.roughness ?? (material?.type === "wood" ? 0.6 : 0.5)}
          metalness={material?.metalness ?? 0.1}
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
