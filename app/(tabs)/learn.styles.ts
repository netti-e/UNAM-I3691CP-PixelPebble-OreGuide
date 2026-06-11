// app/(tabs)/learn.styles.ts
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { ThemeColors } from '../../constants/theme';

export const getStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: c.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: c.textMuted,
    marginTop: 4,
  },
  tabContainer: {
    marginVertical: 12,
    height: 40,
  },
  tabScrollContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
  },
  activeTabButton: {
    backgroundColor: c.primary,
    borderColor: c.primary,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: c.textMuted,
  },
  activeTabButtonText: {
    color: '#FFF',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: c.text,
    marginTop: 8,
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: c.textMuted,
    marginBottom: 16,
  },
  topicCard: {
    backgroundColor: c.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: c.border,
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: c.text,
    marginBottom: 6,
  },
  topicContent: {
    fontSize: 13,
    color: c.text,
    lineHeight: 18,
  },
  oreCard: {
    flexDirection: 'row',
    backgroundColor: c.surface,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: c.border,
  },
  oreImage: {
    width: 100,
    height: '100%',
    minHeight: 115,
    backgroundColor: c.border,
  },
  oreCardBody: {
    flex: 1,
    padding: 12,
  },
  oreName: {
    fontSize: 16,
    fontWeight: '700',
    color: c.text,
  },
  oreFormula: {
    fontSize: 11,
    color: c.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: c.textMuted,
  },
  metaValue: {
    flex: 1,
    fontSize: 12,
    color: c.text,
  },
});
