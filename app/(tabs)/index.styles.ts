// app/(tabs)/index.styles.ts

import { Platform, StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: THEME.spacing.md,
    zIndex: 10,
  },
  title: {
    ...THEME.typography.h1,
    color: THEME.colors.text,
    fontWeight: '900',
  },
  profileButton: {
    width: 42,
    height: 42,
    borderRadius: THEME.borderRadius.round,
    backgroundColor: THEME.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9,
  },
  dropdown: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 68 : 88,
    right: THEME.spacing.xl,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    paddingVertical: THEME.spacing.sm,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    zIndex: 100,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
    gap: THEME.spacing.sm,
  },
  dropdownItemText: {
    ...THEME.typography.body,
    color: THEME.colors.text,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.xl,
    paddingBottom: 40,
  },
  searchSection: {
    marginVertical: THEME.spacing.md,
  },
  searchBarPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    paddingHorizontal: THEME.spacing.md,
    height: 50,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: THEME.spacing.sm,
  },
  searchPlaceholderText: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
  },
  filterSection: {
    marginTop: THEME.spacing.sm,
  },
  sectionTitle: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: THEME.spacing.sm,
    letterSpacing: 0.5,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.sm,
  },
  chip: {
    backgroundColor: THEME.colors.surface,
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.md,
    borderRadius: THEME.borderRadius.round,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  chipText: {
    ...THEME.typography.caption,
    color: THEME.colors.text,
    fontWeight: '500',
  },
});