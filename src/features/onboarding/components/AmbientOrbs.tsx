import { colors } from '../styles/colors'

/**
 * Ambient background orbs - floating animated decorative elements
 */
export function AmbientOrbs() {
  return (
    <>
      {/* Orb 1 - top right, sage color */}
      <div
        style={{
          position: 'fixed',
          top: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          borderRadius: '9999px',
          background: `radial-gradient(circle, ${colors.sage}, transparent)`,
          filter: 'blur(90px)',
          opacity: 0.4,
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'floatOrb 14s ease-in-out infinite alternate',
        }}
      />

      {/* Orb 2 - bottom left, cream color */}
      <div
        style={{
          position: 'fixed',
          bottom: '5%',
          left: '10%',
          width: '380px',
          height: '380px',
          borderRadius: '9999px',
          background: `radial-gradient(circle, #e8d9bd, transparent)`,
          filter: 'blur(90px)',
          opacity: 0.3,
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'floatOrbSlow 16s ease-in-out infinite alternate',
        }}
      />

      {/* Orb 3 - center-left, subtle pine tint */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '2%',
          width: '350px',
          height: '350px',
          borderRadius: '9999px',
          background: `radial-gradient(circle, rgba(32, 86, 56, 0.1), transparent)`,
          filter: 'blur(90px)',
          opacity: 0.25,
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'floatOrbReverse 18s ease-in-out infinite alternate',
        }}
      />
    </>
  )
}
