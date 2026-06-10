// constants/ores.ts

import { Ore } from '../types/ore';

export const FEATURED_ORES: Ore[] = [
  {
    oreID: 'ore-chalcopyrite',
    name: 'Chalcopyrite',
    color: 'Brass-yellow to golden yellow',
    hardness: '3.5 – 4',
    chemicalComposition: 'CuFeS2',
    uses: 'Main ore for extracting copper; used in electrical wiring, electronics, and alloys',
    imageSamples: [
      'https://firebasestorage.googleapis.com/v0/b/oreguide-95c75.firebasestorage.app/o/ore-photos%2Fchalcopyrite%2Fchalcopyrite-main.jpeg?alt=media&token=2869665d-af20-414e-8567-0664ac9b2f0e'
    ]
  },
  {
    oreID: 'ore-malachite',
    name: 'Malachite',
    color: 'Bright Green / Dark Banded Green',
    hardness: '3.5 - 4.0 Mohs',
    chemicalComposition: 'Cu2CO3(OH)2',
    uses: 'Major source of elemental copper, ornamental stonecarving, local artisan gemstone.',
    imageSamples: [
      'https://images.unsplash.com/photo-1615486511216-7577ef5033fb?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    oreID: 'ore-hematite',
    name: 'Hematite',
    color: 'Metallic Grey / Reddish-Brown',
    hardness: '5.5 - 6.5 Mohs',
    chemicalComposition: 'Fe2O32',
    uses: 'Primary industrial iron source for steel production, pigments, structural manufacturing.',
    imageSamples: [
      'https://images.unsplash.com/photo-1515516969-d4008cc6241a?q=80&w=600&auto=format&fit=crop'
    ]
  }
];

export const ALL_ORES: Ore[] = [...FEATURED_ORES];