"use client";

import React from "react";

/**
 * Reusable 3D light fixture models.
 * Each component receives a `glowColor` to dynamically style its glowing parts in real time.
 */

// 1. Ceiling Light (Recessed downlight bezel + glowing diffuser disc)
export function CeilingLightModel({ glowColor = "#ffdaaa" }) {
  return (
    <group name="CeilingLightModel">
      {/* Outer recessed trim ring */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      {/* Central emissive diffuser */}
      <mesh position={[0, -0.002, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.015, 16]} />
        <meshStandardMaterial color="#ffffff" emissive={glowColor} emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
}

// 2. Chandelier (Ceiling mount flange, suspension rods, brass ring, and bulbs)
export function ChandelierModel({ glowColor = "#ffdaaa" }) {
  return (
    <group name="ChandelierModel">
      {/* Ceiling mounting plate */}
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 12]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Central support rods */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.75, 8]} />
        <meshStandardMaterial color="#262626" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Decorative brass ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.35, 0.02, 8, 24]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* 6 glowing bulbs placed around the ring */}
      {[0, 1, 2, 3, 4, 5].map((idx) => {
        const angle = (idx * Math.PI) / 3;
        const x = Math.cos(angle) * 0.35;
        const z = Math.sin(angle) * 0.35;
        return (
          <group key={idx} position={[x, 0.02, z]}>
            {/* Tiny brass holder socket */}
            <mesh position={[0, -0.01, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.03, 8]} />
              <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Light bulb globe */}
            <mesh position={[0, 0.02, 0]}>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshStandardMaterial color="#ffffff" emissive={glowColor} emissiveIntensity={3.0} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// 3. Wall Sconce Light (Vertical brushed metal tube throwing up/down glow)
export function WallLightModel({ glowColor = "#ffdaaa" }) {
  return (
    <group name="WallLightModel">
      {/* Wall mount backplate */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[0.06, 0.12, 0.02]} />
        <meshStandardMaterial color="#1f1f1f" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Sconce metal bracket cylinder */}
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 16]} />
        <meshStandardMaterial color="#b0bec5" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Upward glowing light emitter */}
      <mesh position={[0, 0.152, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.005, 16]} />
        <meshStandardMaterial color="#ffffff" emissive={glowColor} emissiveIntensity={2.5} />
      </mesh>
      {/* Downward glowing light emitter */}
      <mesh position={[0, -0.152, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.005, 16]} />
        <meshStandardMaterial color="#ffffff" emissive={glowColor} emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
}

// 4. Floor Lamp (Tall black metal stand + white fabric drum shade + bulb)
export function FloorLampModel({ glowColor = "#ffdaaa" }) {
  return (
    <group name="FloorLampModel">
      {/* Round steel base plate */}
      <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.03, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Vertical iron stand pole */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 1.46, 8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Top support arm */}
      <mesh position={[0.05, 1.47, 0]}>
        <boxGeometry args={[0.1, 0.02, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Fabric drum shade */}
      <mesh castShadow position={[0.1, 1.3, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.34, 16]} />
        <meshStandardMaterial color="#faf9f6" roughness={0.9} />
      </mesh>
      {/* Emissive bulb inside shade */}
      <mesh position={[0.1, 1.25, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive={glowColor} emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
}

// 5. Table Lamp (Round ceramic base + flared cloth shade + glowing bulb)
export function TableLampModel({ glowColor = "#ffdaaa" }) {
  return (
    <group name="TableLampModel">
      {/* Round ceramic pot base */}
      <mesh castShadow position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.22, 16]} />
        <meshStandardMaterial color="#556b2f" roughness={0.15} metalness={0.1} /> {/* glazed olive green */}
      </mesh>
      {/* Socket ring */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Flared fabric shade */}
      <mesh castShadow position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.1, 0.16, 0.26, 16]} />
        <meshStandardMaterial color="#fafaf7" roughness={0.9} />
      </mesh>
      {/* Glowing light bulb */}
      <mesh position={[0, 0.34, 0]}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshStandardMaterial color="#ffffff" emissive={glowColor} emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
}

// 6. LED Strip (Linear glowing track with an emissive face)
export function LEDStripModel({ glowColor = "#ffdaaa" }) {
  return (
    <group name="LEDStripModel">
      {/* Aluminum mounting bar */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.025, 0.025]} />
        <meshStandardMaterial color="#cfd8dc" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* High-intensity emissive strip */}
      <mesh position={[0, 0, 0.013]}>
        <boxGeometry args={[1.18, 0.014, 0.004]} />
        <meshStandardMaterial color="#ffffff" emissive={glowColor} emissiveIntensity={3.5} />
      </mesh>
    </group>
  );
}
