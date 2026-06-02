import React from "react";

/**
 * RoomLighting — Renders realistic lights for the 3D interior design room scene.
 *
 * Configures:
 * - Ambient Light: overall scene fill.
 * - Directional Light: primary key light casting shadow maps.
 * - Point Light: secondary soft fill to enhance depth and reduce harsh shadows.
 */
export default function RoomLighting() {
  return (
    <group>
      {/* Ambient Light for general fill */}
      <ambientLight intensity={0.55} />

      {/* Key directional light cast from top-right-front to create depth and shadows */}
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

      {/* Soft point light in the back left corner to reduce harsh pitch-black shadow angles */}
      <pointLight position={[-4, 2.2, -2]} intensity={0.4} />
    </group>
  );
}
