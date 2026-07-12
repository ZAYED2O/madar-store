const products = [
  {
    id: 1,
    name: "Minimalist Waffle Knit T-Shirt",
    handle: "waffle-knit-tshirt",
    price: 490,
    originalPrice: 650,
    category: "T-Shirts",
    badge: "Sale 25%",
    images: [
      "assets/waffle_shirt_1.png",
      "assets/waffle_shirt_2.png"
    ],
    sizes: ["M", "L", "XL", "2XL"],
    lowStock: true,
    rating: 4.9,
    reviewsCount: 38,
    description: "Designed for those who value quiet simplicity. Made from high-quality waffle texture fabric that is both breathable and structured. Featuring a relaxed modern fit, clean drop shoulder cut, and minimalist neck ribbing. Perfect for long coding sessions or casual gaming hangouts."
  },
  {
    id: 2,
    name: "Aesthetic Grey Sweatpants",
    handle: "grey-sweatpants",
    price: 680,
    originalPrice: 850,
    category: "Sweatpants",
    badge: "Best Seller",
    images: [
      "assets/grey_sweatpants_1.png",
      "assets/grey_sweatpants_2.png"
    ],
    sizes: ["M", "L", "XL", "2XL"],
    lowStock: false,
    rating: 4.8,
    reviewsCount: 52,
    description: "Ultimate comfort in physical space. Crafted from heavyweight fleece cotton blend to keep you cozy. Features a hidden drawstring waistband, clean elastic cuffs, side zippered pockets for your tech gear, and a clean, straight-leg profile that never sags."
  },
  {
    id: 3,
    name: "Developer Oversized Hoodie",
    handle: "developer-oversized-hoodie",
    price: 950,
    originalPrice: 1200,
    category: "Outfits",
    badge: "Sale 20%",
    images: [
      "assets/developer_hoodie_1.png",
      "assets/developer_hoodie_2.png"
    ],
    sizes: ["M", "L", "XL", "2XL"],
    lowStock: true,
    rating: 5.0,
    reviewsCount: 89,
    description: "The ideal uniform for typing code at 3 AM. A super-soft, heavyweight fleece lining with an oversized double-lined hood (comfortably fits large gaming headphones). Features minimalist tonal chest embroidery of raw console brackets, drop shoulders, and reinforced ribbed cuffs."
  },
  {
    id: 4,
    name: "Classic Ringer Tech Tee",
    handle: "ringer-tech-tee",
    price: 450,
    originalPrice: 550,
    category: "Ringer Tees",
    badge: "Sale 18%",
    images: [
      "assets/ringer_tee_1.png",
      "assets/ringer_tee_2.png"
    ],
    sizes: ["M", "L", "XL"],
    lowStock: false,
    rating: 4.7,
    reviewsCount: 17,
    description: "Retro design meets digital aesthetics. Contrast ribbing on collar and cuffs for a vintage look, cut from ultra-soft pre-shrunk cotton. Minimalist branding details on the hem, making it an understated daily driver."
  },
  {
    id: 5,
    name: "Minimal Comfort Tank Top",
    handle: "minimal-tank-top",
    price: 350,
    originalPrice: 450,
    category: "Tank Tops",
    badge: "Sale",
    images: [
      "assets/tank_top_1.png",
      "assets/tank_top_2.png"
    ],
    sizes: ["M", "L", "XL"],
    lowStock: false,
    rating: 4.6,
    reviewsCount: 14,
    description: "Breathable comfort for warm days. Features low-cut armholes, flatlock stitched seams to prevent friction, and premium ribbed cotton elasticity that maintains its shape wash after wash."
  },
  {
    id: 6,
    name: "Textured Knitted Sweater",
    handle: "knitted-sweater",
    price: 890,
    originalPrice: 1100,
    category: "Knitted Wear",
    badge: "New",
    images: [
      "assets/knitted_sweater_1.png",
      "assets/knitted_sweater_2.png"
    ],
    sizes: ["M", "L", "XL", "2XL"],
    lowStock: true,
    rating: 4.8,
    reviewsCount: 21,
    description: "Premium heavy-weight knit. Combines technical design language with organic cotton texture. Featuring horizontal structure lines across the chest and back, ribbed crewneck, and structured shoulder tailoring."
  },
  {
    id: 7,
    name: "Vintage Indigo Denim Jacket",
    handle: "denim-jacket",
    price: 1150,
    originalPrice: 1500,
    category: "Denim",
    badge: "Sale 23%",
    images: [
      "assets/denim_jacket_1.png",
      "assets/denim_jacket_2.png"
    ],
    sizes: ["M", "L", "XL"],
    lowStock: false,
    rating: 4.9,
    reviewsCount: 33,
    description: "Rugged exterior, premium interior. Made with authentic raw indigo denim designed to fade uniquely over time. Features custom matte-black steel hardware, deep interior pockets for tablets/e-readers, and a clean minimalist collar."
  },
  {
    id: 8,
    name: "Linear Striped Relaxed Shirt",
    handle: "striped-relaxed-shirt",
    price: 520,
    originalPrice: 650,
    category: "Striped Shirts",
    badge: "Sale 20%",
    images: [
      "assets/striped_shirt_1.png",
      "assets/striped_shirt_2.png"
    ],
    sizes: ["M", "L", "XL", "2XL"],
    lowStock: false,
    rating: 4.7,
    reviewsCount: 19,
    description: "Classic vertical thin stripes in muted slate and off-white. Made from an exceptionally soft linen-cotton blend that falls loosely and breathes naturally. Perfect for an effortlessly stylish work-from-home appearance."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = products;
}
