import React from 'react'

/**
 * Official & Commonly Recognized Logos for College Clubs:
 * 1. CSI – Computer Society of India official logo (Navy cogwheel with CSI emblem)
 * 2. IEEE – Official IEEE logo (Iconic blue diamond kite with right-hand rule magnetic arrows)
 * 3. IEI – Institution of Engineers (India) official logo (Royal blue cogwheel with engineering crest)
 * 4. Yoga – Common official Yoga logo (International Day of Yoga / AYUSH Namaste lotus emblem)
 * 5. Sports – Common official Sports logo (Collegiate athletics dynamic crest with laurel & torch)
 * 6. Fine Arts – Common Fine Arts logo (Artist palette with vibrant oil color wells & crossed brushes)
 * 7. NSS – National Service Scheme official logo (Navy Konark Sun Temple Rath Wheel with red core)
 * 8. NCC – National Cadet Corps official logo (Tricolor Army/Navy/Air Force shield with 17-lotus garland & NCC crest)
 */

export function CSILogo({ size = 26, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Computer Society of India (CSI) Logo"
    >
      {/* Outer Gear Teeth (12 cogs) */}
      <circle cx="50" cy="50" r="46" fill="#003366" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
        <rect
          key={deg}
          x="46"
          y="1"
          width="8"
          height="8"
          fill="#003366"
          rx="1.5"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      {/* Inner White Rim */}
      <circle cx="50" cy="50" r="41" fill="#FFFFFF" />
      <circle cx="50" cy="50" r="37" fill="#003366" />
      {/* Gold Ring */}
      <circle cx="50" cy="50" r="34" fill="#0c4a7a" stroke="#F59E0B" strokeWidth="1.5" />
      {/* CSI Stylized Lettering */}
      <text
        x="50"
        y="56"
        fill="#FFFFFF"
        fontFamily="'Arial Black', Impact, sans-serif"
        fontWeight="900"
        fontSize="21"
        letterSpacing="1"
        textAnchor="middle"
      >
        CSI
      </text>
      {/* Subtext arc/dot */}
      <circle cx="50" cy="65" r="2" fill="#F59E0B" />
      <path d="M34 68 Q50 73 66 68" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
      {/* Circuit lines */}
      <path d="M30 33 L40 33 M60 33 L70 33" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="30" cy="33" r="1.5" fill="#F59E0B" />
      <circle cx="70" cy="33" r="1.5" fill="#F59E0B" />
    </svg>
  )
}

export function IEEELogo({ size = 26, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="IEEE Official Logo"
    >
      {/* Official IEEE Blue Diamond Shield */}
      <path 
        d="M50 4 L94 50 L50 96 L6 50 Z" 
        fill="#00629B" 
        stroke="#004A75" 
        strokeWidth="2" 
      />
      {/* Inner White Border Line */}
      <path 
        d="M50 8 L90 50 L50 92 L10 50 Z" 
        fill="#00629B" 
        stroke="#FFFFFF" 
        strokeWidth="1.5" 
      />
      {/* Hand holding magnetic lines / Right-hand rule */}
      <circle cx="50" cy="40" r="16" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
      {/* Magnetic induction arrow through circle */}
      <path d="M50 20 L50 56" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M44 26 L50 18 L56 26" fill="#FFFFFF" />
      {/* Electro-magnetic coil curves */}
      <path d="M37 40 C37 32 63 32 63 40 C63 47 37 47 37 53" stroke="#FFFFFF" strokeWidth="2" fill="none" />
      {/* IEEE Wordmark */}
      <text 
        x="50" 
        y="78" 
        fill="#FFFFFF" 
        fontFamily="'Helvetica Neue', Arial, sans-serif" 
        fontWeight="800" 
        fontSize="16" 
        letterSpacing="0.8" 
        textAnchor="middle"
      >
        IEEE
      </text>
    </svg>
  )
}

export function IEILogo({ size = 26, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Institution of Engineers (India) Logo"
    >
      {/* Outer Gear Cogwheel (16 teeth) */}
      <circle cx="50" cy="50" r="46" fill="#002B49" />
      {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map(deg => (
        <rect
          key={deg}
          x="46.5"
          y="1"
          width="7"
          height="6"
          fill="#002B49"
          rx="1"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      {/* White Ring */}
      <circle cx="50" cy="50" r="42" fill="#FFFFFF" />
      <circle cx="50" cy="50" r="38" fill="#003A66" />
      {/* Central Gold Heraldic Shield */}
      <path 
        d="M36 28 L64 28 C64 48 50 62 50 62 C50 62 36 48 36 28 Z" 
        fill="#C99700" 
        stroke="#FFFFFF" 
        strokeWidth="1.2"
      />
      {/* Inner Engineer's Level & Compass */}
      <circle cx="50" cy="38" r="4" fill="#002B49" />
      <path d="M43 48 L50 38 L57 48" stroke="#002B49" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="48" x2="60" y2="48" stroke="#002B49" strokeWidth="1.5" />
      {/* Foundation Year Ribbon */}
      <rect x="34" y="66" width="32" height="12" rx="2" fill="#FFFFFF" stroke="#002B49" strokeWidth="1" />
      <text
        x="50"
        y="75.5"
        fill="#002B49"
        fontFamily="'Arial Black', sans-serif"
        fontWeight="900"
        fontSize="9.5"
        textAnchor="middle"
      >
        IEI
      </text>
    </svg>
  )
}

export function YogaLogo({ size = 26, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Official International Day of Yoga / AYUSH Logo"
    >
      {/* Outer Peaceful Blue Circle */}
      <circle cx="50" cy="50" r="46" fill="#0284C7" />
      <circle cx="50" cy="50" r="43" fill="#F0FDF4" />
      {/* Sun/Light Radiance */}
      <circle cx="50" cy="28" r="10" fill="#F59E0B" />
      <circle cx="50" cy="28" r="7" fill="#FDE047" />
      {/* Yoga Meditating Human Silhouette in Golden Orange */}
      {/* Head */}
      <circle cx="50" cy="32" r="5" fill="#EA580C" />
      {/* Upper Torso & Folded Hands (Namaste Mudra) */}
      <path 
        d="M48 38 C44 42 42 48 42 54 L58 54 C58 48 56 42 52 38 Z" 
        fill="#F97316" 
      />
      {/* Hands Joined in Prayer Pointing Up */}
      <path 
        d="M50 30 L47 38 L53 38 Z" 
        fill="#C2410C" 
      />
      {/* Green Lotus Blossom Base (Symbol of purity & nature) */}
      <path 
        d="M50 56 C42 56 34 66 32 74 C40 76 46 70 50 64 C54 70 60 76 68 74 C66 66 58 56 50 56 Z" 
        fill="#16A34A" 
      />
      <path 
        d="M50 59 C45 64 42 70 38 72 C44 73 48 68 50 63 C52 68 56 73 62 72 C58 70 55 64 50 59 Z" 
        fill="#22C55E" 
      />
      {/* Blue Ribbon / Earth Elements */}
      <path 
        d="M26 66 C28 78 40 84 50 84 C60 84 72 78 74 66 C68 70 58 72 50 72 C42 72 32 70 26 66 Z" 
        fill="#0369A1" 
      />
      <text
        x="50"
        y="93"
        fill="#0369A1"
        fontFamily="sans-serif"
        fontWeight="800"
        fontSize="6.5"
        letterSpacing="0.8"
        textAnchor="middle"
      >
        YOGA
      </text>
    </svg>
  )
}

export function SportsLogo({ size = 26, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Official University Sports & Athletic Emblem"
    >
      {/* Outer Athletic Crest Shield */}
      <path 
        d="M50 4 L88 18 C88 56 50 94 50 94 C50 94 12 56 12 18 Z" 
        fill="#0F172A" 
        stroke="#F59E0B" 
        strokeWidth="2.5" 
      />
      {/* Inner Tricolor Soaring Athlete Wings (Recognized SAI / Olympic Collegiate form) */}
      <circle cx="50" cy="26" r="6" fill="#F59E0B" />
      {/* Saffron Dynamic Swirl */}
      <path 
        d="M50 32 C42 36 34 46 36 56 C38 48 44 42 50 40 Z" 
        fill="#EA580C" 
      />
      {/* White/Silver Center Motion */}
      <path 
        d="M50 34 C47 42 46 54 50 64 C53 54 53 42 50 34 Z" 
        fill="#FFFFFF" 
      />
      {/* Green Dynamic Wing */}
      <path 
        d="M50 32 C58 36 66 46 64 56 C62 48 56 42 50 40 Z" 
        fill="#16A34A" 
      />
      {/* Golden Athletic Laurel Wreath Base */}
      <path 
        d="M26 50 C24 64 36 78 50 82 C64 78 76 64 74 50 C70 60 62 70 50 74 C38 70 30 60 26 50 Z" 
        fill="#D97706" 
      />
      {/* Laurel Leaves */}
      <circle cx="28" cy="56" r="2.5" fill="#FBBF24" />
      <circle cx="33" cy="65" r="2.5" fill="#FBBF24" />
      <circle cx="41" cy="73" r="2.5" fill="#FBBF24" />
      <circle cx="72" cy="56" r="2.5" fill="#FBBF24" />
      <circle cx="67" cy="65" r="2.5" fill="#FBBF24" />
      <circle cx="59" cy="73" r="2.5" fill="#FBBF24" />
    </svg>
  )
}

export function FineArtsLogo({ size = 26, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Common Fine Arts & Academy of Art Logo"
    >
      {/* Artist Wooden Palette Background */}
      <path 
        d="M20 52 C14 36 26 14 50 14 C74 14 88 30 86 52 C84 68 76 84 56 84 C48 84 44 80 40 80 C36 80 32 84 28 82 C20 78 18 64 20 52 Z" 
        fill="#92400E" 
        stroke="#B45309" 
        strokeWidth="2" 
      />
      {/* Palette Texture Gradient Highlight */}
      <path 
        d="M23 50 C18 38 28 18 50 18 C70 18 83 32 81 50 C79 64 72 78 55 78 C47 78 43 74 38 74 C34 74 30 78 27 76 C22 72 20 60 23 50 Z" 
        fill="#B45309" 
      />
      {/* Thumb Hole */}
      <ellipse cx="32" cy="64" rx="5" ry="6" fill="#1e1e24" />
      {/* Vibrant Oil Color Wells */}
      {/* Cobalt Blue */}
      <circle cx="36" cy="30" r="5" fill="#2563EB" />
      {/* Crimson Red */}
      <circle cx="50" cy="24" r="5" fill="#DC2626" />
      {/* Lemon Yellow */}
      <circle cx="64" cy="28" r="5" fill="#FACC15" />
      {/* Emerald Green */}
      <circle cx="74" cy="40" r="5" fill="#16A34A" />
      {/* Royal Purple */}
      <circle cx="72" cy="56" r="5" fill="#9333EA" />

      {/* Two Crossed Paint Brushes */}
      {/* Brush 1: Handle & Ferrule */}
      <line x1="24" y1="84" x2="68" y2="40" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
      <line x1="68" y1="40" x2="74" y2="34" stroke="#D1D5DB" strokeWidth="4.5" strokeLinecap="round" />
      {/* Bristles with Red Tip */}
      <path d="M74 34 Q80 28 84 24 Q80 34 74 34 Z" fill="#DC2626" />

      {/* Brush 2: Handle & Ferrule */}
      <line x1="72" y1="84" x2="28" y2="40" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="40" x2="22" y2="34" stroke="#D1D5DB" strokeWidth="3.5" strokeLinecap="round" />
      {/* Bristles with Blue Tip */}
      <path d="M22 34 Q16 28 12 24 Q16 34 22 34 Z" fill="#2563EB" />
    </svg>
  )
}

export function NSSLogo({ size = 26, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="National Service Scheme (NSS) Official Logo"
    >
      {/* Outer Navy Ring */}
      <circle cx="50" cy="50" r="46" fill="#002147" />
      {/* Concentric White Ring */}
      <circle cx="50" cy="50" r="41" fill="#FFFFFF" />
      <circle cx="50" cy="50" r="37" fill="#002147" />

      {/* The 8 Main Chariot Spokes of Konark Sun Temple Wheel */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
        <g key={deg} transform={`rotate(${deg} 50 50)`}>
          <line x1="50" y1="13" x2="50" y2="50" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="50" cy="22" r="3" fill="#002147" stroke="#FFFFFF" strokeWidth="1" />
        </g>
      ))}

      {/* 8 Intermediate Minor Spokes */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(deg => (
        <line
          key={deg}
          x1="50"
          y1="22"
          x2="50"
          y2="50"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}

      {/* Center Red Hub (8 Bars representing 24 hours of service) */}
      <circle cx="50" cy="50" r="16" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="50" cy="50" r="9" fill="#002147" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="4" fill="#FFFFFF" />

      {/* Arc Lettering 'NSS' */}
      <text
        x="50"
        y="92"
        fill="#FFFFFF"
        fontFamily="'Arial Black', Impact, sans-serif"
        fontWeight="900"
        fontSize="10"
        letterSpacing="2"
        textAnchor="middle"
      >
        NSS
      </text>
    </svg>
  )
}

export function NCCLogo({ size = 26, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="National Cadet Corps (NCC) Official Logo"
    >
      {/* Golden Garland of 17 Lotuses Border Ring */}
      <circle cx="50" cy="48" r="46" fill="#D97706" />
      {/* 17 Lotus Dots/Petals */}
      {Array.from({ length: 17 }).map((_, i) => {
        const angle = (i * 360) / 17
        return (
          <circle
            key={i}
            cx={50 + 43 * Math.cos((angle * Math.PI) / 180)}
            cy={48 + 43 * Math.sin((angle * Math.PI) / 180)}
            r="3"
            fill="#FEF3C7"
            stroke="#B45309"
            strokeWidth="0.8"
          />
        )
      })}

      {/* Inner White Margin */}
      <circle cx="50" cy="48" r="39" fill="#FFFFFF" />

      {/* Tricolor Central Shield (Red = Army, Navy = Navy, Sky Blue = Air Force) */}
      <g clipPath="url(#nccShieldClip)">
        <rect x="20" y="16" width="20" height="56" fill="#DC2626" />
        <rect x="40" y="16" width="20" height="56" fill="#002147" />
        <rect x="60" y="16" width="20" height="56" fill="#38BDF8" />
      </g>
      <clipPath id="nccShieldClip">
        <path d="M22 18 L78 18 L78 52 C78 68 50 78 50 78 C50 78 22 68 22 52 Z" />
      </clipPath>
      <path 
        d="M22 18 L78 18 L78 52 C78 68 50 78 50 78 C50 78 22 68 22 52 Z" 
        stroke="#D97706" 
        strokeWidth="2" 
        fill="none" 
      />

      {/* Golden NCC Emblem Letters */}
      <text
        x="50"
        y="46"
        fill="#FDE047"
        stroke="#78350F"
        strokeWidth="0.8"
        fontFamily="'Arial Black', Impact, sans-serif"
        fontWeight="900"
        fontSize="17"
        letterSpacing="0.8"
        textAnchor="middle"
      >
        NCC
      </text>

      {/* Golden Scroll Banner below */}
      <rect x="22" y="81" width="56" height="13" rx="2" fill="#D97706" stroke="#FFFFFF" strokeWidth="1" />
      <text
        x="50"
        y="90.5"
        fill="#FFFFFF"
        fontFamily="sans-serif"
        fontWeight="800"
        fontSize="6.2"
        letterSpacing="0.4"
        textAnchor="middle"
      >
        UNITY &amp; DISCIPLINE
      </text>
    </svg>
  )
}

/**
 * Universal ClubLogo Component:
 * Maps any club identifier to its official logo component with identical dimensions and layout.
 */
export default function ClubLogo({ clubName = '', size = 26, className = '' }) {
  const norm = String(clubName || '').trim().toLowerCase()

  if (norm.includes('csi') || norm.includes('computer society')) {
    return <CSILogo size={size} className={className} />
  }
  if (norm.includes('ieee')) {
    return <IEEELogo size={size} className={className} />
  }
  if (norm.includes('iei') || norm === 'ie' || norm.includes('institution of engineer')) {
    return <IEILogo size={size} className={className} />
  }
  if (norm.includes('yoga') || norm.includes('wellness') || norm.includes('mindfulness')) {
    return <YogaLogo size={size} className={className} />
  }
  if (norm.includes('sport') || norm.includes('athletic')) {
    return <SportsLogo size={size} className={className} />
  }
  if (norm.includes('fine art') || norm.includes('art') || norm.includes('creative guild')) {
    return <FineArtsLogo size={size} className={className} />
  }
  if (norm.includes('nss') || norm.includes('national service')) {
    return <NSSLogo size={size} className={className} />
  }
  if (norm.includes('ncc') || norm.includes('cadet')) {
    return <NCCLogo size={size} className={className} />
  }

  // Fallback to IEEE or IEI
  return <CSILogo size={size} className={className} />
}
