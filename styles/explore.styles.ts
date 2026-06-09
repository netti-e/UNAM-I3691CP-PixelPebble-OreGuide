// app/(tabs)/explore.styles.ts
// [STATUS: EDIT] — Full replacement of placeholder explore styles with FR-AI-001 layout

import { StyleSheet } from "react-native";
import { THEME } from "../constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.xl,
    paddingBottom: 48,
  },

  // Header
  header: {
    marginBottom: THEME.spacing.lg,
  },
  title: {
    ...THEME.typography.h1,
    color: THEME.colors.text,
    fontWeight: "900",
  },
  subtitle: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
    marginTop: 4,
  },

  // Image Zone
  imageZone: {
    borderRadius: THEME.borderRadius.xl,
    overflow: "hidden",
    marginBottom: THEME.spacing.md,
    height: 220,
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
    borderStyle: "dashed",
    backgroundColor: THEME.colors.surface,
  },
  emptyZone: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: THEME.spacing.sm,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEF0E8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: THEME.spacing.xs,
  },
  emptyZoneTitle: {
    ...THEME.typography.body,
    fontWeight: "600",
    color: THEME.colors.text,
  },
  emptyZoneHint: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
  },
  imagePreviewWrapper: {
    flex: 1,
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  clearButton: {
    position: "absolute",
    top: THEME.spacing.sm,
    right: THEME.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: THEME.borderRadius.round,
  },
  clearButtonText: {
    ...THEME.typography.caption,
    color: THEME.colors.surface,
    fontWeight: "600",
  },

  // Action Row
  actionRow: {
    flexDirection: "row",
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.lg,
    paddingVertical: 14,
  },
  primaryButtonText: {
    ...THEME.typography.body,
    fontWeight: "700",
    color: THEME.colors.surface,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  secondaryButtonText: {
    ...THEME.typography.body,
    fontWeight: "700",
    color: THEME.colors.text,
  },

  // Confidence Selector
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  cardLabel: {
    ...THEME.typography.caption,
    fontWeight: "700",
    color: THEME.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: THEME.spacing.sm,
  },
  confidenceRow: {
    flexDirection: "row",
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.sm,
  },
  confidenceChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.background,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: "center",
  },
  confidenceChipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  confidenceChipText: {
    ...THEME.typography.caption,
    fontWeight: "700",
    color: THEME.colors.textMuted,
  },
  confidenceChipTextActive: {
    color: THEME.colors.surface,
  },
  confidenceDescription: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    lineHeight: 18,
  },

  // Identify Button
  identifyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.lg,
    paddingVertical: 16,
    marginBottom: THEME.spacing.xs,
  },
  identifyButtonDisabled: {
    backgroundColor: THEME.colors.border,
  },
  identifyButtonText: {
    ...THEME.typography.body,
    fontWeight: "700",
    color: THEME.colors.surface,
  },
  identifyButtonTextDisabled: {
    color: THEME.colors.textMuted,
  },
  identifyHint: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    textAlign: "center",
    marginBottom: THEME.spacing.lg,
  },

  // Error Card
  errorCard: {
    backgroundColor: "#FDF2F2",
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: "#F5C6C6",
    marginTop: THEME.spacing.md,
  },
  errorTitle: {
    ...THEME.typography.body,
    fontWeight: "700",
    color: THEME.colors.error,
    marginBottom: 4,
  },
  errorBody: {
    ...THEME.typography.caption,
    color: THEME.colors.error,
    lineHeight: 18,
  },

  // Results Section
  resultsSection: {
    marginTop: THEME.spacing.lg,
  },
  resultsMeta: {
    marginBottom: THEME.spacing.sm,
  },
  resultsMetaText: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    fontWeight: "600",
  },
  noResultsCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  noResultsText: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
    lineHeight: 22,
  },

  // Detection Card
  detectionCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  detectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: THEME.spacing.sm,
  },
  detectionLabel: {
    ...THEME.typography.h2,
    color: THEME.colors.text,
  },
  confidenceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.round,
  },
  confidenceBadgeText: {
    ...THEME.typography.caption,
    fontWeight: "700",
    color: THEME.colors.surface,
  },
  detectionDivider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    marginBottom: THEME.spacing.sm,
  },
  detectionMeta: {
    gap: THEME.spacing.xs,
    marginBottom: THEME.spacing.sm,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 3,
  },
  metaLabel: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    fontWeight: "600",
    flex: 1,
  },
  metaValue: {
    ...THEME.typography.caption,
    color: THEME.colors.text,
    flex: 2,
    textAlign: "right",
  },
  detectionFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    paddingTop: THEME.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    marginTop: THEME.spacing.xs,
  },
  viewProfileText: {
    ...THEME.typography.caption,
    fontWeight: "700",
    color: THEME.colors.primary,
  },
});
