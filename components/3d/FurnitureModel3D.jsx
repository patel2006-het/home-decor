import React, { useRef } from "react";
import { Html } from "@react-three/drei";
// In the future, import useGLTF to load standard GLTF/GLB models:
// import { useGLTF } from "@react-three/drei";

/**
 * FurnitureModel3D — Renders a placed furniture instance in 3D space.
 *
 * Scalable Architecture:
 * - Built to receive 3D transform properties: position, rotation, scale.
 * - Ready to load external .glb models using Drei's useGLTF hook.
 * - Falls back to a bounding box layout with floating HTML details.
 *
 * @param {object} props
 * @param {object} props.instance - The placed furniture instance configuration
 */
export default function FurnitureModel3D({ instance }) {
  const { id, name, category, icon, color, width, height, position, rotation, scale, modelUrl } = instance;
  const meshRef = useRef();

  // 1. Resolve 3D Transform Properties (Requirement 10)
  
  // Positioning: Translate percentage position { x, y } to 3D X-Z floor coordinates.
  // Room coordinates in 3D: Floor size = Width 6 x Depth 5.
  // X axis: [-2.7, 2.7], Z axis: [-2.2, 2.2].
  const pctX = position?.x ?? 50;
  const pctY = position?.y ?? 50;
  const x3D = (pctX / 100) * 5.4 - 2.7;
  const z3D = (pctY / 100) * 4.4 - 2.2;
  
  // Custom height scaling
  const w3D = (width ?? 100) / 100;
  const h3D = (height ?? 70) / 100;
  let d3D = 0.6; // Default depth

  if (category === "Sleeping") d3D = 1.8; // Bed
  else if (category === "Seating") d3D = 0.8; // Sofa
  else if (category === "Tables") d3D = 0.9;
  else if (category === "Storage") d3D = 0.5;
  else if (category === "Decor") d3D = 0.1;

  const isWallMounted = category === "Decor" && (id.includes("mirror") || id.includes("cabinet"));
  const y3D = isWallMounted ? 1.5 : h3D / 2;

  // Resolve vectors
  const finalPosition = [x3D, y3D, z3D];
  // Rotation: Supports custom rotation array [x, y, z] or fallback [0,0,0]
  const finalRotation = rotation ? [rotation.x, rotation.y, rotation.z] : [0, 0, 0];
  // Scaling: Supports custom scale array [x, y, z] or fallback to unit scale
  const finalScale = scale ? [scale.x, scale.y, scale.z] : [1, 1, 1];

  // 2. Future GLB Loading Hook Template (Requirement 10 & 8)
  // When a .glb file is available at modelUrl (e.g. "/models/sofa.glb"):
  //
  // const { scene } = useGLTF(modelUrl);
  // if (modelUrl) {
  //   return (
  //     <primitive
  //       object={scene.clone()}
  //       position={finalPosition}
  //       rotation={finalRotation}
  //       scale={finalScale}
  //       castShadow
  //       receiveShadow
  //     />
  //   );
  // }

  return (
    <group position={finalPosition} rotation={finalRotation} scale={finalScale}>
      {/* Fallback Bounding Box Mesh */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[w3D, h3D, d3D]} />
        <meshStandardMaterial
          color={color || "#C4A882"}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Wireframe border outline */}
      <mesh>
        <boxGeometry args={[w3D + 0.01, h3D + 0.01, d3D + 0.01]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.12} />
      </mesh>

      {/* Floating HTML label sprite */}
      <Html
        distanceFactor={6}
        position={[0, h3D / 2 + 0.35, 0]}
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
