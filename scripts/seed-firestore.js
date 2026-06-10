// scripts/seed-firestore.js
// Pushes local static data (mines + educational content) to Firestore.
// Run with: node scripts/seed-firestore.js

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// ── Firebase config (from .env) ──────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY?.trim(),
  authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim(),
  projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID?.trim(),
  storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim(),
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim(),
  appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID?.trim(),
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── Data ─────────────────────────────────────────────────────────────────────

const MINE_LOCATIONS = [
  {
    locationID: 'mine-tsumeb',
    oreID: 'ore-malachite',
    mineName: 'Tsumeb Mine',
    coordinates: { latitude: -19.2333, longitude: 17.7167 },
    accessPatterns: 'Active Mine (Historical), Restricted Access',
  },
  {
    locationID: 'mine-navachab',
    oreID: 'ore-gold',
    mineName: 'Navachab Gold Mine',
    coordinates: { latitude: -21.9833, longitude: 15.7667 },
    accessPatterns: 'Active Mine, Restricted Access',
  },
  {
    locationID: 'mine-rossing',
    oreID: 'ore-uranium',
    mineName: 'Rössing Uranium Mine',
    coordinates: { latitude: -22.4667, longitude: 15.0333 },
    accessPatterns: 'Active Mine, Highly Restricted Access',
  },
  {
    locationID: 'mine-ongopolo',
    oreID: 'ore-chalcopyrite',
    mineName: 'Ongopolo Copper Mine',
    coordinates: { latitude: -19.25, longitude: 17.65 },
    accessPatterns: 'Active Mine',
  },
];

const EDUCATIONAL_CONTENT = {
  basics: {
    sectionID: 'basics',
    title: 'Mineral Basics',
    description: 'Understand the foundational blocks of earth elements, crystal systems, advanced field testing, and physical chemistry.',
    topics: [
      {
        title: 'What is a Mineral?',
        content: 'A mineral is a naturally occurring, inorganic solid substance possessing a highly specific chemical composition and an ordered atomic lattice structure. Unlike rocks, which are heterogeneous mixtures of multiple mineral crystals, a pure mineral species stands completely uniform down to its crystalline framework.',
      },
      {
        title: 'The Seven Crystal Systems',
        content: 'Every mineral crystallizes into one of seven geometric internal configurations based on its atomic symmetry:\n\n• Cubic (Isometric): High symmetry, equal axes (e.g., Pyrite, Galena, Garnet)\n• Tetragonal: Three axes at right angles, one unique length (e.g., Chalcopyrite, Wulfenite)\n• Orthorhombic: Three unequal axes at right angles (e.g., Topaz, Barite)\n• Hexagonal: Six-sided prism profiles (e.g., Beryl/Emerald, Apatite)\n• Trigonal: Similar to hexagonal but lower symmetry (e.g., Quartz, Tourmaline, Calcite)\n• Monoclinic: Two right angles, one oblique inclination (e.g., Malachite, Gypsum)\n• Triclinic: Highly unsymmetrical, three unequal axes with no right angles (e.g., Feldspars, Amazonite)',
      },
      {
        title: 'The Mohs Hardness Scale',
        content: 'Developed by Friedrich Mohs, this standard scale measures scratch resistance from 1 (softest) to 10 (hardest). Field researchers use simple test kits to narrow down specimens immediately:\n\n1. Talc\n2. Gypsum\n3. Calcite\n4. Fluorite\n5. Apatite\n6. Orthoclase Feldspar\n7. Quartz\n8. Topaz\n9. Corundum / Ruby / Sapphire\n10. Diamond',
      },
      {
        title: 'Advanced Field Identification Techniques',
        content: 'Beyond raw color, professional geologists cross-examine multiple physical criteria:\n\n• Streak: The true color of a mineral\'s powder when dragged across an unglazed porcelain plate.\n• Luster: How a surface reflects light — Metallic or Non-Metallic (Vitreous, Adamantine, Resinous, Dull).\n• Cleavage & Fracture: Cleavage is a clean split along flat atomic planes; fracture is an irregular break.\n• Specific Gravity: The relative density of the mineral compared to water.',
      },
      {
        title: 'Tenacity, Luminescence & Diaphaneity',
        content: 'Higher-precision field diagnostics:\n\n• Tenacity: Brittle, Malleable, Sectile, or Elastic behavior under stress.\n• Diaphaneity: Transparent, Translucent, or Opaque light transmission.\n• Fluorescence: Minerals that absorb UV light and re-emit it as visible color — common in Namibian Fluorites and Scheelites.',
      },
    ],
  },
  geology: {
    sectionID: 'geology',
    title: 'Geology of Namibia',
    description: 'Explore ancient cratons, massive neoproterozoic continental smashups, structural faults, and spectacular mineral variations.',
    topics: [
      {
        title: 'The Damara Orogen (Central & Northern Namibia)',
        content: 'Formed between 650 and 500 million years ago during the assembly of the Gondwana supercontinent. This tectonic belt created exceptional economic mineral zones including carbonate-hosted base metal zones and pegmatites loaded with lithium minerals, tourmaline, topaz, and industrial quartz.',
      },
      {
        title: 'The Tsumeb Pipe Anomaly',
        content: 'A geological wonder — a vertical mineralized karst pipe penetrating ancient dolomite beds. Hydrothermal fluids rich in copper, lead, zinc, arsenic, and silver produced over 300 distinct mineral types, including dozens found nowhere else on earth.',
      },
      {
        title: 'The Ancient Cratonic Framework',
        content: 'Namibia is stabilized by rigid blocks of primordial crust:\n\n• The Congo Craton: Borders the far northern region, providing basement rocks several billion years old.\n• The Kalahari Craton: Spans the eastern edges, buried beneath the Kalahari Desert, sealing deep volcanic and metamorphic layers.',
      },
      {
        title: 'The Erongo & Brandberg Granitic Complexes',
        content: 'Dating back roughly 130 million years to the rifting of Africa and South America. As magma chambers cooled, they generated coarse pegmatite pockets packed with aquamarine, black tourmaline, jeremejevite, and fluorite crystals.',
      },
      {
        title: 'Major Structural Fault Lines & Shear Belts',
        content: 'Crustal movement left fracture networks that acted as subterranean conduits for mineral-rich fluids:\n\n• The Omaruru Lineament: A deep crustal boundary defining key pegmatite swarm limits.\n• The Waterberg Fault: A post-Karoo fault cutting northeast across northern-central Namibia, pushing ancient sandstone into flat-topped plateaus.',
      },
    ],
  },
  mining: {
    sectionID: 'mining',
    title: 'Mining Sector & Economic History',
    description: 'An in-depth look at global uranium operations, diamond collection, economic frameworks, and critical green-energy materials.',
    topics: [
      {
        title: 'The Century-Old Mining Footprint',
        content: 'Namibia\'s industrial mining era began in 1908 when railway worker Zacharias Lewala discovered a diamond near Lüderitz. This triggered the coastal diamond rush, generating the historic Sperrgebiet (Forbidden Zone) and settlements like Kolmanskop — now a ghost town reclaimed by the dunes.',
      },
      {
        title: 'Marine Diamond Recovery Engineering',
        content: 'Advanced mining vessels crawl along the seabed hundreds of meters deep, using heavy-duty suction tractors to filter diamond-bearing gravel from the ocean floor — one of the world\'s most unique marine engineering operations.',
      },
      {
        title: 'Global Tier-1 Uranium Production',
        content: 'Namibia is one of the top three uranium producers globally:\n\n• Rössing Mine: Operational since 1976, one of the largest uranium producers on Earth.\n• Husab Mine: A state-of-the-art mega-scale open-pit operation, one of the largest bulk-tonnage uranium deposits ever developed.',
      },
      {
        title: 'Base Metals, Gold, and Industrial Minerals',
        content: '• Navachab Gold Mine: A massive hard-rock open-pit operation outside Karibib.\n• Rosh Pinah & Skorpion Zinc: Major underground and open-pit operations near the southern border.\n• Otjikoto Gold Mine: A highly productive site in north-central Namibia.',
      },
      {
        title: 'Critical Raw Minerals for the Green Transition',
        content: 'Namibia\'s pegmatites are strategically vital for the global clean-energy shift:\n\n• Lithium: Deposits around Karibib, Uis, and the Erongo region host Lepidolite, Spodumene, and Petalite — key for EV batteries.\n• Rare Earth Elements: Areas such as Lofdal focus on heavy REEs like Dysprosium and Terbium, essential for wind turbine and EV motor magnets.',
      },
    ],
  },
};

// ── Seed functions ────────────────────────────────────────────────────────────

async function seedMines() {
  console.log('\n📍 Seeding mines collection...');
  for (const mine of MINE_LOCATIONS) {
    await setDoc(doc(db, 'mines', mine.locationID), mine);
    console.log(`  ✓ ${mine.mineName}`);
  }
}

async function seedEducationalContent() {
  console.log('\n📚 Seeding educationalContent collection...');
  for (const [, section] of Object.entries(EDUCATIONAL_CONTENT)) {
    await setDoc(doc(db, 'educationalContent', section.sectionID), section);
    console.log(`  ✓ ${section.title}`);
  }
}

// ── Run ───────────────────────────────────────────────────────────────────────

(async () => {
  try {
    await seedMines();
    await seedEducationalContent();
    console.log('\n✅ Firestore seed complete.\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
    process.exit(1);
  }
})();
