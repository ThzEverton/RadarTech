// src/theme/index.js

export const colors = {
  primary: '#1D9E75',
  primaryLight: '#E1F5EE',
  primaryDark: '#0F6E56',
  secondary: '#EF9F27',
  secondaryLight: '#FAEEDA',
  danger: '#E24B4A',
  dangerLight: '#FCEBEB',
  background: '#F7F9F8',
  card: '#FFFFFF',
  border: '#E2E8E4',
  textPrimary: '#1A2420',
  textSecondary: '#5A6E68',
  textTertiary: '#9AADA8',
  white: '#FFFFFF',
  gray100: '#F1EFE8',
  gray200: '#D3D1C7',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const typography = {
  h1: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  h2: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  h3: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  body: { fontSize: 14, fontWeight: '400', color: colors.textPrimary },
  caption: { fontSize: 12, fontWeight: '400', color: colors.textSecondary },
  label: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, letterSpacing: 0.5 },
};

export const paperTheme = {
  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    surface: colors.card,
    text: colors.textPrimary,
    placeholder: colors.textTertiary,
    outline: colors.border,
  },
};
