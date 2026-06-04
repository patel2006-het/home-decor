import { MongoClient } from "mongodb";
import crypto from "crypto";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/havendecor";
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Helper to fetch the main database instance
 */
export async function getDb() {
  const clientInstance = await clientPromise;
  return clientInstance.db();
}

/**
 * Hashes passwords securely with a salt using HMAC-SHA256
 */
export function hashPassword(password) {
  if (!password) return "";
  const salt = process.env.SESSION_SECRET || "havendecor_salt_string_123456";
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

// Session Encryption settings (AES-256-CBC)
const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;
// derive key securely from SESSION_SECRET
const SECRET_KEY = crypto.scryptSync(
  process.env.SESSION_SECRET || "havendecor_default_secret_key_32_chars",
  "salt",
  32
);

/**
 * Encrypts session metadata into a token string
 */
export function encryptSession(data) {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  } catch (e) {
    console.error("[Crypto] Encryption failed:", e);
    return null;
  }
}

/**
 * Decrypts a session token back into user metadata
 */
export function decryptSession(token) {
  if (!token) return null;
  try {
    const [ivHex, encryptedHex] = token.split(":");
    if (!ivHex || !encryptedHex) return null;
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return JSON.parse(decrypted);
  } catch (e) {
    console.error("[Crypto] Decryption failed:", e);
    return null;
  }
}

/**
 * Decomposes a standard designData object into separate database fields
 */
export function decomposeDesign(designId, designData) {
  if (!designData) return null;
  const roomsList = designData.roomsList || [];
  
  const furniture = [];
  const windows = [];
  const doors = [];
  const curtains = [];
  const materials = [];
  const lighting = [];
  const rooms = [];
  
  roomsList.forEach((room) => {
    // Basic room info
    rooms.push({
      id: room.id,
      type: room.type,
      name: room.name,
    });
    
    // Materials
    materials.push({
      roomId: room.id,
      roomMaterials: room.roomMaterials || {},
    });
    
    // Lighting
    lighting.push({
      roomId: room.id,
      globalLighting: room.globalLighting || {},
    });
    
    // Furniture, doors, windows, curtains
    const items = room.furnitureItems || [];
    items.forEach((item) => {
      const itemWithRoom = { ...item, roomId: room.id };
      if (item.category === "Window") {
        windows.push(itemWithRoom);
      } else if (item.category === "Door") {
        doors.push(itemWithRoom);
      } else if (item.category === "Curtain") {
        curtains.push(itemWithRoom);
      } else {
        furniture.push(itemWithRoom);
      }
    });
  });
  
  return {
    designId,
    houseLayout: {
      selectedRoom: designData.selectedRoom || null,
      selectedStyle: designData.selectedStyle || null,
      activeRoomId: designData.activeRoomId || null,
    },
    rooms,
    furniture,
    materials,
    lighting,
    windows,
    doors,
    curtains,
  };
}

/**
 * Recomposes database fields back into a standard designData object
 */
export function recomposeDesign(designDoc) {
  if (!designDoc) return null;
  
  const houseLayout = designDoc.houseLayout || {};
  const rooms = designDoc.rooms || [];
  const furniture = designDoc.furniture || [];
  const materials = designDoc.materials || [];
  const lighting = designDoc.lighting || [];
  const windows = designDoc.windows || [];
  const doors = designDoc.doors || [];
  const curtains = designDoc.curtains || [];
  
  const roomsList = rooms.map((room) => {
    // Find materials for this room
    const matObj = materials.find((m) => m.roomId === room.id);
    const roomMaterials = matObj ? matObj.roomMaterials : {};
    
    // Find lighting for this room
    const lightObj = lighting.find((l) => l.roomId === room.id);
    const globalLighting = lightObj ? lightObj.globalLighting : {};
    
    // Gather all items belonging to this room and strip roomId
    const roomFurniture = furniture
      .filter((f) => f.roomId === room.id)
      .map(({ roomId, ...f }) => f);
    const roomWindows = windows
      .filter((w) => w.roomId === room.id)
      .map(({ roomId, ...w }) => w);
    const roomDoors = doors
      .filter((d) => d.roomId === room.id)
      .map(({ roomId, ...d }) => d);
    const roomCurtains = curtains
      .filter((c) => c.roomId === room.id)
      .map(({ roomId, ...c }) => c);
    
    const furnitureItems = [
      ...roomFurniture,
      ...roomWindows,
      ...roomDoors,
      ...roomCurtains,
    ];
    
    return {
      id: room.id,
      type: room.type,
      name: room.name,
      furnitureItems,
      roomMaterials,
      globalLighting,
    };
  });
  
  return {
    selectedRoom: houseLayout.selectedRoom,
    selectedStyle: houseLayout.selectedStyle,
    activeRoomId: houseLayout.activeRoomId,
    roomsList,
  };
}
