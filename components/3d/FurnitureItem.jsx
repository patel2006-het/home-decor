import React, { useRef, useEffect, useState, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { TransformControls, Html } from "@react-three/drei";
import { useDesign } from "@/context/DesignContext";
import FurnitureLoader from "@/components/3d/FurnitureLoader";
import DoorModel from "@/components/3d/DoorModel";
import WindowModel from "@/components/3d/WindowModel";
import CurtainModel from "@/components/3d/CurtainModel";
import { getKelvinColor } from "./RoomLighting";
import {
  CeilingLightModel,
  ChandelierModel,
  WallLightModel,
  FloorLampModel,
  TableLampModel,
  LEDStripModel,
} from "./LightModels";

/**
 * FurnitureItem — Renders a placed furniture or light instance in 3D space.
 * 
 * Supports interactive dragging (translating), rotation, and scaling using Drei's TransformControls.
 * Syncs changes back to DesignContext on drag completion.
 * Falls back to a color-styled box mesh if GLB fails to load.
 */
export default function FurnitureItem({ instance }) {
  const {
    id,
    name,
    category,
    icon,
    color,
    width,
    height,
    position,
    rotation,
    scale,
    modelUrl,
  } = instance;

  const meshRef = useRef();
  const transformRef = useRef();
  const { controls } = useThree();

  const {
    selectedInstanceId,
    setSelectedInstanceId,
    transformMode,
    updateFurnitureTransform,
  } = useDesign();

  const isSelected = selectedInstanceId === instance.instanceId;

  // Resolve light properties
  const isLight = instance.isLight ?? false;
  const lightSettings = instance.lightSettings || { color: "#ffedd5", intensity: 1.5, temperature: 3000, range: 5 };
  
  const lightColor = useMemo(() => {
    return lightSettings.temperature ? getKelvinColor(lightSettings.temperature) : (lightSettings.color || "#ffedd5");
  }, [lightSettings.color, lightSettings.temperature]);

  // 1. Resolve 3D Transform Properties (matching current room engine constraints)
  // Room floor size: Width 6 x Depth 5. Boundaries: X [-2.7, 2.7], Z [-2.2, 2.2]
  const pctX = position?.x ?? 50;
  const pctY = position?.y ?? 50;

  const [coords, setCoords] = useState({ x: pctX, y: pctY });

  useEffect(() => {
    setCoords({ x: pctX, y: pctY });
  }, [pctX, pctY]);

  const x3D = (pctX / 100) * 5.4 - 2.7;
  const z3D = (pctY / 100) * 4.4 - 2.2;

  // Bounding box size defaults (for fallback / architectural scale)
  const w3D = (width ?? 100) / 100;
  const h3D = (height ?? 70) / 100;
  let d3D = 0.6; // Default depth

  if (category === "Sleeping") d3D = 1.8;
  else if (category === "Seating") d3D = 0.8;
  else if (category === "Tables") d3D = 0.9;
  else if (category === "Storage") d3D = 0.5;
  else if (category === "Decor") d3D = 0.1;
  else if (category === "Lighting") d3D = 0.3;

  const isWallMounted = category === "Decor" && (id.includes("mirror") || id.includes("cabinet"));
  
  // Architectural parameters
  const isArchitectural = instance.isArchitectural ?? false;
  const heightOffset = instance.heightOffset ?? (category === "Door" ? 0 : category === "Window" ? 1.0 : category === "Curtain" ? 1.2 : 0);
  const y3D = (isArchitectural || isLight) ? heightOffset : (isWallMounted ? 1.5 : 0);

  // Resolve vectors
  const finalPosition = [x3D, y3D, z3D];
  const finalRotation = rotation ? [rotation.x, rotation.y, rotation.z] : [0, 0, 0];
  const finalScale = scale ? [scale.x, scale.y, scale.z] : [1, 1, 1];

  // 2. Setup TransformControls Event Listeners
  useEffect(() => {
    if (!isSelected || !transformRef.current) return;

    const transformControls = transformRef.current;
    
    // Disable OrbitControls camera rotation when user starts dragging/interacting with the gizmo
    const handleDraggingChanged = (e) => {
      if (controls) {
        controls.enabled = !e.value;
      }
    };

    // Helper to calculate closest wall snap and restrict Y & X/Z rotation/scale
    const applyArchitecturalSnapping = (mesh) => {
      // Ceiling mounted light fixtures: free to slide horizontally, but Y height is locked
      if (instance.lightType === "ceiling" || instance.lightType === "chandelier") {
        mesh.position.x = Math.max(-2.7, Math.min(2.7, mesh.position.x));
        mesh.position.z = Math.max(-2.2, Math.min(2.2, mesh.position.z));
        mesh.position.y = instance.lightType === "ceiling" ? 2.95 : 2.2;
        mesh.rotation.set(0, 0, 0);
        return;
      }

      // 4 Wall Planes boundaries:
      // Back wall: Z = -2.5, X in [-3, 3]
      // Front wall: Z = 2.5, X in [-3, 3]
      // Left wall: X = -3, Z in [-2.5, 2.5]
      // Right wall: X = 3, Z in [-2.5, 2.5]
      const distBack = Math.abs(mesh.position.z - (-2.5));
      const distFront = Math.abs(mesh.position.z - 2.5);
      const distLeft = Math.abs(mesh.position.x - (-3));
      const distRight = Math.abs(mesh.position.x - 3);

      const minDist = Math.min(distBack, distFront, distLeft, distRight);

      if (minDist === distBack) {
        mesh.position.z = -2.48; // attach to back wall
        mesh.position.x = Math.max(-2.8, Math.min(2.8, mesh.position.x)); // clamp inside back wall
        mesh.rotation.y = 0; // face inward
      } else if (minDist === distFront) {
        mesh.position.z = 2.48; // attach to front wall
        mesh.position.x = Math.max(-2.8, Math.min(2.8, mesh.position.x)); // clamp inside front wall
        mesh.rotation.y = Math.PI; // face inward
      } else if (minDist === distLeft) {
        mesh.position.x = -2.98; // attach to left wall
        mesh.position.z = Math.max(-2.3, Math.min(2.3, mesh.position.z)); // clamp inside left wall
        mesh.rotation.y = Math.PI / 2; // face inward
      } else if (minDist === distRight) {
        mesh.position.x = 2.98; // attach to right wall
        mesh.position.z = Math.max(-2.3, Math.min(2.3, mesh.position.z)); // clamp inside right wall
        mesh.rotation.y = -Math.PI / 2; // face inward
      }

      // Height constraints:
      if (category === "Door") {
        mesh.position.y = 0; // Doors must stay on the floor
      } else if (category === "Window") {
        mesh.position.y = Math.max(0.3, Math.min(2.2, mesh.position.y)); // Windows float
      } else if (category === "Curtain") {
        mesh.position.y = Math.max(0.6, Math.min(2.6, mesh.position.y)); // Curtains hang
      } else if (instance.lightType === "wall") {
        mesh.position.y = Math.max(0.5, Math.min(2.5, mesh.position.y)); // Wall sconces float
      } else if (instance.lightType === "led-strip") {
        mesh.position.y = Math.max(0.01, Math.min(2.95, mesh.position.y)); // LED strip can run anywhere
      }

      // Force upright X/Z rotation
      mesh.rotation.x = 0;
      mesh.rotation.z = 0;

      // Scale limits [0.3, 3.0]
      mesh.scale.x = Math.max(0.3, Math.min(3.0, mesh.scale.x));
      mesh.scale.y = Math.max(0.3, Math.min(3.0, mesh.scale.y));
      mesh.scale.z = Math.max(0.3, Math.min(3.0, mesh.scale.z));
    };

    // When the user releases the gizmo, update the state in context
    const handleMouseUp = () => {
      if (meshRef.current) {
        const currentMesh = meshRef.current;
        
        if (isArchitectural || (isLight && instance.lightType !== "floor-lamp" && instance.lightType !== "table-lamp")) {
          applyArchitecturalSnapping(currentMesh);
        } else {
          // Clamp boundary limits
          const minX = -2.7;
          const maxX = 2.7;
          const minZ = -2.2;
          const maxZ = 2.2;

          if (currentMesh.position.x < minX) currentMesh.position.x = minX;
          if (currentMesh.position.x > maxX) currentMesh.position.x = maxX;
          if (currentMesh.position.z < minZ) currentMesh.position.z = minZ;
          if (currentMesh.position.z > maxZ) currentMesh.position.z = maxZ;

          currentMesh.position.y = isLight ? (instance.heightOffset ?? 0) : (isWallMounted ? 1.5 : 0);
          currentMesh.rotation.x = 0;
          currentMesh.rotation.z = 0;

          currentMesh.scale.x = Math.max(0.3, Math.min(3.0, currentMesh.scale.x));
          currentMesh.scale.y = Math.max(0.3, Math.min(3.0, currentMesh.scale.y));
          currentMesh.scale.z = Math.max(0.3, Math.min(3.0, currentMesh.scale.z));
        }

        // Convert the mesh's local position back to percentage-based coordinates
        const newPctX = Math.max(0, Math.min(100, ((currentMesh.position.x + 2.7) / 5.4) * 100));
        const newPctY = Math.max(0, Math.min(100, ((currentMesh.position.z + 2.2) / 4.4) * 100));

        // Extract rotation
        const newRot = {
          x: currentMesh.rotation.x,
          y: currentMesh.rotation.y,
          z: currentMesh.rotation.z,
        };

        // Extract scale
        const newScale = {
          x: currentMesh.scale.x,
          y: currentMesh.scale.y,
          z: currentMesh.scale.z,
        };

        const updateData = {
          position: { x: newPctX, y: newPctY },
          rotation: newRot,
          scale: newScale,
        };

        if (isArchitectural || isLight) {
          updateData.heightOffset = currentMesh.position.y;
        }

        // Sync changes back to DesignContext
        updateFurnitureTransform(instance.instanceId, updateData);
      }
    };

    // Track real-time coordinates during active dragging and enforce boundary limits
    const handleObjectChange = () => {
      if (meshRef.current) {
        const currentMesh = meshRef.current;
        
        if (isArchitectural || (isLight && instance.lightType !== "floor-lamp" && instance.lightType !== "table-lamp")) {
          applyArchitecturalSnapping(currentMesh);
        } else {
          // 1. Boundary Clamping
          const minX = -2.7;
          const maxX = 2.7;
          const minZ = -2.2;
          const maxZ = 2.2;

          if (currentMesh.position.x < minX) currentMesh.position.x = minX;
          if (currentMesh.position.x > maxX) currentMesh.position.x = maxX;
          if (currentMesh.position.z < minZ) currentMesh.position.z = minZ;
          if (currentMesh.position.z > maxZ) currentMesh.position.z = maxZ;

          // Force height
          currentMesh.position.y = isLight ? (instance.heightOffset ?? 0) : (isWallMounted ? 1.5 : 0);

          // 2. Rotation locks
          currentMesh.rotation.x = 0;
          currentMesh.rotation.z = 0;

          // 3. Scale Range limits
          currentMesh.scale.x = Math.max(0.3, Math.min(3.0, currentMesh.scale.x));
          currentMesh.scale.y = Math.max(0.3, Math.min(3.0, currentMesh.scale.y));
          currentMesh.scale.z = Math.max(0.3, Math.min(3.0, currentMesh.scale.z));
        }

        // 4. Update real-time coordinates HUD label
        const newPctX = Math.max(0, Math.min(100, ((currentMesh.position.x + 2.7) / 5.4) * 100));
        const newPctY = Math.max(0, Math.min(100, ((currentMesh.position.z + 2.2) / 4.4) * 100));
        setCoords({ x: newPctX, y: newPctY });
      }
    };

    transformControls.addEventListener("dragging-changed", handleDraggingChanged);
    transformControls.addEventListener("mouseUp", handleMouseUp);
    transformControls.addEventListener("objectChange", handleObjectChange);

    return () => {
      transformControls.removeEventListener("dragging-changed", handleDraggingChanged);
      transformControls.removeEventListener("mouseUp", handleMouseUp);
      transformControls.removeEventListener("objectChange", handleObjectChange);
    };
  }, [isSelected, controls, instance.instanceId, updateFurnitureTransform, isWallMounted, isArchitectural, category, isLight, instance.lightType, instance.heightOffset]);

  // Fallback Mesh (renders if GLB is missing, loading, or fails)
  const fallbackMesh = (
    <group>
      <mesh castShadow receiveShadow position={[0, h3D / 2, 0]}>
        <boxGeometry args={[w3D, h3D, d3D]} />
        <meshStandardMaterial
          color={color || "#C4A882"}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      {/* Wireframe border outline */}
      <mesh position={[0, h3D / 2, 0]}>
        <boxGeometry args={[w3D + 0.01, h3D + 0.01, d3D + 0.01]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );

  const modelMesh = (
    <group
      ref={meshRef}
      position={finalPosition}
      rotation={finalRotation}
      scale={finalScale}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedInstanceId(instance.instanceId);
      }}
    >
      {isLight ? (
        <group>
          {instance.lightType === "ceiling" && (
            <>
              <CeilingLightModel glowColor={lightColor} />
              <pointLight
                castShadow
                color={lightColor}
                intensity={lightSettings.intensity * 1.5}
                distance={lightSettings.range || 5}
                decay={1.8}
                position={[0, -0.05, 0]}
              />
            </>
          )}
          {instance.lightType === "chandelier" && (
            <>
              <ChandelierModel glowColor={lightColor} />
              <pointLight
                castShadow
                color={lightColor}
                intensity={lightSettings.intensity * 1.2}
                distance={lightSettings.range || 6}
                decay={1.8}
                position={[0, 0, 0]}
              />
            </>
          )}
          {instance.lightType === "wall" && (
            <>
              <WallLightModel glowColor={lightColor} />
              <pointLight
                castShadow
                color={lightColor}
                intensity={lightSettings.intensity}
                distance={lightSettings.range || 4}
                decay={1.8}
                position={[0, 0, 0.05]}
              />
            </>
          )}
          {instance.lightType === "floor-lamp" && (
            <>
              <FloorLampModel glowColor={lightColor} />
              <pointLight
                castShadow
                color={lightColor}
                intensity={lightSettings.intensity}
                distance={lightSettings.range || 5}
                decay={1.8}
                position={[0.1, 1.25, 0]}
              />
            </>
          )}
          {instance.lightType === "table-lamp" && (
            <>
              <TableLampModel glowColor={lightColor} />
              <pointLight
                castShadow
                color={lightColor}
                intensity={lightSettings.intensity}
                distance={lightSettings.range || 4}
                decay={1.8}
                position={[0, 0.35, 0]}
              />
            </>
          )}
          {instance.lightType === "led-strip" && (
            <>
              <LEDStripModel glowColor={lightColor} />
              <pointLight
                color={lightColor}
                intensity={lightSettings.intensity * 0.8}
                distance={lightSettings.range || 3}
                decay={1.8}
                position={[-0.3, 0, 0.02]}
              />
              <pointLight
                color={lightColor}
                intensity={lightSettings.intensity * 0.8}
                distance={lightSettings.range || 3}
                decay={1.8}
                position={[0.3, 0, 0.02]}
              />
            </>
          )}
        </group>
      ) : isArchitectural ? (
        <group>
          {category === "Door" && <DoorModel instance={instance} />}
          {category === "Window" && <WindowModel instance={instance} />}
          {category === "Curtain" && <CurtainModel instance={instance} />}
        </group>
      ) : (
        <FurnitureLoader modelUrl={modelUrl} fallback={fallbackMesh} />
      )}

      {/* Floating HTML label sprite */}
      <Html
        distanceFactor={6}
        position={[0, h3D + 0.35, 0]}
        center
        className="pointer-events-none select-none"
      >
        <div className="flex flex-col items-center gap-1">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-lg shadow-md border-2 transition-all duration-150 ${
              isSelected ? "border-brand-500 scale-110" : "border-white"
            }`}
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
          <span className={`whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-medium shadow ${
            isSelected ? "bg-brand-600 text-white" : "bg-stone-900/80 text-white"
          }`}>
            {name}
          </span>
          {isSelected && (
            <span className="whitespace-nowrap rounded-md bg-stone-900/90 border border-brand-500/30 px-1.5 py-0.5 text-[9px] font-bold text-brand-300 shadow mt-0.5 tracking-wide backdrop-blur-[2px]">
              📍 X: {coords.x.toFixed(0)}% Z: {coords.y.toFixed(0)}%
            </span>
          )}
        </div>
      </Html>
    </group>
  );

  if (isSelected) {
    return (
      <group>
        {modelMesh}
        <TransformControls
          ref={transformRef}
          mode={transformMode}
          size={0.8}
          object={meshRef}
        />
      </group>
    );
  }

  return modelMesh;
}
