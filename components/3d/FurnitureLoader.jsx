"use client";

import React, { Component } from "react";
import { useGLTF } from "@react-three/drei";

/**
 * ModelErrorBoundary — Catches loading errors in Three.js Canvas
 * when a .glb file fails to fetch, falling back to a box geometry.
 */
class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("FurnitureLoader: Error loading 3D model, using fallback:", error, errorInfo);
  }

  // If the modelUrl changes, reset the error state so it tries to load again
  componentDidUpdate(prevProps) {
    if (prevProps.modelUrl !== this.props.modelUrl) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * GLBModel — The actual Three.js primitive renderer that uses useGLTF
 */
function GLBModel({ modelUrl }) {
  const { scene } = useGLTF(modelUrl);

  // Clone the scene so that multiple instances of the same model don't clash in the scene tree
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  // Ensure children meshes have casting/receiving of shadows enabled
  React.useLayoutEffect(() => {
    clonedScene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  return <primitive object={clonedScene} />;
}

/**
 * FurnitureLoader — Reusable loader with built-in Suspense and Error Boundary.
 *
 * @param {object} props
 * @param {string} props.modelUrl - Path to GLB file
 * @param {React.ReactNode} props.fallback - Bounding box to render while loading or on error
 */
export default function FurnitureLoader({ modelUrl, fallback }) {
  if (!modelUrl) {
    return fallback;
  }

  return (
    <ModelErrorBoundary modelUrl={modelUrl} fallback={fallback}>
      <React.Suspense fallback={fallback}>
        <GLBModel modelUrl={modelUrl} />
      </React.Suspense>
    </ModelErrorBoundary>
  );
}

// Preload helper to fetch model assets in the background
FurnitureLoader.preload = (url) => {
  if (url) {
    try {
      useGLTF.preload(url);
    } catch (e) {
      // Ignored
    }
  }
};
