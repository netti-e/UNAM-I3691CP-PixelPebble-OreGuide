// hooks/use-ore-search.ts

import { useCallback, useEffect, useState } from 'react';
import { ALL_ORES } from '../constants/ores';
import { fetchAllOres } from '../services/firestore';
import { Ore } from '../types/ore';

export function useOreSearch() {
  const [allOres, setAllOres] = useState<Ore[]>([]);
  const [filteredOres, setFilteredOres] = useState<Ore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOfflineFallback, setIsOfflineFallback] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllOres();
      setAllOres(data);
      setFilteredOres(data);
      setIsOfflineFallback(false);
    } catch (err) {
      console.warn("Firestore collection access failed. Using local storage dictionary:", err);
      setAllOres(ALL_ORES);
      setFilteredOres(ALL_ORES);
      setIsOfflineFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    let output = [...allOres];

    if (searchQuery.trim().length > 0) {
      const cleanQuery = searchQuery.toLowerCase();
      output = output.filter(ore => 
        ore.name.toLowerCase().includes(cleanQuery) || 
        ore.chemicalComposition.toLowerCase().includes(cleanQuery)
      );
    }

    if (selectedColor) {
      const cleanColor = selectedColor.toLowerCase();
      output = output.filter(ore => ore.color.toLowerCase().includes(cleanColor));
    }

    if (selectedElement) {
      const symbolMatch = /\(([^)]+)\)/.exec(selectedElement);
      const criteria = symbolMatch ? symbolMatch[1].toLowerCase() : selectedElement.toLowerCase();
      output = output.filter(ore => ore.chemicalComposition.toLowerCase().includes(criteria));
    }

    setFilteredOres(output);
  }, [searchQuery, selectedColor, selectedElement, allOres]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedColor(null);
    setSelectedElement(null);
  }, []);

  return {
    ores: filteredOres,
    loading,
    error,
    isOfflineFallback,
    searchQuery,
    setSearchQuery,
    selectedColor,
    setSelectedColor,
    selectedElement,
    setSelectedElement,
    resetFilters,
    refetch: loadInitialData
  };
}