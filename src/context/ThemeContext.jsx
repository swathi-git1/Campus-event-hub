import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

/**
 * Complete Theme Color Systems.
 * Each palette defines a comprehensive set of tokens for:
 * - Entire Background (bg / darkBg)
 * - Surfaces (surface0-3 / darkSurface0-3)
 * - Cards & elevation (card, cardHover / darkCard, darkCardHover)
 * - Typography (ink, inkSoft, inkMuted / darkInk, darkInkSoft, darkInkMuted)
 * - Borders & dividers (border, borderStrong / darkBorder, darkBorderStrong)
 * - Sidebar & Navbar (sidebarBg, sidebarText, sidebarBorder, navbarBg)
 * - Dynamic Primary & Ambient Lighting (primary, gradients, blobs, grid lines)
 */
export const ACCENT_PALETTES = {
  sandal: {
    id: 'sandal',
    name: 'Classic Sandal',
    desc: 'Warm Sandal Canvas & Caramel Accents',
    colorCode: '#C27E43',
    // Light Mode
    bg: '#F7F2E9',
    surface0: '#EFE7DA',
    surface1: '#F4EFE6',
    surface2: '#FAF5EB',
    surface3: '#F3EAE0',
    card: '#FFFDF9',
    cardHover: '#FFFFFF',
    ink: '#2C1810',
    inkSoft: '#5E412E',
    inkMuted: '#8C705B',
    border: '#E5DACB',
    borderStrong: '#DACAB8',
    sidebarBg: '#FAF5EB',
    sidebarText: '#4A2E1B',
    sidebarBorder: '#E5DACB',
    navbarBg: 'rgba(253, 251, 247, 0.94)',
    primary: '#C27E43',
    primaryHover: '#A5602A',
    gradient: 'linear-gradient(135deg, #C27E43 0%, #A5602A 100%)',
    soft: 'rgba(194, 126, 67, 0.14)',
    glow: 'rgba(194, 126, 67, 0.35)',
    ambientBlob1: 'rgba(194, 126, 67, 0.12)',
    ambientBlob2: 'rgba(220, 168, 110, 0.10)',
    ambientGrid: 'rgba(194, 126, 67, 0.05)',
    ambientParticle: 'rgba(194, 126, 67, 0.45)',
    // Dark Mode
    darkBg: '#0B0F17',
    darkSurface0: '#0F172A',
    darkSurface1: '#162032',
    darkSurface2: '#1E2D44',
    darkSurface3: '#283B57',
    darkCard: '#131E33',
    darkCardHover: '#192742',
    darkInk: '#F8FAFC',
    darkInkSoft: '#CBD5E1',
    darkInkMuted: '#94A3B8',
    darkBorder: 'rgba(255, 255, 255, 0.10)',
    darkBorderStrong: 'rgba(255, 255, 255, 0.20)',
    darkSidebarBg: '#0D1525',
    darkSidebarText: '#E2E8F0',
    darkSidebarBorder: 'rgba(255, 255, 255, 0.08)',
    darkNavbarBg: 'rgba(13, 21, 37, 0.94)',
    darkPrimary: '#FB923C',
    darkHover: '#F97316',
    darkGradient: 'linear-gradient(135deg, #FB923C 0%, #EA580C 100%)',
    darkSoft: 'rgba(251, 146, 60, 0.20)',
    darkGlow: 'rgba(251, 146, 60, 0.45)',
    darkBlob1: 'rgba(251, 146, 60, 0.18)',
    darkBlob2: 'rgba(234, 88, 12, 0.14)',
    darkGrid: 'rgba(251, 146, 60, 0.07)',
    darkParticle: 'rgba(251, 146, 60, 0.55)'
  },
  sapphire: {
    id: 'sapphire',
    name: 'Sapphire Azure',
    desc: 'Crisp Ocean Blue Canvas & Ice Accents',
    colorCode: '#2563EB',
    // Light Mode
    bg: '#EEF4FF',
    surface0: '#E0EDFE',
    surface1: '#EAF2FD',
    surface2: '#F4F8FE',
    surface3: '#DCE7F9',
    card: '#FFFFFF',
    cardHover: '#FAFCFF',
    ink: '#0F172A',
    inkSoft: '#1E3A8A',
    inkMuted: '#475569',
    border: '#BFDBFE',
    borderStrong: '#93C5FD',
    sidebarBg: '#E9F2FE',
    sidebarText: '#1E3A8A',
    sidebarBorder: '#BFDBFE',
    navbarBg: 'rgba(238, 244, 255, 0.95)',
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    soft: 'rgba(37, 99, 235, 0.14)',
    glow: 'rgba(37, 99, 235, 0.35)',
    ambientBlob1: 'rgba(37, 99, 235, 0.16)',
    ambientBlob2: 'rgba(96, 165, 250, 0.14)',
    ambientGrid: 'rgba(37, 99, 235, 0.07)',
    ambientParticle: 'rgba(37, 99, 235, 0.45)',
    // Dark Mode
    darkBg: '#060D1A',
    darkSurface0: '#0B1528',
    darkSurface1: '#0F1E38',
    darkSurface2: '#162A4E',
    darkSurface3: '#1F3866',
    darkCard: '#0E1B33',
    darkCardHover: '#152749',
    darkInk: '#F0F6FF',
    darkInkSoft: '#BFDBFE',
    darkInkMuted: '#60A5FA',
    darkBorder: 'rgba(96, 165, 250, 0.18)',
    darkBorderStrong: 'rgba(96, 165, 250, 0.32)',
    darkSidebarBg: '#091324',
    darkSidebarText: '#DBEAFE',
    darkSidebarBorder: 'rgba(96, 165, 250, 0.14)',
    darkNavbarBg: 'rgba(9, 19, 36, 0.95)',
    darkPrimary: '#60A5FA',
    darkHover: '#3B82F6',
    darkGradient: 'linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)',
    darkSoft: 'rgba(96, 165, 250, 0.20)',
    darkGlow: 'rgba(96, 165, 250, 0.45)',
    darkBlob1: 'rgba(59, 130, 246, 0.22)',
    darkBlob2: 'rgba(37, 99, 235, 0.16)',
    darkGrid: 'rgba(96, 165, 250, 0.08)',
    darkParticle: 'rgba(96, 165, 250, 0.55)'
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Forest',
    desc: 'Fresh Mint Canvas & Serene Green',
    colorCode: '#059669',
    // Light Mode
    bg: '#ECFDF5',
    surface0: '#D1FAE5',
    surface1: '#E6F8F0',
    surface2: '#F0FDF4',
    surface3: '#CCFBF1',
    card: '#FFFFFF',
    cardHover: '#F7FEFA',
    ink: '#064E3B',
    inkSoft: '#047857',
    inkMuted: '#374151',
    border: '#A7F3D0',
    borderStrong: '#6EE7B7',
    sidebarBg: '#E6F8F0',
    sidebarText: '#064E3B',
    sidebarBorder: '#A7F3D0',
    navbarBg: 'rgba(236, 253, 245, 0.95)',
    primary: '#059669',
    primaryHover: '#047857',
    gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    soft: 'rgba(5, 150, 105, 0.14)',
    glow: 'rgba(5, 150, 105, 0.35)',
    ambientBlob1: 'rgba(5, 150, 105, 0.15)',
    ambientBlob2: 'rgba(52, 211, 153, 0.12)',
    ambientGrid: 'rgba(5, 150, 105, 0.06)',
    ambientParticle: 'rgba(5, 150, 105, 0.45)',
    // Dark Mode
    darkBg: '#03140E',
    darkSurface0: '#072118',
    darkSurface1: '#0B2E22',
    darkSurface2: '#103E2F',
    darkSurface3: '#16513E',
    darkCard: '#09271D',
    darkCardHover: '#0E3628',
    darkInk: '#ECFDF5',
    darkInkSoft: '#A7F3D0',
    darkInkMuted: '#34D399',
    darkBorder: 'rgba(52, 211, 153, 0.18)',
    darkBorderStrong: 'rgba(52, 211, 153, 0.32)',
    darkSidebarBg: '#051A13',
    darkSidebarText: '#D1FAE5',
    darkSidebarBorder: 'rgba(52, 211, 153, 0.14)',
    darkNavbarBg: 'rgba(5, 26, 19, 0.95)',
    darkPrimary: '#34D399',
    darkHover: '#10B981',
    darkGradient: 'linear-gradient(135deg, #34D399 0%, #059669 100%)',
    darkSoft: 'rgba(52, 211, 153, 0.20)',
    darkGlow: 'rgba(52, 211, 153, 0.45)',
    darkBlob1: 'rgba(16, 185, 129, 0.22)',
    darkBlob2: 'rgba(5, 150, 105, 0.16)',
    darkGrid: 'rgba(52, 211, 153, 0.08)',
    darkParticle: 'rgba(52, 211, 153, 0.55)'
  },
  amethyst: {
    id: 'amethyst',
    name: 'Royal Amethyst',
    desc: 'Regal Lavender Canvas & Violet Mist',
    colorCode: '#7C3AED',
    // Light Mode
    bg: '#F5F3FF',
    surface0: '#EDE9FE',
    surface1: '#F3E8FF',
    surface2: '#FAF5FF',
    surface3: '#E9D5FF',
    card: '#FFFFFF',
    cardHover: '#FCFAFF',
    ink: '#3B0764',
    inkSoft: '#581C87',
    inkMuted: '#6B21A8',
    border: '#DDD6FE',
    borderStrong: '#C4B5FD',
    sidebarBg: '#F2EBFD',
    sidebarText: '#4C1D95',
    sidebarBorder: '#DDD6FE',
    navbarBg: 'rgba(245, 243, 255, 0.95)',
    primary: '#7C3AED',
    primaryHover: '#6D28D9',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
    soft: 'rgba(124, 58, 237, 0.14)',
    glow: 'rgba(124, 58, 237, 0.35)',
    ambientBlob1: 'rgba(124, 58, 237, 0.15)',
    ambientBlob2: 'rgba(167, 139, 250, 0.12)',
    ambientGrid: 'rgba(124, 58, 237, 0.06)',
    ambientParticle: 'rgba(124, 58, 237, 0.45)',
    // Dark Mode
    darkBg: '#0E091B',
    darkSurface0: '#160F2A',
    darkSurface1: '#1F153B',
    darkSurface2: '#2C1E52',
    darkSurface3: '#3B286D',
    darkCard: '#191130',
    darkCardHover: '#241845',
    darkInk: '#FAF5FF',
    darkInkSoft: '#DDD6FE',
    darkInkMuted: '#A78BFA',
    darkBorder: 'rgba(167, 139, 250, 0.18)',
    darkBorderStrong: 'rgba(167, 139, 250, 0.32)',
    darkSidebarBg: '#120C24',
    darkSidebarText: '#EDE9FE',
    darkSidebarBorder: 'rgba(167, 139, 250, 0.14)',
    darkNavbarBg: 'rgba(18, 12, 36, 0.95)',
    darkPrimary: '#A78BFA',
    darkHover: '#8B5CF6',
    darkGradient: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
    darkSoft: 'rgba(167, 139, 250, 0.20)',
    darkGlow: 'rgba(167, 139, 250, 0.45)',
    darkBlob1: 'rgba(139, 92, 246, 0.22)',
    darkBlob2: 'rgba(124, 58, 237, 0.16)',
    darkGrid: 'rgba(167, 139, 250, 0.08)',
    darkParticle: 'rgba(167, 139, 250, 0.55)'
  },
  coral: {
    id: 'coral',
    name: 'Crimson Ruby',
    desc: 'Blush Porcelain Canvas & Ruby Elegance',
    colorCode: '#DC2626',
    // Light Mode
    bg: '#FFF1F2',
    surface0: '#FFE4E6',
    surface1: '#FEE2E2',
    surface2: '#FFF5F5',
    surface3: '#FECDD3',
    card: '#FFFFFF',
    cardHover: '#FFF8F8',
    ink: '#4C0519',
    inkSoft: '#881337',
    inkMuted: '#9F1239',
    border: '#FECDD3',
    borderStrong: '#FDA4AF',
    sidebarBg: '#FFEBEF',
    sidebarText: '#881337',
    sidebarBorder: '#FECDD3',
    navbarBg: 'rgba(255, 241, 242, 0.95)',
    primary: '#DC2626',
    primaryHover: '#B91C1C',
    gradient: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
    soft: 'rgba(220, 38, 38, 0.14)',
    glow: 'rgba(220, 38, 38, 0.35)',
    ambientBlob1: 'rgba(220, 38, 38, 0.15)',
    ambientBlob2: 'rgba(248, 113, 113, 0.12)',
    ambientGrid: 'rgba(220, 38, 38, 0.06)',
    ambientParticle: 'rgba(220, 38, 38, 0.45)',
    // Dark Mode
    darkBg: '#170709',
    darkSurface0: '#230B0F',
    darkSurface1: '#301015',
    darkSurface2: '#42161D',
    darkSurface3: '#591E27',
    darkCard: '#270D12',
    darkCardHover: '#38131A',
    darkInk: '#FFF1F2',
    darkInkSoft: '#FECDD3',
    darkInkMuted: '#F87171',
    darkBorder: 'rgba(248, 113, 113, 0.18)',
    darkBorderStrong: 'rgba(248, 113, 113, 0.32)',
    darkSidebarBg: '#1B080B',
    darkSidebarText: '#FFE4E6',
    darkSidebarBorder: 'rgba(248, 113, 113, 0.14)',
    darkNavbarBg: 'rgba(27, 8, 11, 0.95)',
    darkPrimary: '#F87171',
    darkHover: '#EF4444',
    darkGradient: 'linear-gradient(135deg, #F87171 0%, #DC2626 100%)',
    darkSoft: 'rgba(248, 113, 113, 0.20)',
    darkGlow: 'rgba(248, 113, 113, 0.45)',
    darkBlob1: 'rgba(239, 68, 68, 0.22)',
    darkBlob2: 'rgba(220, 38, 38, 0.16)',
    darkGrid: 'rgba(248, 113, 113, 0.08)',
    darkParticle: 'rgba(248, 113, 113, 0.55)'
  },
  amber: {
    id: 'amber',
    name: 'Golden Amber',
    desc: 'Honey Amber Canvas & Rich Gold',
    colorCode: '#D97706',
    // Light Mode
    bg: '#FFFBEB',
    surface0: '#FEF3C7',
    surface1: '#FDF2B5',
    surface2: '#FFFDF0',
    surface3: '#FDE68A',
    card: '#FFFFFF',
    cardHover: '#FFFDF6',
    ink: '#451A03',
    inkSoft: '#78350F',
    inkMuted: '#92400E',
    border: '#FDE68A',
    borderStrong: '#FCD34D',
    sidebarBg: '#FEF7DA',
    sidebarText: '#78350F',
    sidebarBorder: '#FDE68A',
    navbarBg: 'rgba(255, 251, 235, 0.95)',
    primary: '#D97706',
    primaryHover: '#B45309',
    gradient: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)',
    soft: 'rgba(217, 119, 6, 0.14)',
    glow: 'rgba(217, 119, 6, 0.35)',
    ambientBlob1: 'rgba(217, 119, 6, 0.15)',
    ambientBlob2: 'rgba(251, 191, 36, 0.12)',
    ambientGrid: 'rgba(217, 119, 6, 0.06)',
    ambientParticle: 'rgba(217, 119, 6, 0.45)',
    // Dark Mode
    darkBg: '#150F04',
    darkSurface0: '#211807',
    darkSurface1: '#2E220B',
    darkSurface2: '#3F2F0E',
    darkSurface3: '#553F14',
    darkCard: '#271D09',
    darkCardHover: '#37290D',
    darkInk: '#FFFBEB',
    darkInkSoft: '#FDE68A',
    darkInkMuted: '#FBBF24',
    darkBorder: 'rgba(251, 191, 36, 0.18)',
    darkBorderStrong: 'rgba(251, 191, 36, 0.32)',
    darkSidebarBg: '#1A1305',
    darkSidebarText: '#FEF3C7',
    darkSidebarBorder: 'rgba(251, 191, 36, 0.14)',
    darkNavbarBg: 'rgba(26, 19, 5, 0.95)',
    darkPrimary: '#FBBF24',
    darkHover: '#F59E0B',
    darkGradient: 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)',
    darkSoft: 'rgba(251, 191, 36, 0.20)',
    darkGlow: 'rgba(251, 191, 36, 0.45)',
    darkBlob1: 'rgba(245, 158, 11, 0.22)',
    darkBlob2: 'rgba(217, 119, 6, 0.16)',
    darkGrid: 'rgba(251, 191, 36, 0.08)',
    darkParticle: 'rgba(251, 191, 36, 0.55)'
  },
  teal: {
    id: 'teal',
    name: 'Cyber Teal',
    desc: 'Arctic Cyan Canvas & Modern Teal',
    colorCode: '#0D9488',
    // Light Mode
    bg: '#F0FDFA',
    surface0: '#CCFBF1',
    surface1: '#E6FAF6',
    surface2: '#F7FEFD',
    surface3: '#99F6E4',
    card: '#FFFFFF',
    cardHover: '#F7FFFE',
    ink: '#042F2E',
    inkSoft: '#0F766E',
    inkMuted: '#115E59',
    border: '#99F6E4',
    borderStrong: '#5EEAD4',
    sidebarBg: '#E4FBF6',
    sidebarText: '#042F2E',
    sidebarBorder: '#99F6E4',
    navbarBg: 'rgba(240, 253, 250, 0.95)',
    primary: '#0D9488',
    primaryHover: '#0F766E',
    gradient: 'linear-gradient(135deg, #0D9488 0%, #115E59 100%)',
    soft: 'rgba(13, 148, 136, 0.14)',
    glow: 'rgba(13, 148, 136, 0.35)',
    ambientBlob1: 'rgba(13, 148, 136, 0.15)',
    ambientBlob2: 'rgba(45, 212, 191, 0.12)',
    ambientGrid: 'rgba(13, 148, 136, 0.06)',
    ambientParticle: 'rgba(13, 148, 136, 0.45)',
    // Dark Mode
    darkBg: '#041314',
    darkSurface0: '#071E20',
    darkSurface1: '#0B292C',
    darkSurface2: '#0F373B',
    darkSurface3: '#154B50',
    darkCard: '#092224',
    darkCardHover: '#0E2F32',
    darkInk: '#F0FDFA',
    darkInkSoft: '#99F6E4',
    darkInkMuted: '#2DD4BF',
    darkBorder: 'rgba(45, 212, 191, 0.18)',
    darkBorderStrong: 'rgba(45, 212, 191, 0.32)',
    darkSidebarBg: '#051819',
    darkSidebarText: '#CCFBF1',
    darkSidebarBorder: 'rgba(45, 212, 191, 0.14)',
    darkNavbarBg: 'rgba(5, 24, 25, 0.95)',
    darkPrimary: '#2DD4BF',
    darkHover: '#14B8A6',
    darkGradient: 'linear-gradient(135deg, #2DD4BF 0%, #0D9488 100%)',
    darkSoft: 'rgba(45, 212, 191, 0.20)',
    darkGlow: 'rgba(45, 212, 191, 0.45)',
    darkBlob1: 'rgba(20, 184, 166, 0.22)',
    darkBlob2: 'rgba(13, 148, 136, 0.16)',
    darkGrid: 'rgba(45, 212, 191, 0.08)',
    darkParticle: 'rgba(45, 212, 191, 0.55)'
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Slate',
    desc: 'Executive Slate Canvas & Deep Indigo',
    colorCode: '#4F46E5',
    // Light Mode
    bg: '#F1F5F9',
    surface0: '#E2E8F0',
    surface1: '#EDF2F7',
    surface2: '#F8FAFC',
    surface3: '#CBD5E1',
    card: '#FFFFFF',
    cardHover: '#FAFCFF',
    ink: '#0F172A',
    inkSoft: '#334155',
    inkMuted: '#64748B',
    border: '#CBD5E1',
    borderStrong: '#94A3B8',
    sidebarBg: '#EBF0F6',
    sidebarText: '#0F172A',
    sidebarBorder: '#CBD5E1',
    navbarBg: 'rgba(241, 245, 249, 0.95)',
    primary: '#4F46E5',
    primaryHover: '#4338CA',
    gradient: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
    soft: 'rgba(79, 70, 229, 0.14)',
    glow: 'rgba(79, 70, 229, 0.35)',
    ambientBlob1: 'rgba(79, 70, 229, 0.15)',
    ambientBlob2: 'rgba(99, 102, 241, 0.12)',
    ambientGrid: 'rgba(79, 70, 229, 0.06)',
    ambientParticle: 'rgba(79, 70, 229, 0.45)',
    // Dark Mode
    darkBg: '#090D16',
    darkSurface0: '#0F1524',
    darkSurface1: '#161F33',
    darkSurface2: '#1F2B45',
    darkSurface3: '#29395C',
    darkCard: '#121A2C',
    darkCardHover: '#18233C',
    darkInk: '#F8FAFC',
    darkInkSoft: '#CBD5E1',
    darkInkMuted: '#94A3B8',
    darkBorder: 'rgba(129, 140, 248, 0.18)',
    darkBorderStrong: 'rgba(129, 140, 248, 0.32)',
    darkSidebarBg: '#0D1322',
    darkSidebarText: '#E2E8F0',
    darkSidebarBorder: 'rgba(129, 140, 248, 0.14)',
    darkNavbarBg: 'rgba(13, 19, 34, 0.95)',
    darkPrimary: '#818CF8',
    darkHover: '#6366F1',
    darkGradient: 'linear-gradient(135deg, #818CF8 0%, #4F46E5 100%)',
    darkSoft: 'rgba(129, 140, 248, 0.20)',
    darkGlow: 'rgba(129, 140, 248, 0.45)',
    darkBlob1: 'rgba(99, 102, 241, 0.22)',
    darkBlob2: 'rgba(79, 70, 229, 0.16)',
    darkGrid: 'rgba(129, 140, 248, 0.08)',
    darkParticle: 'rgba(129, 140, 248, 0.55)'
  },
  rose: {
    id: 'rose',
    name: 'Velvet Rose',
    desc: 'Soft Rose Petal Canvas & Blush Magenta',
    colorCode: '#DB2777',
    // Light Mode
    bg: '#FFF0F5',
    surface0: '#FCE7F3',
    surface1: '#FDF2F8',
    surface2: '#FFF5FA',
    surface3: '#FBCFE8',
    card: '#FFFFFF',
    cardHover: '#FFF9FC',
    ink: '#500724',
    inkSoft: '#831843',
    inkMuted: '#9D174D',
    border: '#FBCFE8',
    borderStrong: '#F472B6',
    sidebarBg: '#FDF0F6',
    sidebarText: '#831843',
    sidebarBorder: '#FBCFE8',
    navbarBg: 'rgba(255, 240, 245, 0.95)',
    primary: '#DB2777',
    primaryHover: '#BE185D',
    gradient: 'linear-gradient(135deg, #DB2777 0%, #9D174D 100%)',
    soft: 'rgba(219, 39, 119, 0.14)',
    glow: 'rgba(219, 39, 119, 0.35)',
    ambientBlob1: 'rgba(219, 39, 119, 0.15)',
    ambientBlob2: 'rgba(244, 114, 182, 0.12)',
    ambientGrid: 'rgba(219, 39, 119, 0.06)',
    ambientParticle: 'rgba(219, 39, 119, 0.45)',
    // Dark Mode
    darkBg: '#160812',
    darkSurface0: '#230E1D',
    darkSurface1: '#321429',
    darkSurface2: '#451C39',
    darkSurface3: '#5C254C',
    darkCard: '#271020',
    darkCardHover: '#38172F',
    darkInk: '#FFF0F5',
    darkInkSoft: '#FBCFE8',
    darkInkMuted: '#F472B6',
    darkBorder: 'rgba(244, 114, 182, 0.18)',
    darkBorderStrong: 'rgba(244, 114, 182, 0.32)',
    darkSidebarBg: '#1B0B17',
    darkSidebarText: '#FCE7F3',
    darkSidebarBorder: 'rgba(244, 114, 182, 0.14)',
    darkNavbarBg: 'rgba(27, 11, 23, 0.95)',
    darkPrimary: '#F472B6',
    darkHover: '#EC4899',
    darkGradient: 'linear-gradient(135deg, #F472B6 0%, #DB2777 100%)',
    darkSoft: 'rgba(244, 114, 182, 0.20)',
    darkGlow: 'rgba(244, 114, 182, 0.45)',
    darkBlob1: 'rgba(236, 72, 153, 0.22)',
    darkBlob2: 'rgba(219, 39, 119, 0.16)',
    darkGrid: 'rgba(244, 114, 182, 0.08)',
    darkParticle: 'rgba(244, 114, 182, 0.55)'
  },
  cream: {
    id: 'cream',
    name: 'Warm Cream',
    desc: 'Subtle Pearl Cream Canvas & Bronze',
    colorCode: '#B87333',
    // Light Mode
    bg: '#FDFBF7',
    surface0: '#F6F0E4',
    surface1: '#F9F5EC',
    surface2: '#FCF9F2',
    surface3: '#EDE2D0',
    card: '#FFFFFF',
    cardHover: '#FFFDF9',
    ink: '#2B2118',
    inkSoft: '#5A4633',
    inkMuted: '#8A7056',
    border: '#E8DCB8',
    borderStrong: '#D6C49A',
    sidebarBg: '#F8F3E8',
    sidebarText: '#423324',
    sidebarBorder: '#E8DCB8',
    navbarBg: 'rgba(253, 251, 247, 0.95)',
    primary: '#B87333',
    primaryHover: '#995822',
    gradient: 'linear-gradient(135deg, #B87333 0%, #995822 100%)',
    soft: 'rgba(184, 115, 51, 0.14)',
    glow: 'rgba(184, 115, 51, 0.35)',
    ambientBlob1: 'rgba(184, 115, 51, 0.12)',
    ambientBlob2: 'rgba(212, 155, 106, 0.10)',
    ambientGrid: 'rgba(184, 115, 51, 0.05)',
    ambientParticle: 'rgba(184, 115, 51, 0.45)',
    // Dark Mode
    darkBg: '#12100E',
    darkSurface0: '#1A1714',
    darkSurface1: '#24201C',
    darkSurface2: '#302B25',
    darkSurface3: '#403A32',
    darkCard: '#1C1814',
    darkCardHover: '#28231E',
    darkInk: '#FAF7F2',
    darkInkSoft: '#D9CFC4',
    darkInkMuted: '#A89B8D',
    darkBorder: 'rgba(212, 155, 106, 0.18)',
    darkBorderStrong: 'rgba(212, 155, 106, 0.30)',
    darkSidebarBg: '#161310',
    darkSidebarText: '#EAE2D8',
    darkSidebarBorder: 'rgba(212, 155, 106, 0.14)',
    darkNavbarBg: 'rgba(22, 19, 16, 0.95)',
    darkPrimary: '#D49B6A',
    darkHover: '#C27E43',
    darkGradient: 'linear-gradient(135deg, #D49B6A 0%, #B87333 100%)',
    darkSoft: 'rgba(212, 155, 106, 0.20)',
    darkGlow: 'rgba(212, 155, 106, 0.45)',
    darkBlob1: 'rgba(212, 155, 106, 0.18)',
    darkBlob2: 'rgba(184, 115, 51, 0.14)',
    darkGrid: 'rgba(212, 155, 106, 0.07)',
    darkParticle: 'rgba(212, 155, 106, 0.55)'
  }
}

/**
 * Converts a hex code to HSL components for dynamic background & palette derivation
 */
export function hexToHsl(hex) {
  let c = String(hex || '#C27E43').replace('#', '')
  if (c.length === 3) c = c.split('').map(x => x + x).join('')
  const r = parseInt(c.substring(0, 2), 16) / 255
  const g = parseInt(c.substring(2, 4), 16) / 255
  const b = parseInt(c.substring(4, 6), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h = Math.round(h * 60)
  }
  return { h, s: Math.round(s * 100), l: Math.round(l * 100) }
}

/**
 * Dynamically constructs a full palette system for any custom chosen hex color.
 * Changes the entire background, surfaces, cards, and text in both light and dark modes!
 */
export function createCustomPalette(hex) {
  const { h, s, l } = hexToHsl(hex)
  const normHex = hex.startsWith('#') ? hex : `#${hex}`
  
  return {
    id: 'custom',
    name: 'Custom Accent',
    desc: `Custom Color (${normHex})`,
    colorCode: normHex,
    // Entire Light Mode Background & Surfaces
    bg: `hsl(${h}, ${Math.min(s, 45)}%, 97%)`,
    surface0: `hsl(${h}, ${Math.min(s, 40)}%, 92%)`,
    surface1: `hsl(${h}, ${Math.min(s, 35)}%, 95%)`,
    surface2: `hsl(${h}, ${Math.min(s, 30)}%, 98%)`,
    surface3: `hsl(${h}, ${Math.min(s, 45)}%, 89%)`,
    card: '#FFFFFF',
    cardHover: `hsl(${h}, ${Math.min(s, 30)}%, 99%)`,
    ink: `hsl(${h}, ${Math.max(s, 50)}%, 12%)`,
    inkSoft: `hsl(${h}, ${Math.max(s, 40)}%, 24%)`,
    inkMuted: `hsl(${h}, 25%, 45%)`,
    border: `hsl(${h}, ${Math.min(s, 45)}%, 86%)`,
    borderStrong: `hsl(${h}, ${Math.min(s, 50)}%, 74%)`,
    sidebarBg: `hsl(${h}, ${Math.min(s, 40)}%, 95%)`,
    sidebarText: `hsl(${h}, ${Math.max(s, 50)}%, 14%)`,
    sidebarBorder: `hsl(${h}, ${Math.min(s, 45)}%, 86%)`,
    navbarBg: `hsla(${h}, ${Math.min(s, 40)}%, 97%, 0.95)`,
    primary: normHex,
    primaryHover: `hsl(${h}, ${s}%, ${Math.max(l - 10, 20)}%)`,
    gradient: `linear-gradient(135deg, ${normHex} 0%, hsl(${h}, ${s}%, ${Math.max(l - 12, 18)}%) 100%)`,
    soft: `hsla(${h}, ${s}%, ${l}%, 0.14)`,
    glow: `hsla(${h}, ${s}%, ${l}%, 0.35)`,
    ambientBlob1: `hsla(${h}, ${s}%, 50%, 0.15)`,
    ambientBlob2: `hsla(${h}, ${Math.min(s + 10, 100)}%, 65%, 0.12)`,
    ambientGrid: `hsla(${h}, ${s}%, 50%, 0.06)`,
    ambientParticle: `hsla(${h}, ${s}%, 50%, 0.45)`,
    // Entire Dark Mode Background & Surfaces
    darkBg: `hsl(${h}, ${Math.min(s, 40)}%, 6%)`,
    darkSurface0: `hsl(${h}, ${Math.min(s, 38)}%, 10%)`,
    darkSurface1: `hsl(${h}, ${Math.min(s, 38)}%, 14%)`,
    darkSurface2: `hsl(${h}, ${Math.min(s, 35)}%, 19%)`,
    darkSurface3: `hsl(${h}, ${Math.min(s, 35)}%, 26%)`,
    darkCard: `hsl(${h}, ${Math.min(s, 38)}%, 11%)`,
    darkCardHover: `hsl(${h}, ${Math.min(s, 36)}%, 16%)`,
    darkInk: `hsl(${h}, 30%, 96%)`,
    darkInkSoft: `hsl(${h}, 35%, 82%)`,
    darkInkMuted: `hsl(${h}, 25%, 62%)`,
    darkBorder: `hsla(${h}, 50%, 70%, 0.18)`,
    darkBorderStrong: `hsla(${h}, 50%, 75%, 0.32)`,
    darkSidebarBg: `hsl(${h}, ${Math.min(s, 40)}%, 8%)`,
    darkSidebarText: `hsl(${h}, 30%, 92%)`,
    darkSidebarBorder: `hsla(${h}, 50%, 70%, 0.14)`,
    darkNavbarBg: `hsla(${h}, ${Math.min(s, 40)}%, 8%, 0.95)`,
    darkPrimary: `hsl(${h}, ${Math.min(s + 10, 100)}%, 65%)`,
    darkHover: `hsl(${h}, ${Math.min(s + 10, 100)}%, 55%)`,
    darkGradient: `linear-gradient(135deg, hsl(${h}, ${Math.min(s + 10, 100)}%, 65%) 0%, hsl(${h}, ${s}%, 50%) 100%)`,
    darkSoft: `hsla(${h}, ${s}%, 65%, 0.20)`,
    darkGlow: `hsla(${h}, ${s}%, 65%, 0.45)`,
    darkBlob1: `hsla(${h}, ${s}%, 55%, 0.22)`,
    darkBlob2: `hsla(${h}, ${s}%, 50%, 0.16)`,
    darkGrid: `hsla(${h}, ${s}%, 65%, 0.08)`,
    darkParticle: `hsla(${h}, ${s}%, 65%, 0.55)`
  }
}

export const FONT_SIZES = {
  small: { id: 'small', label: 'Compact (13px)', size: '13px' },
  medium: { id: 'medium', label: 'Standard (14px)', size: '14px' },
  large: { id: 'large', label: 'Comfortable (16px)', size: '16px' }
}

export const FONT_STYLES = {
  inter: { id: 'inter', label: 'Modern Inter (Sans-serif)', family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
  system: { id: 'system', label: 'System Native (Clean UI)', family: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  mono: { id: 'mono', label: 'Technical Mono (Plex Code)', family: "'IBM Plex Mono', 'Space Grotesk', monospace, sans-serif" },
  serif: { id: 'serif', label: 'Editorial Serif (Academic)', family: "'Merriweather', Georgia, 'Times New Roman', serif" }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('ceh_theme')
      return saved === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })

  const [accentColor, setAccentColorState] = useState(() => {
    try {
      return localStorage.getItem('ceh_accent_color') || 'sandal'
    } catch {
      return 'sandal'
    }
  })

  const [customHex, setCustomHex] = useState(() => {
    try {
      return localStorage.getItem('ceh_custom_hex') || '#C27E43'
    } catch {
      return '#C27E43'
    }
  })

  const [fontSize, setFontSizeState] = useState(() => {
    try {
      return localStorage.getItem('ceh_font_size') || 'medium'
    } catch {
      return 'medium'
    }
  })

  const [fontStyle, setFontStyleState] = useState(() => {
    try {
      return localStorage.getItem('ceh_font_style') || 'inter'
    } catch {
      return 'inter'
    }
  })

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const doc = document.documentElement
      const isDark = theme === 'dark'
      
      doc.setAttribute('data-theme', theme)
      doc.setAttribute('data-accent', accentColor)
      doc.setAttribute('data-font-size', fontSize)
      doc.setAttribute('data-font-style', fontStyle)

      // Resolve palette: preset or dynamically computed from customHex
      let palette = ACCENT_PALETTES[accentColor]
      if (!palette || accentColor === 'custom') {
        palette = createCustomPalette(customHex)
      }

      // 1. Entire Background & Shell Canvas
      const bg = isDark ? (palette.darkBg || '#0B0F17') : (palette.bg || '#F7F2E9')
      doc.style.setProperty('--bg', bg)

      // 2. Surfaces & Elevation
      const surface0 = isDark ? (palette.darkSurface0 || '#0F172A') : (palette.surface0 || '#EFE7DA')
      const surface1 = isDark ? (palette.darkSurface1 || '#162032') : (palette.surface1 || '#F4EFE6')
      const surface2 = isDark ? (palette.darkSurface2 || '#1E2D44') : (palette.surface2 || '#FAF5EB')
      const surface3 = isDark ? (palette.darkSurface3 || '#283B57') : (palette.surface3 || '#F3EAE0')
      doc.style.setProperty('--surface-0', surface0)
      doc.style.setProperty('--surface-1', surface1)
      doc.style.setProperty('--surface-2', surface2)
      doc.style.setProperty('--surface-3', surface3)

      // 3. Card Elements
      const card = isDark ? (palette.darkCard || '#131E33') : (palette.card || '#FFFDF9')
      const cardHover = isDark ? (palette.darkCardHover || '#192742') : (palette.cardHover || '#FFFFFF')
      doc.style.setProperty('--card', card)
      doc.style.setProperty('--card-hover', cardHover)

      // 4. High-Legibility Typography
      const ink = isDark ? (palette.darkInk || '#F8FAFC') : (palette.ink || '#2C1810')
      const inkSoft = isDark ? (palette.darkInkSoft || '#CBD5E1') : (palette.inkSoft || '#5E412E')
      const inkMuted = isDark ? (palette.darkInkMuted || '#94A3B8') : (palette.inkMuted || '#8C705B')
      doc.style.setProperty('--ink', ink)
      doc.style.setProperty('--ink-soft', inkSoft)
      doc.style.setProperty('--ink-muted', inkMuted)

      // 5. Borders & Dividers
      const border = isDark ? (palette.darkBorder || 'rgba(255, 255, 255, 0.10)') : (palette.border || '#E5DACB')
      const borderStrong = isDark ? (palette.darkBorderStrong || 'rgba(255, 255, 255, 0.20)') : (palette.borderStrong || '#DACAB8')
      doc.style.setProperty('--border', border)
      doc.style.setProperty('--border-strong', borderStrong)

      // 6. Navigation & Sidebar
      const sidebarBg = isDark ? (palette.darkSidebarBg || '#0D1525') : (palette.sidebarBg || '#FAF5EB')
      const sidebarText = isDark ? (palette.darkSidebarText || '#E2E8F0') : (palette.sidebarText || '#4A2E1B')
      const sidebarBorder = isDark ? (palette.darkSidebarBorder || 'rgba(255, 255, 255, 0.08)') : (palette.sidebarBorder || '#E5DACB')
      const navbarBg = isDark ? (palette.darkNavbarBg || 'rgba(13, 21, 37, 0.94)') : (palette.navbarBg || 'rgba(253, 251, 247, 0.94)')
      doc.style.setProperty('--sidebar-bg', sidebarBg)
      doc.style.setProperty('--sidebar-text', sidebarText)
      doc.style.setProperty('--sidebar-border', sidebarBorder)
      doc.style.setProperty('--navbar-bg', navbarBg)

      // 7. Dynamic Primary Accents
      const primary = isDark ? (palette.darkPrimary || palette.primary) : palette.primary
      const primaryHover = isDark ? (palette.darkHover || palette.primaryHover) : palette.primaryHover
      const gradient = isDark ? (palette.darkGradient || palette.gradient) : palette.gradient
      const soft = isDark ? (palette.darkSoft || palette.soft) : palette.soft
      const glow = isDark ? (palette.darkGlow || palette.glow) : palette.glow

      doc.style.setProperty('--primary', primary)
      doc.style.setProperty('--primary-hover', primaryHover)
      doc.style.setProperty('--primary-gradient', gradient)
      doc.style.setProperty('--primary-soft', soft)
      doc.style.setProperty('--primary-glow', glow)
      doc.style.setProperty('--border-hover', primary)

      // Backward compatibility aliases
      doc.style.setProperty('--orange', primary)
      doc.style.setProperty('--orange-soft', soft)
      doc.style.setProperty('--orange-glow', glow)
      doc.style.setProperty('--accent', primary)
      doc.style.setProperty('--accent-soft', soft)
      doc.style.setProperty('--accent-glow', glow)
      doc.style.setProperty('--accent-gradient', gradient)

      // 8. Ambient Lighting & Animated Canvas
      const blob1 = isDark ? (palette.darkBlob1 || palette.ambientBlob1) : palette.ambientBlob1
      const blob2 = isDark ? (palette.darkBlob2 || palette.ambientBlob2) : palette.ambientBlob2
      const grid = isDark ? (palette.darkGrid || palette.ambientGrid) : palette.ambientGrid
      const particle = isDark ? (palette.darkParticle || palette.ambientParticle) : palette.ambientParticle

      doc.style.setProperty('--ambient-blob-1', blob1 || 'rgba(194, 126, 67, 0.12)')
      doc.style.setProperty('--ambient-blob-2', blob2 || 'rgba(220, 168, 110, 0.10)')
      doc.style.setProperty('--ambient-grid', grid || 'rgba(194, 126, 67, 0.05)')
      doc.style.setProperty('--ambient-particle', particle || 'rgba(194, 126, 67, 0.45)')

      // 9. Font Size and Typography
      const sizeDef = FONT_SIZES[fontSize] || FONT_SIZES.medium
      doc.style.fontSize = sizeDef.size

      const styleDef = FONT_STYLES[fontStyle] || FONT_STYLES.inter
      doc.style.setProperty('--font-sans', styleDef.family)
    }

    try {
      localStorage.setItem('ceh_theme', theme)
      localStorage.setItem('ceh_accent_color', accentColor)
      localStorage.setItem('ceh_custom_hex', customHex)
      localStorage.setItem('ceh_font_size', fontSize)
      localStorage.setItem('ceh_font_style', fontStyle)
    } catch {}
  }, [theme, accentColor, customHex, fontSize, fontStyle])

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))

  const setAccentColor = (colorId) => {
    if (ACCENT_PALETTES[colorId]) {
      setAccentColorState(colorId)
    }
  }

  const setCustomColor = (hex) => {
    if (hex) {
      setCustomHex(hex)
      setAccentColorState('custom')
    }
  }

  const setFontSize = (size) => {
    if (FONT_SIZES[size]) setFontSizeState(size)
  }

  const setFontStyle = (style) => {
    if (FONT_STYLES[style]) setFontStyleState(style)
  }

  const resetAppearance = () => {
    setTheme('light')
    setAccentColorState('sandal')
    setCustomHex('#C27E43')
    setFontSizeState('medium')
    setFontStyleState('inter')
  }

  // Active resolved palette
  const activePalette = accentColor === 'custom' 
    ? createCustomPalette(customHex) 
    : (ACCENT_PALETTES[accentColor] || ACCENT_PALETTES.sandal)

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      toggleTheme,
      accentColor,
      setAccentColor,
      customHex,
      setCustomColor,
      activePalette,
      accentPalettes: ACCENT_PALETTES,
      fontSize,
      setFontSize,
      fontSizes: FONT_SIZES,
      fontStyle,
      setFontStyle,
      fontStyles: FONT_STYLES,
      resetAppearance
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    return {
      theme: 'light',
      setTheme: () => {},
      toggleTheme: () => {},
      accentColor: 'sandal',
      setAccentColor: () => {},
      customHex: '#C27E43',
      setCustomColor: () => {},
      activePalette: ACCENT_PALETTES.sandal,
      accentPalettes: ACCENT_PALETTES,
      fontSize: 'medium',
      setFontSize: () => {},
      fontSizes: FONT_SIZES,
      fontStyle: 'inter',
      setFontStyle: () => {},
      fontStyles: FONT_STYLES,
      resetAppearance: () => {}
    }
  }
  return context
}
