import React from "react";

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
 * RoomFloor — Renders the 3D Floor plane with grid alignment helper.
 *
 * @param {object} props
 * @param {object} props.selectedFloor - The active floor configuration from state
 */
export default function RoomFloor({ selectedFloor }) {
  const floorColor = getFloorColor(selectedFloor?.id);

  return (
    <group>
      {/* Floor Box (0.1 units thick to give clean edges) */}
      <mesh receiveShadow position={[0, -0.05, 0]}>
        <boxGeometry args={[6, 0.1, 5]} />
        <meshStandardMaterial
          color={floorColor}
          roughness={0.5}
          metalness={0.05}
        />
      </mesh>

      {/* Modern technical design grid helper */}
      <gridHelper
        args={[6, 6, "#78716c", "#d6d3d1"]}
        position={[0, 0.01, 0]}
      />
    </group>
  );
}
