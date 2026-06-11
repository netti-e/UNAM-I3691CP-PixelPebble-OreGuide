import { Platform, StyleSheet } from 'react-native';
import { ThemeColors } from '../../constants/theme';

export const getStyles = (c: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 32, paddingTop: Platform.OS === 'ios' ? 20 : 40, paddingBottom: 16, zIndex: 10 },
  title: { fontSize: 28, fontWeight: '900', lineHeight: 34, color: c.text },
  profileButton: { width: 42, height: 42, borderRadius: 9999, backgroundColor: c.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: c.border },
  backdrop: { ...StyleSheet.absoluteFillObject, zIndex: 9 },
  dropdown: { position: 'absolute', top: Platform.OS === 'ios' ? 68 : 88, right: 32, backgroundColor: c.surface, borderRadius: 16, paddingVertical: 8, width: 168, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 5, borderWidth: 1, borderColor: c.border, zIndex: 100 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, gap: 10 },
  dropdownItemText: { fontSize: 15, fontWeight: '500', color: c.text },
  logoutText: { color: '#EF4444', fontWeight: '600' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  sectionTitle: { fontSize: 12, color: c.textMuted, fontWeight: '700', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 },

  // Action grid
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 10 },
  actionCard: { flex: 1, alignItems: 'center', backgroundColor: c.surface, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 4, borderWidth: 1, borderColor: c.border, gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  actionIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(211,84,0,0.1)', justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: 11, textAlign: 'center', color: c.text, fontWeight: '600' },

  // Mineral cards
  scanCard: { width: 140, marginRight: 14, backgroundColor: c.surface, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: c.border },
  scanImagePlaceholder: { width: '100%', height: 100, backgroundColor: c.border, borderRadius: 8, marginBottom: 8 },
  scanName: { fontSize: 13, fontWeight: '700', color: c.text },
  scanMine: { fontSize: 12, color: c.textMuted },

  // Banner
  banner: { backgroundColor: c.primary, padding: 20, borderRadius: 16, marginTop: 24, overflow: 'hidden' },
  bannerLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  bannerTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginBottom: 14, lineHeight: 26 },
  bannerButton: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, alignSelf: 'flex-start' },
  bannerButtonText: { color: c.primary, fontWeight: '700', fontSize: 13 },
});
