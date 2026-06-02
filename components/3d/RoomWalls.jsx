import React from "react";
import * as THREE from "three";

/**
 * RoomWalls — Renders 4 single-sided walls and a ceiling.
 *
 * Implements inwards-facing planes so they auto-cull when viewed from outside the room box,
 * allowing OrbitControls to easily inspect the room contents.
 *
 * @param {object} props
 * @param {string} props.wallColor - The active wall color hex code from state
 */
export default function RoomWalls({ wallColor }) {
  return (
    <group>
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

      {/* Front Wall (Facing -Z) — Culled from outside, visible if camera goes inside */}
      <mesh position={[0, 1.5, 2.5]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial
          color={wallColor}
          roughness={0.8}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* ── Ceiling (Facing -Y / Downwards) ── */}
      {/* Culled when viewed from above (outside), visible from the inside looking up */}
      <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial
          color="#FAF8F5"
          roughness={0.9}
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
        {/* Outer trim frame */}
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
    </group>
  );
}
