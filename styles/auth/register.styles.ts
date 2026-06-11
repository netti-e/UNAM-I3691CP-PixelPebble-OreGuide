import { StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: THEME.spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: 40,
    zIndex: 1,
  },
  title: {
    ...THEME.typography.h1,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
    fontWeight: '900',
  },
  subtitleContainer: {
    flexDirection: 'row',
    marginBottom: THEME.spacing.xl,
  },
  subtitleText: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
  },
  linkText: {
    ...THEME.typography.caption,
    color: THEME.colors.primary,
    fontWeight: '600',
  },
  inputContainer: {
    gap: THEME.spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.borderRadius.xl,
    paddingHorizontal: THEME.spacing.md,
    height: 56,
  },
  input: {
    flex: 1,
    ...THEME.typography.body,
    color: THEME.colors.text,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: THEME.spacing.xl,
  },
  button: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.round,
    width: 120,
    alignItems: 'center',
  },
  buttonText: {
    ...THEME.typography.body,
    color: THEME.colors.surface,
    fontWeight: '600',
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 250,
    zIndex: 0,
  },
});
