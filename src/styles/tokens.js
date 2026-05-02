// ══════════════════════════════════════════════════════════════
// ECEPT_TOKENS — design tokens premium
// ══════════════════════════════════════════════════════════════
// Sistema unificado de spacing/radius/shadow/easing/timing/font/color/bp/z.
// Uso: T.color.primary, T.space.lg, T.ease.standard, etc.
// ══════════════════════════════════════════════════════════════
var ECEPT_TOKENS = {
  space: {
    xs:   '4px',
    sm:   '8px',
    md:   '12px',
    lg:   '16px',
    xl:   '24px',
    xxl:  '32px',
    xxxl: '48px',
    huge: '64px'
  },
  radius: {
    sm:   '6px',
    md:   '10px',
    lg:   '14px',
    xl:   '20px',
    xxl:  '28px',
    pill: '999px'
  },
  shadow: {
    sm:           '0 1px 2px rgba(0,0,0,0.2)',
    md:           '0 2px 8px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.15)',
    lg:           '0 8px 24px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)',
    xl:           '0 20px 48px rgba(0,0,0,0.4), 0 8px 16px rgba(0,0,0,0.25)',
    glow_blue:    '0 0 32px rgba(96,165,250,0.25)',
    glow_purple:  '0 0 32px rgba(167,139,250,0.25)',
    glow_premium: '0 0 40px rgba(251,191,36,0.2), 0 4px 16px rgba(251,191,36,0.15)',
    inset_hi:     'inset 0 1px 0 rgba(255,255,255,0.04)'
  },
  ease: {
    standard: 'cubic-bezier(0.32, 0.72, 0, 1)',
    out:      'cubic-bezier(0.16, 1, 0.3, 1)',
    spring:   'cubic-bezier(0.34, 1.56, 0.64, 1)',
    sharp:    'cubic-bezier(0.4, 0, 0.6, 1)'
  },
  time: {
    instant: '120ms',
    fast:    '180ms',
    medium:  '240ms',
    slow:    '320ms',
    slower:  '480ms',
    spring:  '520ms'
  },
  font: {
    display: { size: '48px', weight: 800, lh: '1.05', spacing: '-0.025em' },
    h1:      { size: '36px', weight: 700, lh: '1.15', spacing: '-0.02em' },
    h2:      { size: '24px', weight: 700, lh: '1.25', spacing: '-0.015em' },
    h3:      { size: '18px', weight: 600, lh: '1.35', spacing: '-0.01em' },
    body:    { size: '15px', weight: 400, lh: '1.55' },
    bodySm:  { size: '13px', weight: 400, lh: '1.5' },
    caption: { size: '12px', weight: 500, lh: '1.4' },
    micro:   { size: '11px', weight: 500, lh: '1.3' }
  },
  color: {
    bg0: '#060a14',
    bg1: '#0a0e1f',
    bg2: '#0d1224',
    bg3: '#11173a',
    bg4: '#1a2040',

    text:      '#e2e8f0',
    textMuted: '#94a3b8',
    textDim:   '#64748b',
    textGhost: '#475569',

    primary:     '#3b82f6',
    primaryHi:   '#60a5fa',
    primarySoft: 'rgba(59,130,246,0.12)',

    purple: '#a78bfa',
    cyan:   '#06b6d4',
    pink:   '#f472b6',

    success: '#34d399',
    warning: '#fbbf24',
    danger:  '#ef4444',

    gold:   '#fbbf24',
    goldHi: '#fcd34d',

    gradBlue:    'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
    gradPurple:  'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
    gradMixed:   'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
    gradPremium: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    gradHero:    'linear-gradient(180deg, #0a0e1f 0%, #060a14 100%)',
    gradSurface: 'linear-gradient(180deg, #0d1224 0%, #0a0e1f 100%)'
  },
  bp: {
    mobile:  640,
    tablet:  768,
    desktop: 1024,
    wide:    1280
  },
  z: {
    base:     1,
    sticky:   100,
    dropdown: 1000,
    modal:    5000,
    toast:    8000,
    tooltip:  9000,
    max:      99999
  }
};

window.ECEPT_TOKENS = ECEPT_TOKENS;
window.T = ECEPT_TOKENS;
