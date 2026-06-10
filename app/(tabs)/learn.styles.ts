// app/(tabs)/learn.styles.ts
import { StyleSheet, Platform, StatusBar } from 'react-native';
import { THEME } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    paddingHorizontal: 24,
    // Fixes Android status bar overlap by dynamically adding the status bar height
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    marginTop: 4,
  },
  tabContainer: {
    marginVertical: 12,
    height: 40,
  },
  // ADDED: Apply this to your horizontal ScrollView's contentContainerStyle
  // This keeps your chips perfectly aligned with the 24px screen padding when scrolled to the start
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
    backgroundColor: '#EAEAEA',
  },
  activeTabButton: {
    backgroundColor: THEME.colors.primary,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textMuted,
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
    color: THEME.colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    marginBottom: 16,
  },
  topicCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.colors.text,
    marginBottom: 6,
  },
  topicContent: {
    fontSize: 13,
    color: THEME.colors.text,
    lineHeight: 18,
  },
  oreCard: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  oreImage: {
    width: 100,
    height: '100%',
    minHeight: 115, // Bumped slightly to ensure clean image coverage on taller text wrappers
    backgroundColor: '#EAEAEA',
  },
  oreCardBody: {
    flex: 1,
    padding: 12,
  },
  oreName: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  oreFormula: {
    fontSize: 11,
    color: THEME.colors.primary,
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
    color: THEME.colors.textMuted,
  },
  metaValue: {
    flex: 1,
    fontSize: 12,
    color: THEME.colors.text,
  },
});
