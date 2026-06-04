/**
 * Real e-commerce marketplace products database.
 * Matches local 3D catalog item models and provides pricing, dimensions,
 * brand references, and images for e-commerce catalog integrations.
 */

export const marketplaceProducts = [
  // ── Category: Sofas ──
  {
    id: "prod-sofa-1",
    name: "Kivik 3-Seat Sofa",
    brand: "IKEA",
    price: 799,
    category: "Sofas",
    dimensions: { width: 228, height: 83, depth: 95 }, // in cm
    image: "/images/products/kivik.png",
    catalogItemId: "sofa-3seat",
    description: "Generous seating with memory foam cushions that adapt to your body curves."
  },
  {
    id: "prod-sofa-2",
    name: "Haven Velvet Loveseat",
    brand: "West Elm",
    price: 1499,
    category: "Sofas",
    dimensions: { width: 172, height: 81, depth: 90 },
    image: "/images/living-room.jpg",
    catalogItemId: "sofa-2seat",
    description: "Deep, comfy cushions upholstered in hand-finished distressed velvet fabric."
  },

  // ── Category: Beds ──
  {
    id: "prod-bed-1",
    name: "Malm Storage Bed Frame",
    brand: "IKEA",
    price: 499,
    category: "Beds",
    dimensions: { width: 210, height: 100, depth: 160 },
    image: "/images/products/malm.png",
    catalogItemId: "bed-king",
    description: "Veneered wood bed frame featuring 4 underbed drawers for storage."
  },
  {
    id: "prod-bed-2",
    name: "Emery Wood Canopy Bed",
    brand: "West Elm",
    price: 1299,
    category: "Beds",
    dimensions: { width: 215, height: 200, depth: 165 },
    image: "/images/bedroom.jpg",
    catalogItemId: "bed-king",
    description: "Elegant four-post canopy bed made of sustainably sourced solid wood."
  },

  // ── Category: Chairs ──
  {
    id: "prod-chair-1",
    name: "Poäng Armchair",
    brand: "IKEA",
    price: 199,
    category: "Chairs",
    dimensions: { width: 68, height: 100, depth: 82 },
    image: "/images/products/poang.png",
    catalogItemId: "armchair",
    description: "Bentwood frame with soft, genuine leather cushioning for natural flexibility."
  },
  {
    id: "prod-chair-2",
    name: "Slope Leather Office Chair",
    brand: "West Elm",
    price: 399,
    category: "Chairs",
    dimensions: { width: 55, height: 86, depth: 55 },
    image: "/images/office.jpg",
    catalogItemId: "office-chair",
    description: "Upholstered in top-grain aniline leather with a black powder-coated steel base."
  },

  // ── Category: Wardrobes ──
  {
    id: "prod-wardrobe-1",
    name: "Pax Wardrobe System",
    brand: "IKEA",
    price: 899,
    category: "Wardrobes",
    dimensions: { width: 100, height: 201, depth: 58 },
    image: "/images/bedroom.jpg",
    catalogItemId: "wardrobe",
    description: "Modular wardrobe system customizable with interior organizers and sliding doors."
  },
  {
    id: "prod-dresser-1",
    name: "Mid-Century 3-Drawer Dresser",
    brand: "West Elm",
    price: 799,
    category: "Wardrobes",
    dimensions: { width: 91, height: 76, depth: 45 },
    image: "/images/bedroom.jpg",
    catalogItemId: "dresser",
    description: "Crafted in FSC®-certified eucalyptus wood with brass drawer pull details."
  },

  // ── Category: Dining Tables ──
  {
    id: "prod-table-1",
    name: "Anton Solid Wood Dining Table",
    brand: "West Elm",
    price: 1099,
    category: "Dining Tables",
    dimensions: { width: 180, height: 76, depth: 90 },
    image: "/images/dining-room.jpg",
    catalogItemId: "dining-table-6",
    description: "Crafted from solid kiln-dried mango wood with unique grain details."
  },
  {
    id: "prod-table-2",
    name: "Jokkmokk Compact Dining Table",
    brand: "IKEA",
    price: 149,
    category: "Dining Tables",
    dimensions: { width: 118, height: 74, depth: 74 },
    image: "/images/dining-room.jpg",
    catalogItemId: "dining-table-4",
    description: "A compact solid pine table matching cozy breakfasts and dinners."
  },

  // ── Category: TV Units ──
  {
    id: "prod-tv-1",
    name: "Besta Media Bench",
    brand: "IKEA",
    price: 299,
    category: "TV Units",
    dimensions: { width: 180, height: 48, depth: 40 },
    image: "/images/living-room.jpg",
    catalogItemId: "tv-unit",
    description: "Clean modern design with push-open drawers to hide cables and electronics."
  },
  {
    id: "prod-tv-2",
    name: "Industrial Wood Console",
    brand: "Pottery Barn",
    price: 899,
    category: "TV Units",
    dimensions: { width: 152, height: 61, depth: 45 },
    image: "/images/living-room.jpg",
    catalogItemId: "tv-unit",
    description: "Raw mango wood top paired with a solid cast iron frame for warehouse vibes."
  },

  // ── Category: Curtains ──
  {
    id: "prod-curtain-1",
    name: "Ritva Heavy Linen Curtains",
    brand: "IKEA",
    price: 79,
    category: "Curtains",
    dimensions: { width: 145, height: 250, depth: 1 },
    image: "/images/living-room.jpg",
    catalogItemId: "element-curtain",
    description: "Thick linen weave filters natural light and blocks glare with soft textures."
  },
  {
    id: "prod-curtain-2",
    name: "Belgian Flax Linen Drapes",
    brand: "West Elm",
    price: 249,
    category: "Curtains",
    dimensions: { width: 150, height: 260, depth: 1 },
    image: "/images/living-room.jpg",
    catalogItemId: "element-curtain",
    description: "Belgian flax curtains woven with subtle variations for an organic look."
  },

  // ── Category: Lighting ──
  {
    id: "prod-light-1",
    name: "Hektar Floor Lamp",
    brand: "IKEA",
    price: 89,
    category: "Lighting",
    dimensions: { width: 30, height: 181, depth: 30 },
    image: "/images/products/hektar.png",
    catalogItemId: "light-floor-lamp",
    description: "Industrial steel design. Generously sized metal shade emits directed task light."
  },
  {
    id: "prod-light-2",
    name: "Mobile Brass Chandelier",
    brand: "West Elm",
    price: 599,
    category: "Lighting",
    dimensions: { width: 90, height: 80, depth: 90 },
    image: "/images/living-room.jpg",
    catalogItemId: "light-chandelier",
    description: "Mid-century style light fixture with 6 adjustable arms in a polished brass finish."
  }
];
