// components/search-bar.tsx

import { Search, X } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../contexts/theme-context';
import { ThemeColors } from '../constants/theme';

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

const getStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: c.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.background,
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 44,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: c.border,
  },
  textInput: {
    flex: 1,
    color: c.text,
    marginLeft: 8,
    height: '100%',
    fontSize: 15,
  },
  clearBtn: {
    backgroundColor: c.textMuted,
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
    fontSize: 12,
    width: 70,
    color: c.textMuted,
    fontWeight: '600',
  },
  chipRow: {
    gap: 8,
    paddingRight: 20,
  },
  chip: {
    backgroundColor: c.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.border,
  },
  chipActive: {
    backgroundColor: c.primary,
    borderColor: c.primary,
  },
  chipText: {
    fontSize: 12,
    color: c.text,
  },
  chipTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export function SearchBar({
  searchQuery,
  setSearchQuery,
  selectedColor,
  setSelectedColor,
  selectedElement,
  setSelectedElement,
  onClearFilters,
}: SearchBarProps) {
  const { theme } = useAppTheme();
  const c = theme.colors;
  const styles = useMemo(() => getStyles(c), [theme]);

  const hasActiveFilters = searchQuery.length > 0 || selectedColor !== null || selectedElement !== null;

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Search size={20} color={c.textMuted} />
        <TextInput
          style={styles.textInput}
          placeholder="Search minerals by name..."
          placeholderTextColor={c.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {hasActiveFilters && (
          <TouchableOpacity onPress={onClearFilters} style={styles.clearBtn}>
            <X size={16} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>

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
