// Standard Response.json is supported globally

// Presets by Style and Room Type
const stylePresets = {
  scandinavian: {
    name: "Scandinavian",
    materials: {
      walls: { color: "#F4F1EA", texture: "plaster" }, // Off-white/cream paint
      floor: { color: "#E5C594", texture: "oak" }     // Light oak wood
    },
    lighting: {
      ambientIntensity: 0.8,
      ambientTemp: 3000, // Warm cozy light
      directionalIntensity: 0.9,
      shadowsEnabled: true
    },
    layouts: {
      "living-room": [
        { itemId: "sofa-3seat", position: { x: 50, y: 35 }, rotation: 0, color: "#ECEFF1" }, // light grey sofa
        { itemId: "coffee-table", position: { x: 50, y: 55 }, rotation: 90, color: "#E5C594" }, // oak table
        { itemId: "armchair", position: { x: 28, y: 50 }, rotation: 45, color: "#D7CCC8" }, // beige armchair
        { itemId: "light-floor-lamp", position: { x: 72, y: 30 }, rotation: 0 },
        { itemId: "element-window", position: { x: 50, y: 10 }, rotation: 0, color: "#ffffff" },
        { itemId: "element-curtain", position: { x: 50, y: 10 }, rotation: 0, color: "#F5F5F5" } // linen white
      ],
      "bedroom": [
        { itemId: "bed-king", position: { x: 50, y: 35 }, rotation: 0, color: "#E0D7C6" },
        { itemId: "nightstand", position: { x: 26, y: 30 }, rotation: 0, color: "#E5C594" },
        { itemId: "nightstand", position: { x: 74, y: 30 }, rotation: 0, color: "#E5C594" },
        { itemId: "dresser", position: { x: 78, y: 70 }, rotation: 90, color: "#E5C594" },
        { itemId: "light-table-lamp", position: { x: 26, y: 30 }, rotation: 0 },
        { itemId: "element-window", position: { x: 50, y: 10 }, rotation: 0 }
      ],
      "office": [
        { itemId: "desk-large", position: { x: 50, y: 40 }, rotation: 0, color: "#E5C594" },
        { itemId: "office-chair", position: { x: 50, y: 55 }, rotation: 180, color: "#37474F" },
        { itemId: "bookshelf-off", position: { x: 18, y: 35 }, rotation: 90, color: "#E5C594" },
        { itemId: "desk-plant", position: { x: 68, y: 38 }, rotation: 0, color: "#2E7D32" },
        { itemId: "light-table-lamp", position: { x: 32, y: 38 }, rotation: 0 },
        { itemId: "element-window", position: { x: 50, y: 10 }, rotation: 0 }
      ],
      "dining-room": [
        { itemId: "dining-table-6", position: { x: 50, y: 45 }, rotation: 0, color: "#E5C594" },
        { itemId: "dining-chair", position: { x: 38, y: 35 }, rotation: 0, color: "#ECEFF1" },
        { itemId: "dining-chair", position: { x: 50, y: 35 }, rotation: 0, color: "#ECEFF1" },
        { itemId: "dining-chair", position: { x: 62, y: 35 }, rotation: 0, color: "#ECEFF1" },
        { itemId: "dining-chair", position: { x: 38, y: 55 }, rotation: 180, color: "#ECEFF1" },
        { itemId: "dining-chair", position: { x: 50, y: 55 }, rotation: 180, color: "#ECEFF1" },
        { itemId: "dining-chair", position: { x: 62, y: 55 }, rotation: 180, color: "#ECEFF1" },
        { itemId: "light-chandelier", position: { x: 50, y: 45 }, rotation: 0 }
      ],
      "kitchen": [
        { itemId: "kitchen-island", position: { x: 50, y: 50 }, rotation: 0, color: "#FAF8F5" },
        { itemId: "fridge", position: { x: 18, y: 35 }, rotation: 90, color: "#ECEFF1" },
        { itemId: "stool-bar", position: { x: 42, y: 65 }, rotation: 180, color: "#E5C594" },
        { itemId: "stool-bar", position: { x: 58, y: 65 }, rotation: 180, color: "#E5C594" },
        { itemId: "element-window", position: { x: 50, y: 10 }, rotation: 0 }
      ],
      "bathroom": [
        { itemId: "vanity-bath", position: { x: 50, y: 25 }, rotation: 0, color: "#FAF8F5" },
        { itemId: "mirror-bath", position: { x: 50, y: 25 }, rotation: 0 },
        { itemId: "bathtub", position: { x: 80, y: 60 }, rotation: 90, color: "#ffffff" },
        { itemId: "towel-rack", position: { x: 22, y: 50 }, rotation: 270 }
      ],
      "balcony": [
        { itemId: "acapulco-chair", position: { x: 35, y: 50 }, rotation: 45, color: "#2E7D32" },
        { itemId: "acapulco-chair", position: { x: 65, y: 50 }, rotation: 315, color: "#2E7D32" },
        { itemId: "bistro-table", position: { x: 50, y: 50 }, rotation: 0, color: "#E5C594" }
      ]
    },
    description: "A bright and functional layout leveraging light-toned oak woods, crisp soft-whites, clean furniture profiles, and heavy natural light integrations.",
    imageUrl: "/images/ai-suggestions/scandinavian.png"
  },
  midcentury: {
    name: "Mid-Century Modern",
    materials: {
      walls: { color: "#EBE3D5", texture: "plaster" }, // Warm sand
      floor: { color: "#8E6B4E", texture: "walnut" }  // Rich walnut/teak wood
    },
    lighting: {
      ambientIntensity: 0.7,
      ambientTemp: 2700, // Very warm honey light
      directionalIntensity: 0.8,
      shadowsEnabled: true
    },
    layouts: {
      "living-room": [
        { itemId: "sofa-3seat", position: { x: 50, y: 35 }, rotation: 0, color: "#D84B20" }, // Terracotta/orange sofa
        { itemId: "coffee-table", position: { x: 50, y: 55 }, rotation: 0, color: "#5C3D2E" }, // Walnut coffee table
        { itemId: "armchair", position: { x: 28, y: 50 }, rotation: 45, color: "#4E5D4E" }, // Olive green chair
        { itemId: "light-floor-lamp", position: { x: 72, y: 30 }, rotation: 0, color: "#D4AF37" }, // Brass lamp
        { itemId: "element-window", position: { x: 50, y: 10 }, rotation: 0 },
        { itemId: "element-curtain", position: { x: 50, y: 10 }, rotation: 0, color: "#E0D7C6" }
      ],
      "bedroom": [
        { itemId: "bed-king", position: { x: 50, y: 35 }, rotation: 0, color: "#4E5D4E" }, // Olive green bed
        { itemId: "nightstand", position: { x: 26, y: 30 }, rotation: 0, color: "#5C3D2E" },
        { itemId: "nightstand", position: { x: 74, y: 30 }, rotation: 0, color: "#5C3D2E" },
        { itemId: "dresser", position: { x: 78, y: 70 }, rotation: 90, color: "#5C3D2E" },
        { itemId: "light-table-lamp", position: { x: 26, y: 30 }, rotation: 0 }
      ],
      "office": [
        { itemId: "desk-large", position: { x: 50, y: 40 }, rotation: 0, color: "#5C3D2E" },
        { itemId: "office-chair", position: { x: 50, y: 55 }, rotation: 180, color: "#1A1A1A" },
        { itemId: "bookshelf-off", position: { x: 18, y: 35 }, rotation: 90, color: "#5C3D2E" },
        { itemId: "light-table-lamp", position: { x: 32, y: 38 }, rotation: 0 }
      ],
      "dining-room": [
        { itemId: "dining-table-6", position: { x: 50, y: 45 }, rotation: 0, color: "#5C3D2E" },
        { itemId: "dining-chair", position: { x: 38, y: 35 }, rotation: 0, color: "#D84B20" },
        { itemId: "dining-chair", position: { x: 50, y: 35 }, rotation: 0, color: "#D84B20" },
        { itemId: "dining-chair", position: { x: 62, y: 35 }, rotation: 0, color: "#D84B20" },
        { itemId: "dining-chair", position: { x: 38, y: 55 }, rotation: 180, color: "#4E5D4E" },
        { itemId: "dining-chair", position: { x: 50, y: 55 }, rotation: 180, color: "#4E5D4E" },
        { itemId: "dining-chair", position: { x: 62, y: 55 }, rotation: 180, color: "#4E5D4E" },
        { itemId: "light-chandelier", position: { x: 50, y: 45 }, rotation: 0 }
      ],
      "kitchen": [
        { itemId: "kitchen-island", position: { x: 50, y: 50 }, rotation: 0, color: "#5C3D2E" },
        { itemId: "fridge", position: { x: 18, y: 35 }, rotation: 90, color: "#2B2B2B" },
        { itemId: "stool-bar", position: { x: 42, y: 65 }, rotation: 180, color: "#5C3D2E" },
        { itemId: "stool-bar", position: { x: 58, y: 65 }, rotation: 180, color: "#5C3D2E" }
      ],
      "bathroom": [
        { itemId: "vanity-bath", position: { x: 50, y: 25 }, rotation: 0, color: "#5C3D2E" },
        { itemId: "mirror-bath", position: { x: 50, y: 25 }, rotation: 0 },
        { itemId: "bathtub", position: { x: 80, y: 60 }, rotation: 90, color: "#ffffff" }
      ],
      "balcony": [
        { itemId: "acapulco-chair", position: { x: 35, y: 50 }, rotation: 45, color: "#D84B20" },
        { itemId: "acapulco-chair", position: { x: 65, y: 50 }, rotation: 315, color: "#D84B20" },
        { itemId: "bistro-table", position: { x: 50, y: 50 }, rotation: 0, color: "#5C3D2E" }
      ]
    },
    description: "Features organic geometry, warm honey lighting fixtures, and a statement mustard/terracotta palette highlighting teak wood elements.",
    imageUrl: "/images/ai-suggestions/midcentury.png"
  },
  industrial: {
    name: "Industrial",
    materials: {
      walls: { color: "#B0BEC5", texture: "brick" }, // Slate/concrete grey brick
      floor: { color: "#455A64", texture: "concrete" } // Dark concrete floor
    },
    lighting: {
      ambientIntensity: 0.5, // Moody
      ambientTemp: 4000, // Natural white light
      directionalIntensity: 0.7,
      shadowsEnabled: true
    },
    layouts: {
      "living-room": [
        { itemId: "sofa-3seat", position: { x: 50, y: 35 }, rotation: 0, color: "#3E2723" }, // dark brown leather sofa
        { itemId: "coffee-table", position: { x: 50, y: 55 }, rotation: 90, color: "#2B2B2B" }, // iron/black table
        { itemId: "armchair", position: { x: 28, y: 50 }, rotation: 45, color: "#212121" }, // charcoal chair
        { itemId: "light-floor-lamp", position: { x: 72, y: 30 }, rotation: 0, color: "#1A1A1A" }, // matte black lamp
        { itemId: "element-window", position: { x: 50, y: 10 }, rotation: 0, color: "#1A1A1A" }, // black frame window
        { itemId: "element-curtain", position: { x: 50, y: 10 }, rotation: 0, color: "#37474F" }  // slate grey curtains
      ],
      "bedroom": [
        { itemId: "bed-king", position: { x: 50, y: 35 }, rotation: 0, color: "#3E2723" },
        { itemId: "nightstand", position: { x: 26, y: 30 }, rotation: 0, color: "#2B2B2B" },
        { itemId: "nightstand", position: { x: 74, y: 30 }, rotation: 0, color: "#2B2B2B" },
        { itemId: "dresser", position: { x: 78, y: 70 }, rotation: 90, color: "#2B2B2B" },
        { itemId: "light-table-lamp", position: { x: 26, y: 30 }, rotation: 0 }
      ],
      "office": [
        { itemId: "desk-large", position: { x: 50, y: 40 }, rotation: 0, color: "#2B2B2B" },
        { itemId: "office-chair", position: { x: 50, y: 55 }, rotation: 180, color: "#37474F" },
        { itemId: "bookshelf-off", position: { x: 18, y: 35 }, rotation: 90, color: "#2B2B2B" },
        { itemId: "light-table-lamp", position: { x: 32, y: 38 }, rotation: 0 }
      ],
      "dining-room": [
        { itemId: "dining-table-6", position: { x: 50, y: 45 }, rotation: 0, color: "#2B2B2B" },
        { itemId: "dining-chair", position: { x: 38, y: 35 }, rotation: 0, color: "#3E2723" },
        { itemId: "dining-chair", position: { x: 50, y: 35 }, rotation: 0, color: "#3E2723" },
        { itemId: "dining-chair", position: { x: 62, y: 35 }, rotation: 0, color: "#3E2723" },
        { itemId: "dining-chair", position: { x: 38, y: 55 }, rotation: 180, color: "#2B2B2B" },
        { itemId: "dining-chair", position: { x: 50, y: 55 }, rotation: 180, color: "#2B2B2B" },
        { itemId: "dining-chair", position: { x: 62, y: 55 }, rotation: 180, color: "#2B2B2B" },
        { itemId: "light-chandelier", position: { x: 50, y: 45 }, rotation: 0 }
      ],
      "kitchen": [
        { itemId: "kitchen-island", position: { x: 50, y: 50 }, rotation: 0, color: "#2B2B2B" },
        { itemId: "fridge", position: { x: 18, y: 35 }, rotation: 90, color: "#78909C" },
        { itemId: "stool-bar", position: { x: 42, y: 65 }, rotation: 180, color: "#2B2B2B" },
        { itemId: "stool-bar", position: { x: 58, y: 65 }, rotation: 180, color: "#2B2B2B" }
      ],
      "bathroom": [
        { itemId: "vanity-bath", position: { x: 50, y: 25 }, rotation: 0, color: "#2B2B2B" },
        { itemId: "mirror-bath", position: { x: 50, y: 25 }, rotation: 0 },
        { itemId: "bathtub", position: { x: 80, y: 60 }, rotation: 90, color: "#78909C" }
      ],
      "balcony": [
        { itemId: "acapulco-chair", position: { x: 35, y: 50 }, rotation: 45, color: "#2B2B2B" },
        { itemId: "acapulco-chair", position: { x: 65, y: 50 }, rotation: 315, color: "#2B2B2B" },
        { itemId: "bistro-table", position: { x: 50, y: 50 }, rotation: 0, color: "#2B2B2B" }
      ]
    },
    description: "Creates an urban loft atmosphere using raw concrete flooring, textured bricks, matte black metals, and deep espresso tones.",
    imageUrl: "/images/ai-suggestions/industrial.png"
  },
  minimalist: {
    name: "Minimalist Zen",
    materials: {
      walls: { color: "#F7F5F0", texture: "plaster" }, // Soft plaster beige
      floor: { color: "#FAF8F5", texture: "plaster" } // Clean light floor
    },
    lighting: {
      ambientIntensity: 0.9, // Ultra bright and airy
      ambientTemp: 3500, // Natural soft white
      directionalIntensity: 0.8,
      shadowsEnabled: true
    },
    layouts: {
      "living-room": [
        { itemId: "sofa-2seat", position: { x: 50, y: 35 }, rotation: 0, color: "#FAF8F5" }, // Off-white linen sofa
        { itemId: "coffee-table", position: { x: 50, y: 55 }, rotation: 0, color: "#E0D7C6" },  // Low beige stone table
        { itemId: "light-floor-lamp", position: { x: 75, y: 30 }, rotation: 0 },
        { itemId: "element-window", position: { x: 50, y: 10 }, rotation: 0 }
      ],
      "bedroom": [
        { itemId: "bed-single", position: { x: 50, y: 35 }, rotation: 0, color: "#FAF8F5" },
        { itemId: "nightstand", position: { x: 30, y: 30 }, rotation: 0, color: "#E0D7C6" },
        { itemId: "dresser", position: { x: 75, y: 65 }, rotation: 90, color: "#FAF8F5" },
        { itemId: "light-table-lamp", position: { x: 30, y: 30 }, rotation: 0 }
      ],
      "office": [
        { itemId: "desk-compact", position: { x: 50, y: 40 }, rotation: 0, color: "#FAF8F5" },
        { itemId: "office-chair", position: { x: 50, y: 55 }, rotation: 180, color: "#B0BEC5" },
        { itemId: "desk-plant", position: { x: 68, y: 38 }, rotation: 0, color: "#3D5C4A" },
        { itemId: "element-window", position: { x: 50, y: 10 }, rotation: 0 }
      ],
      "dining-room": [
        { itemId: "dining-table-4", position: { x: 50, y: 45 }, rotation: 0, color: "#FAF8F5" },
        { itemId: "dining-chair", position: { x: 42, y: 35 }, rotation: 0, color: "#FAF8F5" },
        { itemId: "dining-chair", position: { x: 58, y: 35 }, rotation: 0, color: "#FAF8F5" },
        { itemId: "dining-chair", position: { x: 42, y: 55 }, rotation: 180, color: "#FAF8F5" },
        { itemId: "dining-chair", position: { x: 58, y: 55 }, rotation: 180, color: "#FAF8F5" }
      ],
      "kitchen": [
        { itemId: "kitchen-island", position: { x: 50, y: 50 }, rotation: 0, color: "#FAF8F5" },
        { itemId: "stool-bar", position: { x: 50, y: 65 }, rotation: 180, color: "#FAF8F5" }
      ],
      "bathroom": [
        { itemId: "vanity-bath", position: { x: 50, y: 25 }, rotation: 0, color: "#FAF8F5" },
        { itemId: "mirror-bath", position: { x: 50, y: 25 }, rotation: 0 },
        { itemId: "bathtub", position: { x: 80, y: 60 }, rotation: 90, color: "#FAF8F5" }
      ],
      "balcony": [
        { itemId: "acapulco-chair", position: { x: 50, y: 50 }, rotation: 0, color: "#FAF8F5" }
      ]
    },
    description: "Focuses on absolute serenity, utilizing pure plaster whites, minimal floating tables, organic lighting levels, and spacious orientations.",
    imageUrl: "/images/ai-suggestions/minimalist.png"
  }
};

export async function POST(request) {
  try {
    const { roomType, description, preferences, style } = await request.json();

    // Map incoming style tags to our presets keys
    const styleKey = style?.toLowerCase().includes("scand") ? "scandinavian"
      : style?.toLowerCase().includes("mid") ? "midcentury"
      : style?.toLowerCase().includes("ind") ? "industrial"
      : "minimalist"; // fallback

    const preset = stylePresets[styleKey];
    
    // Extract layout for the active room type
    const mappedRoomType = roomType || "living-room";
    const rawLayout = preset.layouts[mappedRoomType] || preset.layouts["living-room"];

    // Return custom explanations matching user description input
    const customExplanation = `Based on your request "${description || "Cozy, functional layout"}" with a focus on ${preferences || "balance and style"}, we generated a ${preset.name} configuration. ${preset.description}`;

    const responsePayload = {
      recommendations: {
        colors: {
          walls: preset.materials.walls.color,
          floor: preset.materials.floor.color,
          description: `Wall color: ${preset.materials.walls.color} (${preset.materials.walls.texture}) paired with ${preset.materials.floor.color} flooring.`
        },
        materials: preset.materials,
        lighting: preset.lighting,
        furniture: rawLayout,
        explanation: preset.description
      },
      explanation: customExplanation,
      imagePrompt: `A photorealistic, highly detailed 3D interior design render of a ${preset.name} ${mappedRoomType}, embodying: ${description || "cozy atmosphere, soft shadows, luxury interior photography, 8k resolution"}.`,
      imageUrl: preset.imageUrl
    };

    return Response.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error("[AI Suggestion API] Error:", error);
    return Response.json(
      { message: "Internal server error generating suggestions" },
      { status: 500 }
    );
  }
}
