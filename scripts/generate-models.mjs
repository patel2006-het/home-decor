import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// Polyfill FileReader for Node.js (needed by Three.js GLTFExporter)
global.FileReader = class FileReader {
  constructor() {
    this.result = null;
    this.onloadend = null;
    this.onerror = null;
  }

  readAsDataURL(blob) {
    if (typeof blob.arrayBuffer === "function") {
      blob.arrayBuffer().then((buf) => {
        const base64 = Buffer.from(buf).toString("base64");
        this.result = `data:${blob.type || "application/octet-stream"};base64,${base64}`;
        if (this.onloadend) this.onloadend();
      }).catch((err) => {
        if (this.onerror) this.onerror(err);
      });
    } else {
      const base64 = Buffer.from(blob).toString("base64");
      this.result = `data:application/octet-stream;base64,${base64}`;
      if (this.onloadend) this.onloadend();
    }
  }

  readAsArrayBuffer(blob) {
    if (typeof blob.arrayBuffer === "function") {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onloadend) this.onloadend();
      }).catch((err) => {
        if (this.onerror) this.onerror(err);
      });
    } else {
      const ab = new Uint8Array(blob).buffer;
      this.result = ab;
      if (this.onloadend) this.onloadend();
    }
  }
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, "../public/models");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper to write GLB buffer to file
function saveGLB(filename, buffer) {
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, Buffer.from(buffer));
  console.log(`Successfully generated model: ${filename} at ${filePath}`);
}

// Exporter instance
const exporter = new GLTFExporter();

function exportToGLB(mesh, filename) {
  return new Promise((resolve, reject) => {
    exporter.parse(
      mesh,
      (gltf) => {
        saveGLB(filename, gltf);
        resolve();
      },
      (error) => {
        console.error(`Error exporting ${filename}:`, error);
        reject(error);
      },
      { binary: true }
    );
  });
}

async function main() {
  console.log("Starting mock 3D model generation...");

  // 1. BED MODEL
  // A simple diorama of a bed: mattress, headboard, and two pillows
  const bedGroup = new THREE.Group();
  bedGroup.name = "Bed";

  const bedBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.3, 2.0),
    new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.8 }) // wood base
  );
  bedBase.position.y = 0.15;
  bedGroup.add(bedBase);

  const mattress = new THREE.Mesh(
    new THREE.BoxGeometry(1.7, 0.25, 1.9),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }) // white mattress
  );
  mattress.position.y = 0.425;
  mattress.position.z = 0.05;
  bedGroup.add(mattress);

  const headboard = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.1, 0.15),
    new THREE.MeshStandardMaterial({ color: 0x4a3b32, roughness: 0.7 })
  );
  headboard.position.set(0, 0.55, -0.925);
  bedGroup.add(headboard);

  const pillow1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.1, 0.4),
    new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.9 })
  );
  pillow1.position.set(-0.4, 0.6, -0.65);
  bedGroup.add(pillow1);

  const pillow2 = pillow1.clone();
  pillow2.position.x = 0.4;
  bedGroup.add(pillow2);

  await exportToGLB(bedGroup, "bed.glb");

  // 2. SOFA MODEL
  // A modern sofa: base, cushions, backrest, armrests
  const sofaGroup = new THREE.Group();
  sofaGroup.name = "Sofa";

  const sofaBase = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 0.15, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 }) // wood support
  );
  sofaBase.position.y = 0.075;
  sofaGroup.add(sofaBase);

  const seatCushion = new THREE.Mesh(
    new THREE.BoxGeometry(1.7, 0.25, 0.65),
    new THREE.MeshStandardMaterial({ color: 0x78909c, roughness: 0.8 }) // slate fabric
  );
  seatCushion.position.set(0, 0.275, 0.025);
  sofaGroup.add(seatCushion);

  const backrest = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 0.5, 0.15),
    new THREE.MeshStandardMaterial({ color: 0x78909c, roughness: 0.8 })
  );
  backrest.position.set(0, 0.6, -0.325);
  sofaGroup.add(backrest);

  const leftArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.45, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x546e7a, roughness: 0.8 })
  );
  leftArm.position.set(-0.925, 0.3, 0);
  sofaGroup.add(leftArm);

  const rightArm = leftArm.clone();
  rightArm.position.x = 0.925;
  sofaGroup.add(rightArm);

  await exportToGLB(sofaGroup, "sofa.glb");

  // 3. CHAIR MODEL
  // A simple chair: seat, backrest, and 4 thin legs
  const chairGroup = new THREE.Group();
  chairGroup.name = "Chair";

  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.05, 0.5),
    new THREE.MeshStandardMaterial({ color: 0xd7ccc8, roughness: 0.6 }) // light fabric seat
  );
  seat.position.y = 0.425;
  chairGroup.add(seat);

  const chairBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.45, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.8 }) // wood back
  );
  chairBack.position.set(0, 0.65, -0.225);
  chairGroup.add(chairBack);

  const legGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4);
  const legMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, metalness: 0.5, roughness: 0.3 });

  const legFL = new THREE.Mesh(legGeo, legMat);
  legFL.position.set(-0.22, 0.2, 0.22);
  chairGroup.add(legFL);

  const legFR = legFL.clone();
  legFR.position.x = 0.22;
  chairGroup.add(legFR);

  const legBL = legFL.clone();
  legBL.position.z = -0.22;
  chairGroup.add(legBL);

  const legBR = legFR.clone();
  legBR.position.z = -0.22;
  chairGroup.add(legBR);

  await exportToGLB(chairGroup, "chair.glb");

  // 4. WARDROBE MODEL
  // A tall wardrobe cabinet with double doors and handles
  const wardrobeGroup = new THREE.Group();
  wardrobeGroup.name = "Wardrobe";

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 1.8, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.7 }) // dark wood body
  );
  body.position.y = 0.9;
  wardrobeGroup.add(body);

  const leftDoor = new THREE.Mesh(
    new THREE.BoxGeometry(0.48, 1.74, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.6 }) // slightly lighter wood doors
  );
  leftDoor.position.set(-0.24, 0.9, 0.26);
  wardrobeGroup.add(leftDoor);

  const rightDoor = leftDoor.clone();
  rightDoor.position.x = 0.24;
  wardrobeGroup.add(rightDoor);

  const handleGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.15);
  const handleMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 }); // gold handles

  const handleL = new THREE.Mesh(handleGeo, handleMat);
  handleL.position.set(-0.03, 0.9, 0.28);
  wardrobeGroup.add(handleL);

  const handleR = handleL.clone();
  handleR.position.x = 0.03;
  wardrobeGroup.add(handleR);

  await exportToGLB(wardrobeGroup, "wardrobe.glb");

  // 5. TABLE MODEL
  // A dining/study table with a thick wood tabletop and 4 metal legs
  const tableGroup = new THREE.Group();
  tableGroup.name = "Table";

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.06, 0.8),
    new THREE.MeshStandardMaterial({ color: 0xa1887f, roughness: 0.5 }) // warm wood top
  );
  top.position.y = 0.72;
  tableGroup.add(top);

  const tableLegGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.69);
  const tableLegMat = new THREE.MeshStandardMaterial({ color: 0x212121, metalness: 0.7, roughness: 0.2 }); // matte black metal legs

  const tLegFL = new THREE.Mesh(tableLegGeo, tableLegMat);
  tLegFL.position.set(-0.68, 0.345, 0.33);
  tableGroup.add(tLegFL);

  const tLegFR = tLegFL.clone();
  tLegFR.position.x = 0.68;
  tableGroup.add(tLegFR);

  const tLegBL = tLegFL.clone();
  tLegBL.position.z = -0.33;
  tableGroup.add(tLegBL);

  const tLegBR = tLegFR.clone();
  tLegBR.position.z = -0.33;
  tableGroup.add(tLegBR);

  await exportToGLB(tableGroup, "table.glb");

  console.log("All mock models successfully generated!");
}

main().catch((err) => {
  console.error("Critical error generating models:", err);
  process.exit(1);
});
