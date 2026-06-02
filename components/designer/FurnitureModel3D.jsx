import React, { useRef } from "react";
import { Html } from "@react-three/drei";

/**
 * FurnitureModel3D — renders a placed furniture instance in 3D space.
 *
 * Scalable Architecture:
 * - Currently renders a styled 3D Box mesh representing the bounds of the item
 *   with a floating HTML emoji/label tag.
 * - Ready to load .glb files dynamically in the future using Drei's useGLTF.
 *
 * @param {object} props
 * @param {object} props.instance - Placed furniture instance from context
 */
export default function FurnitureModel3D({ instance }) {
  const { id, name, category, icon, color, width, height, position } = instance;
  const meshRef = useRef();

  // Convert 2D pixel bounds to 3D meter units
  const w3D = (width ?? 100) / 100;
  const h3D = (height ?? 70) / 100;

  // Custom depth based on category
  let d3D = 0.6;
  if (category === "Sleeping") d3D = 1.8; // Bed
  else if (category === "Seating") d3D = 0.8; // Sofa
  else if (category === "Tables") d3D = 0.9;
  else if (category === "Storage") d3D = 0.5;
  else if (category === "Decor") d3D = 0.1; // Thin wall objects

  // Map 2D percentage coordinate grid [5, 95] to 3D coordinates relative to room dimensions.
  // Room size in 3D: Width=6, Height=3, Depth=5.
  // Floor goes from X: [-2.7, 2.7], Z: [-2.2, 2.2].
  const pctX = position?.x ?? 50;
  const pctY = position?.y ?? 50; // In 2D, Y was vertical, but in 3D it corresponds to floor depth (Z)

  const x3D = (pctX / 100) * 5.4 - 2.7;
  const z3D = (pctY / 100) * 4.4 - 2.2;

  // Height (Y) placement:
  // Most items rest on the floor (floor is at y = 0).
  // Wall-mounted items (like Mirrors or upper cabinets) float higher on the back wall.
  const isWallMounted = category === "Decor" && (id.includes("mirror") || id.includes("cabinet"));
  const y3D = isWallMounted ? 1.5 : h3D / 2;

  // Scalable .glb loader hook placeholder:
  // If this item had a model GLB path (e.g. instance.modelUrl), you would load it like:
  // const { scene } = useGLTF(instance.modelUrl);
  // return <primitive object={scene} position={[x3D, y3D, z3D]} />

  return (
    <group position={[x3D, y3D, z3D]}>
      {/* 3D Representation Box */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[w3D, h3D, d3D]} />
        <meshStandardMaterial
          color={color || "#C4A882"}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Wireframe border for a polished, technical design look */}
      <mesh>
        <boxGeometry args={[w3D + 0.01, h3D + 0.01, d3D + 0.01]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.15} />
      </mesh>

      {/* HTML Tag overlay containing the Emoji Icon and Name label */}
      <Html
        distanceFactor={6}
        position={[0, h3D / 2 + 0.3, 0]}
        center
        className="pointer-events-none select-none"
      >
        <div className="flex flex-col items-center gap-1">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-lg shadow-md"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
          <span className="whitespace-nowrap rounded-md bg-stone-900/80 px-2 py-0.5 text-[10px] font-medium text-white shadow">
            {name}
          </span>
        </div>
      </Html>
    </group>
  );
}
