import { StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';

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
  title: {
    ...THEME.typography.h1,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
    textTransform: 'uppercase',
    fontWeight: '900',
  },
  subtitleContainer: {
    flexDirection: 'row',
    marginBottom: THEME.spacing.xl,
  },
  subtitleText: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
  },
  linkText: {
    ...THEME.typography.body,
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
  icon: {
    marginRight: THEME.spacing.sm,
  },
  input: {
    flex: 1,
    ...THEME.typography.body,
    color: THEME.colors.text,
  },
  optionsContainer: {
    flexDirection: 'column',
    gap: THEME.spacing.md,
    marginTop: THEME.spacing.sm,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: THEME.borderRadius.sm,
    marginRight: THEME.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: THEME.colors.primary,
  },
  rememberMeText: {
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
