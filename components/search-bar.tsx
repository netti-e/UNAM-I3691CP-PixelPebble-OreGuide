// components/search-bar.tsx
// [STATUS: NEW] — Search input component with filter chips for colors and elements

import React from 'react';
import { StyleSheet, View, TextInput, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { THEME } from '../constants/theme';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedColor: string | null;
  setSelectedColor: (c: string | null) => void;
  selectedElement: string | null;
  setSelectedElement: (e: string | null) => void;
  onClearFilters: () => void;
}

const COMMON_COLORS = ['Green', 'Blue', 'Red', 'Grey', 'Yellow', 'White', 'Black', 'Metallic'];
const COMMON_ELEMENTS = ['Cu (Copper)', 'Fe (Iron)', 'Au (Gold)', 'Ag (Silver)', 'Pb (Lead)', 'Zn (Zinc)', 'U (Uranium)'];

export function SearchBar({
  searchQuery,
  setSearchQuery,
  selectedColor,
  setSelectedColor,
  selectedElement,
  setSelectedElement,
  onClearFilters
}: SearchBarProps) {
  
  const hasActiveFilters = searchQuery.length > 0 || selectedColor !== null || selectedElement !== null;

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.inputWrapper}>
        <Search size={20} color={THEME.colors.textMuted} />
        <TextInput
          style={styles.textInput}
          placeholder="Search minerals by name..."
          placeholderTextColor={THEME.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {hasActiveFilters && (
          <TouchableOpacity onPress={onClearFilters} style={styles.clearBtn}>
            <X size={16} color={THEME.colors.surface} />
          </TouchableOpacity>
        )}
      </View>

      {/* Color Filters */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Color Spec:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {COMMON_COLORS.map(color => (
            <TouchableOpacity
              key={color}
              style={[styles.chip, selectedColor === color && styles.chipActive]}
              onPress={() => setSelectedColor(selectedColor === color ? null : color)}
            >
              <Text style={[styles.chipText, selectedColor === color && styles.chipTextActive]}>
                {color}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Element Filters */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Element:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {COMMON_ELEMENTS.map(element => (
            <TouchableOpacity
              key={element}
              style={[styles.chip, selectedElement === element && styles.chipActive]}
              onPress={() => setSelectedElement(selectedElement === element ? null : element)}
            >
              <Text style={[styles.chipText, selectedElement === element && styles.chipTextActive]}>
                {element}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.sm,
    height: 44,
    marginBottom: THEME.spacing.md,
  },
  textInput: {
    flex: 1,
    color: THEME.colors.text,
    marginLeft: 8,
    height: '100%',
  },
  clearBtn: {
    backgroundColor: THEME.colors.textMuted,
    padding: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterLabel: {
    ...THEME.typography.caption,
    width: 70,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  chipRow: {
    gap: 8,
    paddingRight: 20,
  },
  chip: {
    backgroundColor: THEME.colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  chipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  chipText: {
    ...THEME.typography.caption,
    color: THEME.colors.text,
  },
  chipTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
});
