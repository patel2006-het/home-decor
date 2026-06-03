import React from "react";
import { useDesign } from "@/context/DesignContext";

// Simple mapping from Kelvin color temperature to hex color codes
export function getKelvinColor(kelvin) {
  if (kelvin < 2500) return "#ff8d1e"; // warm candle
  if (kelvin < 3500) return "#ffb76b"; // cozy amber
  if (kelvin < 4500) return "#ffe3c2"; // warm white
  if (kelvin < 5500) return "#faf8f6"; // neutral daylight
  if (kelvin < 7000) return "#e3edff"; // cool white
  return "#bcccff"; // sky blue cool
}

/**
 * RoomLighting — Renders realistic lights for the 3D interior design room scene.
 *
 * Configures:
 * - Ambient Light: overall scene fill.
 * - Directional Light: primary key light casting shadow maps.
 * - Point Light: secondary soft fill to enhance depth and reduce harsh shadows.
 */
export default function RoomLighting() {
  const { globalLighting } = useDesign();

  const ambientColor = getKelvinColor(globalLighting.ambientTemp);

  return (
    <group>
      {/* Ambient Light for general fill */}
      <ambientLight
        intensity={globalLighting.ambientIntensity}
        color={ambientColor}
      />

      {/* Key directional light cast from top-right-front to create depth and shadows */}
      <directionalLight
        position={[6, 9, 6]}
        intensity={globalLighting.directionalIntensity}
        castShadow={globalLighting.shadowsEnabled}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={25}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />

      {/* Soft point light in the back left corner to reduce harsh pitch-black shadow angles */}
      <pointLight position={[-4, 2.2, -2]} intensity={0.4} />
    </group>
  );
}
