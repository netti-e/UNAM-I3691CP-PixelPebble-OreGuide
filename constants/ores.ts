// [STATUS: EDIT] — Injected master-tier mineralogical data, structural lineaments, and green-energy critical raw mineral (CRM) profiles


export interface LocationData {
  locationID: string;
  oreID: string;
  mineName: string;
  coordinates: { lat: number; lng: number };
  accessPatterns: string;
}

export const EDUCATIONAL_CONTENT = {
  basics: {
    title: "Mineral Basics",
    description: "Understand the foundational blocks of earth elements, crystal systems, advanced field testing, and physical chemistry.",
    topics: [
      {
        title: "What is a Mineral?",
        content: "A mineral is a naturally occurring, inorganic solid substance possessing a highly specific chemical composition and an ordered atomic lattice structure. Unlike rocks, which are heterogeneous mixtures of multiple mineral crystals, a pure mineral species stands completely uniform down to its crystalline framework."
      },
      {
        title: "The Seven Crystal Systems",
        content: "Every mineral crystallizes into one of seven geometric internal configurations based on its atomic symmetry:\n\n• Cubic (Isometric): High symmetry, equal axes (e.g., Pyrite, Galena, Garnet)\n• Tetragonal: Three axes at right angles, one unique length (e.g., Chalcopyrite, Wulfenite)\n• Orthorhombic: Three unequal axes at right angles (e.g., Topaz, Barite)\n• Hexagonal: Six-sided prism profiles (e.g., Beryl/Emerald, Apatite)\n• Trigonal: Similar to hexagonal but lower symmetry (e.g., Quartz, Tourmaline, Calcite)\n• Monoclinic: Two right angles, one oblique inclination (e.g., Malachite, Gypsum)\n• Triclinic: Highly unsymmetrical, three unequal axes with no right angles (e.g., Feldspars, Amazonite)"
      },
      {
        title: "The Mohs Hardness Scale",
        content: "Developed by Friedrich Mohs, this standard scale measures scratch resistance from 1 (softest) to 10 (hardest). Field researchers use simple test kits to narrow down specimens immediately:\n\n1. Talc (Scratched easily by a soft fingernail)\n2. Gypsum (Scratched by a standard fingernail)\n3. Calcite (Scratched by a copper coin)\n4. Fluorite (Easily scratched by a pocket knife)\n5. Apatite (Scratched by a knife with effort)\n6. Orthoclase Feldspar (Scratched by a steel file; scratches glass)\n7. Quartz (Scratches glass easily; unbothered by steel)\n8. Topaz (Scratches quartz)\n9. Corundum / Ruby / Sapphire (Scratches topaz)\n10. Diamond (Hardest substance; scratches all other materials)"
      },
      {
        title: "Advanced Field Identification Techniques",
        content: "Beyond raw color, professional geologists cross-examine multiple physical criteria:\n\n• Streak: The true color of a mineral's powder when dragged across an unglazed porcelain plate. (e.g., Golden Pyrite leaves a dark greenish-black streak, differentiating it from real gold).\n• Luster: How a surface reflects light. Broadly categorized into Metallic (shiny metal look) and Non-Metallic (Vitreous/glassy, Adamantine/diamond-like, Resinous, or Dull).\n• Cleavage & Fracture: Cleavage is a clean split along flat atomic planes of weakness (like Mica sheets or Calcite rhombohedrons). Fracture is an irregular, jagged break (like the smooth, curved conchoidal fractures found in Quartz or Obsidian).\n• Specific Gravity: The relative density of the mineral compared to water. Heavy elements like Galena (lead ore) feel surprisingly heavy for their visual scale."
      },
      {
        title: "Tenacity, Luminescence & Diaphaneity",
        content: "When field diagnostics require higher precision, look closely at how elements handle mechanical deformation and light waves:\n\n• Tenacity: Describes a mineral's cohesive behavior under stress. Minerals can be Brittle (shatter when hit, like Quartz), Malleable (can be hammered into sheets, like Native Copper), Sectile (can be sliced clean with a field knife, like Gypsum), or Elastic (bends but snaps straight back to shape, like Biotite/Mica tabs).\n• Diaphaneity: The capacity to pass light rays. Splintered into Transparent (read text cleanly through the crystal body), Translucent (light enters but scatters completely, masking true shapes behind it), and Opaque (zero light absorption/transmission).\n• Fluorescence: A physical optical property where minerals absorb invisible short-wave or long-wave ultraviolet light and re-emit it as radiant, glowing colors. Highly apparent in Namibian Fluorites, Scheelites (tungsten ore), and specific Calcite/Aragonite cave groupings."
      }
    ]
  },
  geology: {
    title: "Geology of Namibia",
    description: "Explore ancient cratons, massive neoproterozoic continental smashups, structural faults, and spectacular mineral variations.",
    topics: [
      {
        title: "The Damara Orogen (Central & Northern Namibia)",
        content: "Formed between 650 and 500 million years ago during the assembly of the Gondwana supercontinent, this tectonic belt represents an ancient ocean basin trapped and compressed between colliding continental plates. This intense metamorphic twisting created exceptional economic mineral zones:\n\n• The Northern Zone: Host to world-class carbonate-hosted base metal zones.\n• The Central Zone: Heavily penetrated by ancient granite intrusions, forming rich pegmatites loaded with lithium minerals, tourmaline, topaz, and industrial quartz deposits."
      },
      {
        title: "The Tsumeb Pipe Anomaly",
        content: "A geological wonder, the Tsumeb orebody was a vertical, mineralized karst pipe that penetrated deep into ancient dolomite beds. Hydrothermal fluids rich in copper, lead, zinc, arsenic, and silver leaked through this structural weak point. Because the surrounding water table caused heavy oxidation, it produced over 300 distinct mineral types—including dozens found nowhere else on earth. It is highly prized globally for vibrant azurite, green malachite, and glassy dioptase crystals."
      },
      {
        title: "The Ancient Cratonic Framework",
        content: "Namibia is structurally stabilized by rigid blocks of primordial crust:\n\n• The Congo Craton: Borders the far northern region, providing stable basement rocks several billion years old.\n• The Kalahari Craton: Spans the eastern edges of the country, buried beneath the younger Kalahari Desert sand systems, sealing away deep-seated volcanic and metamorphic layers."
      },
      {
        title: "The Erongo & Brandberg Granitic Complexes",
        content: "Dating back roughly 130 million years to the breaking apart of Africa and South America, massive magma chambers breached the surface in western Namibia. As these cooled slow and steady underground, they generated coarse pegmatite pockets. Today, erosion reveals these structures as dominant mountains (Brandberg and the Erongo massifs), packed with premium aquamarine, black schorl tourmaline, jeremejevite, and fluorite crystals."
      },
      {
        title: "Major Structural Fault Lines & Shear Belts",
        content: "Crustal movement left behind massive localized fracture networks that acted as subterranean superhighways for mineral-rich volcanic fluids:\n\n• The Omaruru Lineament: A fundamental deep crustal structural boundary crossing the Damara Orogen, defining key geographical limits for hot fluid placements and setting boundaries for historic pegmatite swarms.\n• The Waterberg Fault: A prominent active post-Karoo fault system cutting southwest to northeast across northern-central Namibia. It pushes ancient sandstone formations up high into the sky, creating the famous step-sided flat plateaus of the Waterberg Water-Catchment Wilderness."
      }
    ]
  },
  mining: {
    title: "Mining Sector & Economic History",
    description: "An in-depth look at global uranium operations, diamond collection, economic frameworks, and critical green-energy materials.",
    topics: [
      {
        title: "The Century-Old Mining Footprint",
        content: "Namibia's industrial mining era officially kicked off in 1908 when railway worker Zacharias Lewala discovered a glittering diamond in the sands near Lüderitz. This triggered a massive coastal diamond rush, generating the historic 'Sperrgebiet' (Forbidden Zone) and coastal settlements like Kolmanskop (now a famous ghost town reclaimed by the dunes)."
      },
      {
        title: "Marine Diamond Recovery Engineering",
        content: "While early diamond mining took place directly in the sand dunes, Namibia's premium diamond reserves have shifted offshore. Over millions of years, the Orange River washed high-quality alluvial diamonds from Central South African cratons out into the Atlantic Ocean, where coastal currents deposited them along the Namib coast.\n\nToday, advanced mining vessels crawl along the seabed hundreds of meters deep, utilizing heavy-duty suction tractors to filter diamond-bearing gravel from the ocean floor in one of the world's most unique marine engineering operations."
      },
      {
        title: "Global Tier-1 Uranium Production",
        content: "Namibia is one of the top three uranium producers globally, thanks to massive low-grade deposits locked within the central Namib Desert:\n\n• Rössing Mine: Operational since 1976, this giant open-pit mine has produced more uranium oxide than almost any single site on Earth, carving out a massive crater in the desert landscape.\n• Husab Mine: Located near Rössing, Husab is a state-of-the-art mega-scale open-pit operation that represents one of the largest bulk-tonnage uranium deposits ever developed."
      },
      {
        title: "Base Metals, Gold, and Industrial Minerals",
        content: "Beyond diamonds and uranium, Namibia's mineral matrix drives steady economic development:\n\n• Navachab Gold Mine: A massive hard-rock open-pit recovery operation outside Karibib extracting gold from ancient sheeted quartz vein structures.\n• Rosh Pinah & Skorpion Zinc: Major underground and open-pit operations near the southern border processing heavy industrial volcanic sulfides.\n• Otjikoto Gold Mine: A highly productive site located in north-central Namibia, run with advanced automated processing systems."
      },
      {
        title: "Critical Raw Minerals for the Global Green Transition",
        content: "As the world trends towards electrification and clean battery ecosystems, Namibia's pegmatites have become strategically vital assets:\n\n• Lithium Explorations: High-volume pegmatite deposits around Karibib, Uis, and the Erongo region host substantial quantities of lithium-bearing minerals like Lepidolite, Spodumene, and Petalite—key ingredients for global electric vehicle battery grids.\n• Rare Earth Elements (REEs): Advanced mining exploration assets in areas such as Lofdal focus heavily on heavy rare earth elements, particularly Dysprosium ($Dy$) and Terbium ($Tb$). These elements are critically essential for building high-strength permanent magnets used inside modern wind turbines and electric motors."
      }
    ]
  }
};