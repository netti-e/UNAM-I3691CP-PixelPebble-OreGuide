// app/(auth)/register+styles.ts

import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: height * 0.12,
    paddingBottom: height * 0.35, // Breathing room for the bottom ore graphic
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 0.5,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 28,
  },
  subtitleText: {
    fontSize: 13,
    color: '#8A8A8A',
  },
  signInLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E97A34',
  },
  inputGroup: {
    marginBottom: 18,
    width: '100%',
  },
  inputLabel: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 4,
    paddingLeft: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F4',
    borderRadius: 25, // Highly rounded pill shape matching login page
    height: 50,
    paddingHorizontal: 18,
    width: '100%',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#000000',
    fontSize: 14,
  },
  eyeIcon: {
    padding: 4,
  },
  actionRow: {
    width: '100%',
    alignItems: 'flex-end', // Aligns register action button to the right side
    marginTop: 16,
  },
  registerButton: {
    backgroundColor: '#E97A34', // Vivid copper tone
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 32,
    shadowColor: '#E97A34',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  backgroundGraphicContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.38,
    width: width,
    justifyContent: 'flex-end',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
});