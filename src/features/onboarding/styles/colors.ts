/**
 * Onboarding Color Palette
 * Aligned with original design system: forest, pine, sage, cream, ink
 */

export const colors = {
  // Primary
  pine: '#205638',
  forest: '#153e35',
  darkForest: '#173f2a',

  // Secondary
  sage: '#eaf1dc',
  cream: '#f7f8f0',
  white: '#ffffff',

  // Text & Borders
  ink: '#233c2d',
  muted: '#76836e',
  border: '#dee5d5',
  lightBorder: '#b5c0b3',

  // Semantic
  success: '#16a34a',
  error: '#a43b3b',
  warning: '#ca8a04',
  info: '#0284c7',

  // Overlays & Shadows
  shadowDark: 'rgba(32, 86, 56, 0.15)',
  shadowDeep: 'rgba(32, 86, 56, 0.35)',
  overlayLight: 'rgba(12, 28, 20, 0.45)',
  overlayMedium: 'rgba(18, 40, 28, 0.65)',
  overlayDark: 'rgba(8, 18, 12, 0.82)',
} as const

/**
 * Tailwind CSS Color Tokens for tailwind.config
 * Can be merged into tailwindcss color palette
 */
export const tailwindColors = {
  pine: colors.pine,
  forest: colors.forest,
  sage: colors.sage,
  cream: colors.cream,
  ink: colors.ink,
  muted: colors.muted,
} as const

export type ColorName = keyof typeof colors
