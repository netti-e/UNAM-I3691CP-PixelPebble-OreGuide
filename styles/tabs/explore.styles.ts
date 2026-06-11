import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../constants/theme';

export const getStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
  },

  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
    color: c.text,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    color: c.textMuted,
    marginTop: 4,
  },

  imageZone: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    height: 220,
    borderWidth: 1.5,
    borderColor: c.primary,
    borderStyle: 'dashed',
    backgroundColor: c.surface,
  },
  emptyZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(211,84,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyZoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: c.text,
  },
  emptyZoneHint: {
    fontSize: 12,
    color: c.textMuted,
  },
  imagePreviewWrapper: {
    flex: 1,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  clearButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: c.primary,
    borderRadius: 12,
    paddingVertical: 14,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: c.surface,
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: c.border,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: c.text,
  },

  identifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: c.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 4,
  },
  identifyButtonDisabled: {
    backgroundColor: c.border,
  },
  identifyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  identifyButtonTextDisabled: {
    color: c.textMuted,
  },
  identifyHint: {
    fontSize: 12,
    color: c.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },

  errorCard: {
    backgroundColor: c.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: c.error,
    marginTop: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: c.error,
    marginBottom: 4,
  },
  errorBody: {
    fontSize: 12,
    color: c.error,
    lineHeight: 18,
  },

  resultsSection: {
    marginTop: 24,
  },
  resultsMeta: {
    marginBottom: 8,
  },
  resultsMetaText: {
    fontSize: 12,
    color: c.textMuted,
    fontWeight: '600',
  },
  noResultsCard: {
    backgroundColor: c.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: c.border,
  },
  noResultsText: {
    fontSize: 16,
    color: c.textMuted,
    lineHeight: 22,
  },

  detectionCard: {
    backgroundColor: c.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: c.border,
    marginBottom: 16,
  },
  detectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detectionLabel: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
    color: c.text,
  },
  confidenceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  confidenceBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detectionDivider: {
    height: 1,
    backgroundColor: c.border,
    marginBottom: 8,
  },
  detectionMeta: {
    gap: 4,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 3,
  },
  metaLabel: {
    fontSize: 12,
    color: c.textMuted,
    fontWeight: '600',
    flex: 1,
  },
  metaValue: {
    fontSize: 12,
    color: c.text,
    flex: 2,
    textAlign: 'right',
  },
  detectionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: c.border,
    marginTop: 4,
  },
  viewProfileText: {
    fontSize: 12,
    fontWeight: '700',
    color: c.primary,
  },

  card: { backgroundColor: c.surface, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: c.border, marginBottom: 16 },
  cardLabel: { fontSize: 12, fontWeight: '700', color: c.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  confidenceRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  confidenceChip: { flex: 1, paddingVertical: 8, borderRadius: 8, backgroundColor: c.background, borderWidth: 1, borderColor: c.border, alignItems: 'center' },
  confidenceChipActive: { backgroundColor: c.primary, borderColor: c.primary },
  confidenceChipText: { fontSize: 12, fontWeight: '700', color: c.textMuted },
  confidenceChipTextActive: { color: '#FFFFFF' },
  confidenceDescription: { fontSize: 12, color: c.textMuted, lineHeight: 18 },
});
