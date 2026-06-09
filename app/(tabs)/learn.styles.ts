// app/(tabs)/learn.styles.ts
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Matches clean native light backdrop
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  tabOuterContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  activeTabButton: {
    backgroundColor: THEME.colors.primary || '#D97706', // High visibility solid theme accent
    shadowColor: THEME.colors.primary || '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  ribbonContainer: {
    paddingLeft: 16,
    marginVertical: 14,
  },
  ribbonChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  activeRibbonChip: {
    borderColor: THEME.colors.primary || '#D97706',
    backgroundColor: '#FFF7ED',
  },
  ribbonChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
  activeRibbonChipText: {
    fontWeight: '700',
    color: THEME.colors.primary || '#D97706',
  },
  loaderContainer: {
    alignItems: 'center',
    marginTop: 60,
    gap: 10,
  },
  loaderText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  profileWrapper: {
    paddingHorizontal: 16,
  },
  heroImage: {
    width: '100%',
    height: 190,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  oreTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  cardHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginLeft: 16,
    marginBottom: 10,
    marginTop: 6,
  },
  galleryScroll: {
    paddingLeft: 16,
  },
  galleryImage: {
    width: 130,
    height: 130,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: '#E5E7EB',
  },
  insightsWrapper: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  insightSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  insightSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  insightParagraph: {
    fontSize: 13.5,
    color: '#4B5563',
    lineHeight: 21,
    marginBottom: 8,
  },
  highlightText: {
    color: THEME.colors.primary || '#D97706',
    fontWeight: '700',
  },
  boldText: {
    fontWeight: '700',
    color: '#1F2937',
  },
  subCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  subCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  subCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  subCardBody: {
    fontSize: 12.5,
    color: '#6B7280',
    lineHeight: 18,
  },
});