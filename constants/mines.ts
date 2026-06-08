import { MineLocation } from '../types/ore';

export const MOCK_MINE_LOCATIONS: MineLocation[] = [
  {
    locationID: 'mine-tsumeb',
    oreID: 'ore-malachite',
    mineName: 'Tsumeb Mine',
    coordinates: {
      latitude: -19.2333,
      longitude: 17.7167,
    },
    accessPatterns: 'Active Mine (Historical), Restricted Access',
  },
  {
    locationID: 'mine-navachab',
    oreID: 'ore-gold', // Assuming a generic gold ID for now
    mineName: 'Navachab Gold Mine',
    coordinates: {
      latitude: -21.9833,
      longitude: 15.7667,
    },
    accessPatterns: 'Active Mine, Restricted Access',
  },
  {
    locationID: 'mine-rossing',
    oreID: 'ore-uranium', // Assuming a generic uranium ID
    mineName: 'Rössing Uranium Mine',
    coordinates: {
      latitude: -22.4667,
      longitude: 15.0333,
    },
    accessPatterns: 'Active Mine, Highly Restricted Access',
  },
  {
    locationID: 'mine-ongopolo',
    oreID: 'ore-chalcopyrite',
    mineName: 'Ongopolo Copper Mine',
    coordinates: {
      latitude: -19.25,
      longitude: 17.65,
    },
    accessPatterns: 'Active Mine',
  }
];
