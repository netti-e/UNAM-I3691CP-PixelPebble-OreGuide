// app/(auth)/login+styles.ts

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
    paddingTop: height * 0.15,
    paddingBottom: height * 0.35, 
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
  signUpLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E97A34', // Vivid mockup orange link
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
    borderRadius: 25, 
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
  utilitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 2,
    marginBottom: 16,
    paddingLeft: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxDummy: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#EAEAEA',
    borderRadius: 3,
    marginRight: 8,
  },
  checkboxDummyChecked: {
    backgroundColor: '#E97A34',
    borderColor: '#E97A34',
  },
  utilityText: {
    fontSize: 13,
    color: '#444444',
  },
  forgotLink: {
    fontSize: 13,
    color: '#E97A34',
    fontWeight: '500',
    paddingLeft: 4,
    marginBottom: 24,
  },
  actionRow: {
    width: '100%',
    alignItems: 'flex-end', 
    marginTop: 8,
  },
  // FIXED: Explicitly set background color to the mock orange tone
  loginButton: {
    backgroundColor: '#E97A34', // The exact vivid orange color from your design mock
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 32,
    shadowColor: '#E97A34',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  loginButtonText: {
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
  },
});