// app/(tabs)/explore.styles.ts

import { StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: THEME.spacing.xl,
    paddingBottom: 40,
  },
  header: {
    marginBottom: THEME.spacing.xl,
  },
  title: {
    ...THEME.typography.h1,
    color: THEME.colors.text,
    fontWeight: '900',
  },
  subtitle: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
    marginTop: 4,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.sm,
  },
  cardTitle: {
    ...THEME.typography.body,
    color: THEME.colors.text,
    fontWeight: '700',
  },
  cardBody: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    lineHeight: 20,
  },
  menuSection: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    paddingVertical: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  sectionLabel: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  menuItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: THEME.spacing.md,
  },
  menuItemText: {
    ...THEME.typography.body,
    color: THEME.colors.text,
  },
});