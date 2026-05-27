export const PALETTE = {
  namibOrange: '#D35400',    // Evocative of the Sossusvlei dunes / oxidized iron
  malachiteGreen: '#27AE60', // Representative of copper carbonate minerals found in Tsumeb
  copperGold: '#D4AF37',     // Mineral accents
  deepCharcoal: '#1A1A1A',   // High-contrast legible text base
  rockGray: '#7F8C8D',       // Secondary descriptive properties
  offWhite: '#FAFAFA',       // Screen backgrounds
  pureWhite: '#FFFFFF',      // Card elevations
  errorRed: '#C0392B',       // Form and API fault statuses
};

export const THEME = {
  colors: {
    primary: PALETTE.namibOrange,
    secondary: PALETTE.malachiteGreen,
    accent: PALETTE.copperGold,
    background: PALETTE.offWhite,
    surface: PALETTE.pureWhite,
    text: PALETTE.deepCharcoal,
    textMuted: PALETTE.rockGray,
    border: '#E0E0E0',
    error: PALETTE.errorRed,
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 34,
    },
    h2: {
      fontSize: 22,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
  },
};