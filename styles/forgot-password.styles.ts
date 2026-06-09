// [STATUS: NEW] — Styles for forgot-password screen, mirroring login.styles.ts patterns
// app/(auth)/forgot-password.styles.ts

import { StyleSheet } from "react-native";
import { THEME } from "../constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: 120,
    zIndex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.spacing.xl,
    gap: THEME.spacing.sm,
  },
  backText: {
    ...THEME.typography.body,
    color: THEME.colors.primary,
    fontWeight: "600",
  },
  title: {
    ...THEME.typography.h1,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
    textTransform: "uppercase",
    fontWeight: "900",
  },
  subtitle: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
    marginBottom: THEME.spacing.xl,
    lineHeight: 24,
  },
  inputContainer: {
    gap: THEME.spacing.md,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.borderRadius.xl,
    paddingHorizontal: THEME.spacing.md,
    height: 56,
  },
  inputWrapperError: {
    borderWidth: 1.5,
    borderColor: THEME.colors.error,
  },
  icon: {
    marginRight: THEME.spacing.sm,
  },
  input: {
    flex: 1,
    ...THEME.typography.body,
    color: THEME.colors.text,
  },
  errorText: {
    ...THEME.typography.caption,
    color: THEME.colors.error,
    marginTop: -THEME.spacing.sm,
    paddingLeft: THEME.spacing.sm,
  },
  buttonContainer: {
    alignItems: "flex-end",
    marginTop: THEME.spacing.xl,
  },
  button: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.round,
    minWidth: 160,
    alignItems: "center",
  },
  buttonText: {
    ...THEME.typography.body,
    color: THEME.colors.surface,
    fontWeight: "600",
  },
  backgroundImage: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 250,
    zIndex: 0,
  },

  // ── Success state ──────────────────────────────────────────────────────────
  successContainer: {
    flex: 1,
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: 120,
    zIndex: 1,
    alignItems: "flex-start",
  },
  successIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: THEME.borderRadius.round,
    backgroundColor: THEME.colors.secondary + "1A", // 10% opacity malachite green
    alignItems: "center",
    justifyContent: "center",
    marginBottom: THEME.spacing.lg,
  },
  successTitle: {
    ...THEME.typography.h1,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
    textTransform: "uppercase",
    fontWeight: "900",
  },
  successSubtitle: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
    marginBottom: THEME.spacing.xl,
    lineHeight: 24,
  },
  successEmail: {
    color: THEME.colors.text,
    fontWeight: "700",
  },
  returnButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.round,
    alignItems: "center",
    alignSelf: "stretch",
  },
  returnButtonText: {
    ...THEME.typography.body,
    color: THEME.colors.surface,
    fontWeight: "600",
  },
  resendContainer: {
    flexDirection: "row",
    marginTop: THEME.spacing.lg,
    alignSelf: "center",
  },
  resendText: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
  },
  resendLink: {
    ...THEME.typography.body,
    color: THEME.colors.primary,
    fontWeight: "600",
  },
});
