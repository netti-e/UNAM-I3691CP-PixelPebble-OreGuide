import type { Ore } from '../types/ore';

export const FEATURED_ORES: Ore[] = [
  {
    oreID: 'ore-malachite',
    name: 'Malachite',
    color: 'Green',
    hardness: '3.5 - 4',
    chemicalComposition: 'Cu2CO3(OH)2',
    uses: 'Copper ore, pigments, ornamental stone',
    imageSamples: [
      'https://firebasestorage.googleapis.com/v0/b/oreguide-95c75.firebasestorage.app/o/ore-photos%2Fmalachite%2Fmalachite-main.png?alt=media&token=596fe449-d4ef-4476-8843-b1c38d605651',
    ],
  },
  {
    oreID: 'ore-chalcopyrite',
    name: 'Chalcopyrite',
    color: 'Brassy yellow',
    hardness: '3.5 - 4',
    chemicalComposition: 'CuFeS2',
    uses: 'Primary copper ore',
    imageSamples: [
      'https://firebasestorage.googleapis.com/v0/b/oreguide-95c75.firebasestorage.app/o/ore-photos%2Fchalcopyrite%2Fchalcopyrite-main.jpeg?alt=media&token=2869665d-af20-414e-8567-0664ac9b2f0e',
    ],
  },
  {
    oreID: 'ore-hematite',
    name: 'Hematite',
    color: 'Steel grey to reddish brown',
    hardness: '5.5 - 6.5',
    chemicalComposition: 'Fe2O3',
    uses: 'Major iron ore, pigments, polishing compounds',
    imageSamples: [
      'https://firebasestorage.googleapis.com/v0/b/oreguide-95c75.firebasestorage.app/o/ore-photos%2Fhematite%2Fhematite-main.jpeg?alt=media&token=7eae5b56-8bfc-4e54-865a-8f2924175247',
    ],
  },
];