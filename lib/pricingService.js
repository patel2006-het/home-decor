/**
 * Centralized pricing service to calculate layout cost estimations.
 * Encapsulates base pricing databases, quality level multipliers,
 * and compiles comprehensive room-wise breakdowns and itemized invoices.
 */

// Quality Level Multipliers
export const QUALITY_MULTIPLIERS = {
  basic: 1.0,
  premium: 1.8,
  luxury: 3.2,
};

// Item ID / Category Base Prices
const PRICING_DB = {
  // Furniture specific IDs
  "bed-king": 950,
  "bed-single": 450,
  "wardrobe": 580,
  "nightstand": 140,
  "dresser": 360,
  "vanity-mirror": 280,
  
  "sofa-3seat": 850,
  "sofa-2seat": 650,
  "coffee-table": 280,
  "tv-unit": 420,
  "armchair": 340,
  "bookshelf-lr": 380,

  "kitchen-island": 900,
  "cabinet-upper": 460,
  "stool-bar": 110,
  "fridge": 850,
  "dining-bench": 180,

  "vanity-bath": 540,
  "mirror-bath": 130,
  "storage-unit": 320,
  "bathtub": 1150,
  "towel-rack": 70,

  "dining-table-6": 680,
  "dining-table-4": 480,
  "dining-chair": 130,
  "sideboard": 460,
  "buffet-lamp": 90,

  "desk-large": 420,
  "desk-compact": 240,
  "office-chair": 280,
  "bookshelf-off": 360,
  "filing-cab": 160,
  "desk-plant": 35,

  "acapulco-chair": 145,
  "bistro-table": 190,

  // Fallbacks by Category if specific ID is not listed
  categories: {
    Seating: 300,
    Sleeping: 600,
    Tables: 250,
    Storage: 350,
    Work: 300,
    Fixture: 500,
    Decor: 100,
    Appliance: 800,
    Accessory: 60,
    Furniture: 300,
  },

  // Architectural Elements
  elements: {
    Door: 220,
    Window: 280,
    Curtain: 130,
  },

  // Placed Lighting Fixtures
  lighting: {
    "light-ceiling": 50,
    "light-chandelier": 420,
    "light-wall": 80,
    "light-floor-lamp": 130,
    "light-table-lamp": 70,
    default: 100,
  },

  // Flooring Types Base Cost
  flooring: {
    "light-oak": 350,
    "dark-walnut": 450,
    "marble-white": 580,
    "concrete": 180,
    "terracotta-tile": 280,
    default: 300,
  },

  // Wall Finish Base Cost
  walls: {
    default: 120,
  },
};

/**
 * Calculates a detailed cost analysis for the active rooms list.
 *
 * @param {Array} roomsList - The active list of rooms in the design project.
 * @param {string} qualityLevel - "basic" | "premium" | "luxury"
 * @returns {object} The compiled cost breakdown, room totals, and itemized ledger.
 */
export function calculateProjectCost(roomsList = [], qualityLevel = "premium") {
  const multiplier = QUALITY_MULTIPLIERS[qualityLevel] || 1.8;

  let grandTotal = 0;
  const breakdown = {
    furniture: 0,
    materials: 0, // walls
    flooring: 0,
    lighting: 0,
    curtains: 0,
    doors: 0,
    windows: 0,
  };

  const roomCosts = [];
  const itemized = [];

  roomsList.forEach((room) => {
    let roomTotal = 0;
    const roomName = room.name || `Room (${room.type})`;

    // 1. Calculate Wall Materials Cost (Paint)
    const wallBase = PRICING_DB.walls.default;
    const wallCost = Math.round(wallBase * multiplier);
    breakdown.materials += wallCost;
    roomTotal += wallCost;
    
    itemized.push({
      name: `Wall Finish (${room.roomMaterials?.walls?.swatchId || "Standard"})`,
      category: "Materials",
      room: roomName,
      qty: 1,
      unitPrice: wallCost,
      totalPrice: wallCost,
    });

    // 2. Calculate Flooring Material Cost
    const floorId = room.roomMaterials?.flooring?.swatchId || "default";
    const floorBase = PRICING_DB.flooring[floorId] || PRICING_DB.flooring.default;
    const floorCost = Math.round(floorBase * multiplier);
    breakdown.flooring += floorCost;
    roomTotal += floorCost;

    itemized.push({
      name: `Flooring (${room.roomMaterials?.flooring?.swatchId || "Standard"})`,
      category: "Flooring",
      room: roomName,
      qty: 1,
      unitPrice: floorCost,
      totalPrice: floorCost,
    });

    // 3. Calculate Placed Furniture & Architectural Elements Cost
    const items = room.furnitureItems || [];
    items.forEach((item) => {
      let finalPrice = 0;
      let targetCategory = "Furniture";

      if (item.price !== undefined) {
        // Real retail product price: bypass quality multiplier scaling
        finalPrice = item.price;
        if (item.isLight) {
          targetCategory = "Lighting";
        } else if (item.isArchitectural) {
          if (item.category === "Door") targetCategory = "Doors";
          else if (item.category === "Window") targetCategory = "Windows";
          else if (item.category === "Curtain") targetCategory = "Curtains";
        } else {
          targetCategory = "Furniture";
        }
      } else {
        let basePrice = 0;
        if (item.isLight) {
          basePrice = PRICING_DB.lighting[item.id] || PRICING_DB.lighting.default;
          targetCategory = "Lighting";
        } else if (item.isArchitectural) {
          basePrice = PRICING_DB.elements[item.category] || 150;
          
          if (item.category === "Door") targetCategory = "Doors";
          else if (item.category === "Window") targetCategory = "Windows";
          else if (item.category === "Curtain") targetCategory = "Curtains";
        } else {
          basePrice = PRICING_DB[item.id] || PRICING_DB.categories[item.category] || PRICING_DB.categories.Furniture;
          targetCategory = "Furniture";
        }
        finalPrice = Math.round(basePrice * multiplier);
      }

      const categoryKey = targetCategory.toLowerCase();

      // Record in category breakdowns
      if (breakdown[categoryKey] !== undefined) {
        breakdown[categoryKey] += finalPrice;
      } else {
        breakdown.furniture += finalPrice;
      }

      roomTotal += finalPrice;

      // Add to itemized ledger (aggregating duplicates if they exist, or listing individually)
      // For simplicity, we list placed items individually as they have unique coordinate placements
      itemized.push({
        name: item.name,
        category: targetCategory,
        room: roomName,
        qty: 1,
        unitPrice: finalPrice,
        totalPrice: finalPrice,
      });
    });

    grandTotal += roomTotal;
    roomCosts.push({
      roomId: room.id,
      roomName,
      cost: roomTotal,
    });
  });

  return {
    total: grandTotal,
    breakdown,
    roomCosts,
    itemized,
  };
}
