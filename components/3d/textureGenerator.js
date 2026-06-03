"use client";

import * as THREE from "three";

/**
 * Procedural texture generator utility for the 3D room canvas.
 * Creates client-side HTML canvas elements, draws patterns, and returns THREE.CanvasTexture.
 */

// Helper to configure wrapping and repeating
function configureTexture(texture, repeatX = 1, repeatY = 1) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates a Wood Plank texture (for floors or walls)
 */
export function generateWoodTexture(color = "#E6C594") {
  if (typeof window === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  // Base background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 512, 512);

  // Parse color hex to draw darker grain lines
  const base = new THREE.Color(color);
  const grainColor = "#" + base.clone().multiplyScalar(0.85).getHexString();
  const groutColor = "#" + base.clone().multiplyScalar(0.7).getHexString();

  // Draw plank boundaries
  ctx.strokeStyle = groutColor;
  ctx.lineWidth = 3;
  const plankHeight = 64;
  for (let y = 0; y <= 512; y += plankHeight) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    // Draw staggered end joints between planks
    const offset = (y / plankHeight) % 2 === 0 ? 128 : 256;
    ctx.beginPath();
    ctx.moveTo(offset, y);
    ctx.lineTo(offset, y + plankHeight);
    ctx.moveTo((offset + 256) % 512, y);
    ctx.lineTo((offset + 256) % 512, y + plankHeight);
    ctx.stroke();
  }

  // Draw subtle wood grain lines
  ctx.strokeStyle = grainColor;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.4;
  for (let i = 0; i < 60; i++) {
    const y = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(128, y + (Math.random() * 10 - 5), 384, y + (Math.random() * 10 - 5), 512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return configureTexture(texture, 2, 2);
}

/**
 * Generates a Wallpaper texture (stripes or diamonds)
 */
export function generateWallpaperTexture(type = "stripes", primaryColor = "#FAF8F5", secondaryColor = "#C8D5C0") {
  if (typeof window === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  // Base background
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, 256, 256);

  if (type === "stripes") {
    // Alternating vertical stripes
    ctx.fillStyle = secondaryColor;
    ctx.globalAlpha = 0.8;
    const stripeWidth = 32;
    for (let x = 0; x < 256; x += stripeWidth * 2) {
      ctx.fillRect(x, 0, stripeWidth, 256);
    }
  } else if (type === "diamonds") {
    // Repeating geometric diamond pattern
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    const size = 64;

    for (let x = -size; x <= 256 + size; x += size) {
      for (let y = -size; y <= 256 + size; y += size) {
        ctx.beginPath();
        ctx.moveTo(x + size / 2, y);
        ctx.lineTo(x + size, y + size / 2);
        ctx.lineTo(x + size / 2, y + size);
        ctx.lineTo(x, y + size / 2);
        ctx.closePath();
        ctx.stroke();

        // Small inner dot
        ctx.fillStyle = secondaryColor;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  return configureTexture(texture, 3, 2);
}

/**
 * Generates a Marble texture
 */
export function generateMarbleTexture(baseColor = "#EAE8E4", veinColor = "#A0A0A0") {
  if (typeof window === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  // Base marble background
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle noise under-layer
  ctx.fillStyle = "#ffffff";
  ctx.globalAlpha = 0.15;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 80 + 20, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Draw organic marble vein lines
  ctx.strokeStyle = veinColor;
  ctx.globalAlpha = 0.25;
  
  for (let j = 0; j < 8; j++) {
    ctx.lineWidth = Math.random() * 2 + 1;
    let startX = Math.random() * 512;
    let startY = 0;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    
    let currentX = startX;
    let currentY = startY;
    
    while (currentY < 512) {
      currentX += Math.sin(currentY * 0.05) * 8 + (Math.random() * 20 - 10);
      currentY += Math.random() * 30 + 10;
      ctx.lineTo(currentX, currentY);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return configureTexture(texture, 1, 1);
}

/**
 * Generates a Grout Tiles texture
 */
export function generateTilesTexture(tileColor = "#FAF8F5", groutColor = "#9E9E9E", size = 64) {
  if (typeof window === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  // Base tile
  ctx.fillStyle = tileColor;
  ctx.fillRect(0, 0, 256, 256);

  // Grout grid lines
  ctx.strokeStyle = groutColor;
  ctx.lineWidth = 3;
  for (let i = 0; i <= 256; i += size) {
    // vertical
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();
    // horizontal
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return configureTexture(texture, 3, 3);
}

/**
 * Generates a Granite texture (speckled noise)
 */
export function generateGraniteTexture(baseColor = "#9CA3AF") {
  if (typeof window === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  // Base background
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 256, 256);

  // Add multiple colored speckles
  const colors = ["#ffffff", "#4b5563", "#d1d5db", "#111827"];
  
  colors.forEach((col, idx) => {
    ctx.fillStyle = col;
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 800; i++) {
      const size = Math.random() * 2 + 1;
      ctx.fillRect(Math.random() * 256, Math.random() * 256, size, size);
    }
  });

  const texture = new THREE.CanvasTexture(canvas);
  return configureTexture(texture, 2, 2);
}

/**
 * Generates a Stone block cladding texture (for walls)
 */
export function generateStoneTexture(baseColor = "#78716c") {
  if (typeof window === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  const base = new THREE.Color(baseColor);
  const groutColor = "#" + base.clone().multiplyScalar(0.5).getHexString();
  const shadeColor = "#" + base.clone().multiplyScalar(0.8).getHexString();

  const blockHeight = 48;
  const blockWidths = [128, 192, 96, 160];

  ctx.strokeStyle = groutColor;
  ctx.lineWidth = 3;

  for (let y = 0; y <= 512; y += blockHeight) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    // Draw horizontal brick segments
    let x = (y / blockHeight) % 2 === 0 ? 0 : -64;
    while (x < 512 + 64) {
      const w = blockWidths[Math.floor(Math.random() * blockWidths.length)];
      
      // Randomly shade some blocks for realism
      if (Math.random() > 0.4) {
        ctx.fillStyle = shadeColor;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(x + 2, y + 2, w - 4, blockHeight - 4);
      }
      
      ctx.beginPath();
      ctx.moveTo(x + w, y);
      ctx.lineTo(x + w, y + blockHeight);
      ctx.stroke();
      x += w;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  return configureTexture(texture, 2, 2);
}
