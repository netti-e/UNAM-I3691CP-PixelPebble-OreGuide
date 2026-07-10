// scripts/seed-firestore.js
// Pushes ores, mines, and educational content to Firestore.
// Uses the Admin SDK, which bypasses security rules (client writes to these
// collections are denied by firestore.rules).
//
// Setup (one-time):
//   1. Firebase console → Project settings → Service accounts → Generate new private key
//   2. Save the JSON as scripts/service-account.json (gitignored), or point
//      GOOGLE_APPLICATION_CREDENTIALS at wherever you saved it.
// Run with: node scripts/seed-firestore.js

const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');

const keyPath =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.resolve(__dirname, 'service-account.json');

if (!fs.existsSync(keyPath)) {
  console.error(
    `❌ Service account key not found at: ${keyPath}\n` +
    'Download one from Firebase console → Project settings → Service accounts,\n' +
    'save it as scripts/service-account.json, or set GOOGLE_APPLICATION_CREDENTIALS.'
  );
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(keyPath)),
});

const db = admin.firestore();

// ── Ores ──────────────────────────────────────────────────────────────────────

const ORES = [
  {
    oreID: 'ore-malachite',
    name: 'Malachite',
    color: 'Bright green with banded patterns',
    hardness: '3.5 – 4',
    chemicalComposition: 'Cu₂(CO₃)(OH)₂',
    uses: 'Ornamental gemstone, pigment, copper ore. Namibia\'s Tsumeb Mine produced world-class specimens used in jewellery, carvings, and museum collections globally.',
    imageSamples: ['https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/MalachiteUSGOV.jpg/800px-MalachiteUSGOV.jpg'],
  },
  {
    oreID: 'ore-gold',
    name: 'Gold',
    color: 'Metallic yellow',
    hardness: '2.5 – 3',
    chemicalComposition: 'Au',
    uses: 'Monetary reserve, electronics, jewellery, aerospace components. Namibia\'s Navachab and Otjikoto mines are major producers for the southern African gold circuit.',
    imageSamples: ['https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/GoldNuggetUSGS19887.jpg/800px-GoldNuggetUSGS19887.jpg'],
  },
  {
    oreID: 'ore-uranium',
    name: 'Uraninite (Uranium Ore)',
    color: 'Black to brownish-black, sometimes grey',
    hardness: '5 – 6',
    chemicalComposition: 'UO₂',
    uses: 'Nuclear fuel for power generation. Namibia is one of the world\'s top-3 uranium producers via Rössing and Husab mines, supplying reactors across Europe and Asia.',
    imageSamples: ['https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Pitchblende_schlema-alberoda.jpg/800px-Pitchblende_schlema-alberoda.jpg'],
  },
  {
    oreID: 'ore-chalcopyrite',
    name: 'Chalcopyrite',
    color: 'Brass-yellow with iridescent tarnish',
    hardness: '3.5 – 4',
    chemicalComposition: 'CuFeS₂',
    uses: 'Primary copper ore globally. Smelted to produce copper for electrical wiring, plumbing, industrial machinery, and alloy production.',
    imageSamples: ['https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Chalcopyrite-Sphalerite-Galena-chalc28b.jpg/800px-Chalcopyrite-Sphalerite-Galena-chalc28b.jpg'],
  },
  {
    oreID: 'ore-sphalerite',
    name: 'Sphalerite',
    color: 'Brown to black, sometimes yellow or red',
    hardness: '3.5 – 4',
    chemicalComposition: 'ZnS',
    uses: 'Principal zinc ore. Zinc is critical for galvanising steel, die-casting alloys, sunscreen, and battery anodes. The Skorpion Zinc Mine near Rosh Pinah is one of Africa\'s largest zinc operations.',
    imageSamples: ['https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Sphalerite-177181.jpg/800px-Sphalerite-177181.jpg'],
  },
  {
    oreID: 'ore-galena',
    name: 'Galena',
    color: 'Lead-grey with bright metallic lustre',
    hardness: '2.5',
    chemicalComposition: 'PbS',
    uses: 'Primary lead ore. Used in car batteries, radiation shielding, soundproofing, and historically in pipes and solder. Rosh Pinah is a major galena and sphalerite deposit.',
    imageSamples: ['https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Galena_chunk.jpg/800px-Galena_chunk.jpg'],
  },
  {
    oreID: 'ore-diamond',
    name: 'Diamond',
    color: 'Colourless to pale yellow; rare blues and pinks',
    hardness: '10',
    chemicalComposition: 'C',
    uses: 'Gemstone, industrial abrasive, cutting tools, semiconductors. Namibia\'s Sperrgebiet coastal strip and Namdeb marine operations recover gem-quality diamonds from ancient ocean terraces.',
    imageSamples: ['https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Carbon_diamond_crystal.jpg/800px-Carbon_diamond_crystal.jpg'],
  },
  {
    oreID: 'ore-tourmaline',
    name: 'Tourmaline',
    color: 'Black (schorl), green, pink, or multi-coloured',
    hardness: '7 – 7.5',
    chemicalComposition: 'NaFe₃Al₆(BO₃)₃Si₆O₁₈(OH)₄',
    uses: 'Gemstone, piezoelectric sensors, pressure gauges. Namibia\'s Erongo and Brandberg pegmatites produce spectacular schorl and multi-coloured elbaite crystals prized by collectors worldwide.',
    imageSamples: ['https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Tourmaline-118682.jpg/800px-Tourmaline-118682.jpg'],
  },
  {
    oreID: 'ore-aquamarine',
    name: 'Aquamarine',
    color: 'Sky blue to sea-green, vitreous lustre',
    hardness: '7.5 – 8',
    chemicalComposition: 'Be₃Al₂Si₆O₁₈',
    uses: 'Premium gemstone in jewellery and lapidary. Namibia\'s Erongo Mountains and Brandberg area yield exceptional gem-quality crystals exported to cutting centres in Germany and the USA.',
    imageSamples: ['https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Aquamarine_on_muscovite-RoyalOntarioMuseum-Jan18-09.jpg/800px-Aquamarine_on_muscovite-RoyalOntarioMuseum-Jan18-09.jpg'],
  },
  {
    oreID: 'ore-fluorite',
    name: 'Fluorite',
    color: 'Purple, green, blue, yellow, colourless',
    hardness: '4',
    chemicalComposition: 'CaF₂',
    uses: 'Flux in steel smelting, fluorochemical production, optics for UV lenses, and jewellery. Namibian fluorite fluoresces vividly under UV light and is a popular collector mineral.',
    imageSamples: ['https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Fluorite_with_Quartz_-_Silesia%2C_Poland.jpg/800px-Fluorite_with_Quartz_-_Silesia%2C_Poland.jpg'],
  },
  {
    oreID: 'ore-pyrite',
    name: 'Pyrite',
    color: 'Pale brass-yellow, metallic lustre',
    hardness: '6 – 6.5',
    chemicalComposition: 'FeS₂',
    uses: 'Sulphur and sulphuric acid production, iron ore, jewellery (fool\'s gold). Often associated with gold deposits. Cubic pyrite crystals from Namibian skarns are popular specimens.',
    imageSamples: ['https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Pyrite_60648.jpg/800px-Pyrite_60648.jpg'],
  },
  {
    oreID: 'ore-hematite',
    name: 'Hematite',
    color: 'Silver-grey to reddish-brown; red streak',
    hardness: '5.5 – 6.5',
    chemicalComposition: 'Fe₂O₃',
    uses: 'Primary iron ore globally. Used in steel, pigments (ochre), polishing compounds, and as an ornamental stone. Namibia has extensive banded iron formations in the Damara Belt.',
    imageSamples: ['https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/HematiteUSGOV.jpg/800px-HematiteUSGOV.jpg'],
  },
  {
    oreID: 'ore-azurite',
    name: 'Azurite',
    color: 'Deep azure blue to violet-blue',
    hardness: '3.5 – 4',
    chemicalComposition: 'Cu₃(CO₃)₂(OH)₂',
    uses: 'Ornamental stone, historical blue pigment in paintings, copper ore indicator mineral. Tsumeb Mine produced some of the finest azurite crystal clusters ever documented.',
    imageSamples: ['https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/AzuriteUSGS.jpg/800px-AzuriteUSGS.jpg'],
  },
];

// ── Mines ─────────────────────────────────────────────────────────────────────

const MINE_LOCATIONS = [
  {
    locationID: 'mine-tsumeb',
    oreID: 'ore-malachite',
    mineName: 'Tsumeb Mine',
    coordinates: { latitude: -19.2333, longitude: 17.7167 },
    accessPatterns: 'Historical Mine, Museum Access',
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
    accessPatterns: 'Active Mine, Restricted Access',
  },
  {
    locationID: 'mine-skorpion',
    oreID: 'ore-sphalerite',
    mineName: 'Skorpion Zinc Mine',
    coordinates: { latitude: -27.85, longitude: 16.5833 },
    accessPatterns: 'Active Mine, Restricted Access',
  },
  {
    locationID: 'mine-roshpinah',
    oreID: 'ore-galena',
    mineName: 'Rosh Pinah Mine',
    coordinates: { latitude: -27.9167, longitude: 16.7333 },
    accessPatterns: 'Active Mine, Restricted Access',
  },
  {
    locationID: 'mine-husab',
    oreID: 'ore-uranium',
    mineName: 'Husab Uranium Mine',
    coordinates: { latitude: -22.2833, longitude: 15.1167 },
    accessPatterns: 'Active Mine, Highly Restricted Access',
  },
  {
    locationID: 'mine-otjikoto',
    oreID: 'ore-gold',
    mineName: 'Otjikoto Gold Mine',
    coordinates: { latitude: -19.0667, longitude: 17.0333 },
    accessPatterns: 'Active Mine, Restricted Access',
  },
  {
    locationID: 'mine-langerheinrich',
    oreID: 'ore-uranium',
    mineName: 'Langer Heinrich Mine',
    coordinates: { latitude: -23.35, longitude: 15.3333 },
    accessPatterns: 'Active Mine, Restricted Access',
  },
  {
    locationID: 'mine-erongo',
    oreID: 'ore-tourmaline',
    mineName: 'Erongo Pegmatite Fields',
    coordinates: { latitude: -21.5, longitude: 15.9333 },
    accessPatterns: 'Semi-open, Guided Access Available',
  },
  {
    locationID: 'mine-uis',
    oreID: 'ore-aquamarine',
    mineName: 'Uis Gem Mine',
    coordinates: { latitude: -21.2, longitude: 14.8333 },
    accessPatterns: 'Open Artisanal Mining Area',
  },
  {
    locationID: 'mine-matchless',
    oreID: 'ore-chalcopyrite',
    mineName: 'Matchless Copper Mine',
    coordinates: { latitude: -22.5167, longitude: 17.25 },
    accessPatterns: 'Historical Mine, Restricted Access',
  },
  {
    locationID: 'mine-namdeb',
    oreID: 'ore-diamond',
    mineName: 'Namdeb Diamond Coast',
    coordinates: { latitude: -27.45, longitude: 15.6667 },
    accessPatterns: 'Restricted — Sperrgebiet Zone',
  },
  {
    locationID: 'mine-brandberg',
    oreID: 'ore-fluorite',
    mineName: 'Brandberg West Mine',
    coordinates: { latitude: -20.9667, longitude: 13.9 },
    accessPatterns: 'Historical Mine, Public Access to Area',
  },
];

// ── Educational Content ───────────────────────────────────────────────────────

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

async function seedOres() {
  console.log('\n💎 Seeding ores collection...');
  for (const ore of ORES) {
    await db.collection('ores').doc(ore.oreID).set(ore);
    console.log(`  ✓ ${ore.name}`);
  }
}

async function seedMines() {
  console.log('\n📍 Seeding mines collection...');
  for (const mine of MINE_LOCATIONS) {
    await db.collection('mines').doc(mine.locationID).set(mine);
    console.log(`  ✓ ${mine.mineName}`);
  }
}

async function seedEducationalContent() {
  console.log('\n📚 Seeding educationalContent collection...');
  for (const [, section] of Object.entries(EDUCATIONAL_CONTENT)) {
    await db.collection('educationalContent').doc(section.sectionID).set(section);
    console.log(`  ✓ ${section.title}`);
  }
}

// ── Run ───────────────────────────────────────────────────────────────────────

(async () => {
  try {
    await seedOres();
    await seedMines();
    await seedEducationalContent();
    console.log('\n✅ Firestore seed complete.\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
    process.exit(1);
  }
})();
