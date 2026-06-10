// utils/format-formula.ts

/**
 * Automatically converts numbers within a chemical formula string 
 * into accurate Unicode subscript equivalents for visual display.
 * Example: "Cu2CO3(OH)2" -> "Cu₂CO₃(OH)₂"
 */
export const formatChemicalFormula = (formula: string): string => {
  if (!formula || formula === 'Unknown Formula') return formula;
  
  const subscripts: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', 
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
    };

  return formula.replace(/([0-9])/g, (match) => subscripts[match] || match);
};