import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  // Outer shadow layer container (overflow: 'hidden' removed to allow shadow visibility)
  logoContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF', // Solid background allows the shadow path to compute cleanly
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 36,

    // iOS Outer Shadow Parameters
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,

    // Android Native Shadow Elevation
    elevation: 6,
  },
  // Image layout containing isolation clipping boundaries
  logoImage: {
    width: 160,          
    height: 160,         
    backgroundColor: '#FFFFFF', 
    borderRadius: 80,    
    overflow: 'hidden',  // Safely masks your asset edges internally
    alignSelf: 'center', 
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000', 
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 6,
  },
  highlightText: {
    color: '#E2A53B', 
    fontWeight: '700',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
  },
  waveEmoji: {
    marginLeft: 6,
  },
  introParagraph: {
    fontSize: 13,
    color: '#222222',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 12,
    marginBottom: 36,
  },
  featurePill: {
    width: '100%',
    backgroundColor: '#F7E6D8', 
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 13,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '400',
  },
  actionContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 24,
  },
  getStartedButton: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#A0A0A5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  getStartedText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginRight: 8,
  },
});