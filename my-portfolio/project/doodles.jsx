// Crayon-style SVG doodle library

const Doodles = {
  ScribbleUnder: ({ color = "#3d3a2e", strokeWidth = 5, className = "" }) => (
    <svg viewBox="0 0 300 30" preserveAspectRatio="none" className={className} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <path d="M5,18 Q40,8 80,16 T160,14 Q200,18 240,12 T295,16"
        stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
      <path d="M10,22 Q50,14 95,20 T180,19 Q220,23 260,18 T293,22"
        stroke={color} strokeWidth={strokeWidth - 1.5} fill="none" strokeLinecap="round" opacity="0.55" />
    </svg>
  ),

  HeroScribble: ({ color = "#ff9b6d", strokeWidth = 8, className = "" }) => (
    <svg viewBox="0 0 600 50" preserveAspectRatio="none" className={className} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <path d="M8,28 Q60,12 120,24 T240,22 Q300,30 360,20 T480,24 Q540,32 592,22"
        stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
      <path d="M14,38 Q70,24 140,34 T260,32 Q320,38 380,30 T500,34 Q548,40 588,32"
        stroke={color} strokeWidth={strokeWidth - 2} fill="none" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),

  Star: ({ size = 36, color = "#ffc857", stroke = "#3d3a2e", className = "", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} style={style}>
      <path d="M30,6 L36,22 L54,24 L40,36 L44,54 L30,44 L16,54 L20,36 L6,24 L24,22 Z"
        fill={color} stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  ),

  Squiggle: ({ size = 60, color = "#7fb8a0", className = "", style = {} }) => (
    <svg width={size * 1.6} height={size * 0.6} viewBox="0 0 100 36" className={className} style={style}>
      <path d="M5,18 Q15,5 25,18 T45,18 T65,18 T85,18 T95,18"
        stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  ),

  Heart: ({ size = 32, color = "#f7a3a8", stroke = "#3d3a2e", className = "", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={style}>
      <path d="M20,34 C8,26 4,18 4,12 C4,7 8,4 12,4 C15,4 18,6 20,10 C22,6 25,4 28,4 C32,4 36,7 36,12 C36,18 32,26 20,34 Z"
        fill={color} stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  ),

  Spiral: ({ size = 40, color = "#7eb1d6", className = "", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 50 50" className={className} style={style}>
      <path d="M25,25 m-2,0 a2,2 0 1,1 4,0 a4,4 0 1,1 -8,0 a6,6 0 1,1 12,0 a8,8 0 1,1 -16,0 a10,10 0 1,1 20,0"
        stroke={color} strokeWidth="2.8" fill="none" strokeLinecap="round" />
    </svg>
  ),

  Cloud: ({ size = 60, color = "#ffffff", stroke = "#3d3a2e", className = "", style = {} }) => (
    <svg width={size} height={size * 0.65} viewBox="0 0 80 50" className={className} style={style}>
      <path d="M15,35 Q5,35 5,25 Q5,15 16,15 Q18,5 30,5 Q42,5 46,15 Q56,12 62,20 Q72,20 72,30 Q72,40 62,40 L18,40 Q15,40 15,35 Z"
        fill={color} stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  ),

  Sun: ({ size = 60, color = "#ffd84a", stroke = "#3d3a2e", className = "", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 80 80" className={className} style={style}>
      <circle cx="40" cy="40" r="16" fill={color} stroke={stroke} strokeWidth="2.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return <line key={i}
          x1={40 + Math.cos(rad) * 22} y1={40 + Math.sin(rad) * 22}
          x2={40 + Math.cos(rad) * 34} y2={40 + Math.sin(rad) * 34}
          stroke={stroke} strokeWidth="2.8" strokeLinecap="round" />;
      })}
    </svg>
  ),

  Flower: ({ size = 50, color = "#f7c1c9", stroke = "#3d3a2e", className = "", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} style={style}>
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 30 + Math.cos(rad) * 12;
        const cy = 30 + Math.sin(rad) * 12;
        return <ellipse key={i} cx={cx} cy={cy} rx="9" ry="6"
          transform={`rotate(${angle} ${cx} ${cy})`}
          fill={color} stroke={stroke} strokeWidth="2" />;
      })}
      <circle cx="30" cy="30" r="6" fill="#ffd84a" stroke={stroke} strokeWidth="2" />
    </svg>
  ),

  Triangle: ({ size = 30, color = "#b8e6c8", stroke = "#3d3a2e", className = "", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={style}>
      <path d="M20,6 L34,32 L6,32 Z" fill={color} stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  ),

  Dot: ({ size = 12, color = "#3d3a2e", className = "", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 12 12" className={className} style={style}>
      <circle cx="6" cy="6" r="5" fill={color} />
    </svg>
  ),

  WavyDivider: ({ color = "#3d3a2e", className = "", style = {} }) => (
    <svg viewBox="0 0 600 24" preserveAspectRatio="none" className={className} style={style}>
      <path d="M0,12 Q50,2 100,12 T200,12 T300,12 T400,12 T500,12 T600,12"
        stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  ),

  CornerBurst: ({ size = 60, color = "#ffd84a", stroke = "#3d3a2e", className = "", style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} style={style}>
      <path d="M10,30 L25,30 M30,10 L30,25 M14,14 L24,24 M14,46 L24,36 M46,14 L36,24"
        stroke={stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="30" cy="30" r="6" fill={color} stroke={stroke} strokeWidth="2" />
    </svg>
  ),

  // Subtle atmospheric crayon backdrop — lives behind hero text.
  // Pure line-art, no color bands. Tiny moving accents only.
  HeroBackdrop: ({ className = "", style = {} }) => (
    <svg viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid slice" className={className} style={style}>
      {/* Very faint hand-drawn horizon, double pass for crayon feel */}
      <path d="M0,470 Q200,462 400,468 Q600,474 800,466 Q1000,460 1200,470 Q1320,474 1400,468"
        stroke="#3d3a2e" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.14" />
      <path d="M0,474 Q200,466 400,472 Q600,478 800,470 Q1000,464 1200,474 Q1320,478 1400,472"
        stroke="#3d3a2e" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.08" />

      {/* Distant rolling hills — just outline, no fill */}
      <path d="M0,478 Q180,448 360,470 Q540,492 720,464 Q900,436 1080,468 Q1260,494 1400,476"
        stroke="#3d3a2e" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.18" />

      {/* A few quiet wave hints */}
      <path d="M40,540 Q100,536 160,540 T280,540 T400,540 T520,540"
        stroke="#3d3a2e" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.12" />
      <path d="M880,560 Q940,556 1000,560 T1120,560 T1240,560 T1360,560"
        stroke="#3d3a2e" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.12" />

      {/* Soft sun glow, far upper right — outline only, breathing */}
      <g style={{ animation: 'breathe 14s ease-in-out infinite' }}>
        <circle cx="1240" cy="150" r="54" fill="none" stroke="#e8b25a" strokeWidth="1.4" opacity="0.35" />
        <circle cx="1240" cy="150" r="38" fill="#ffe9a8" opacity="0.28" />
      </g>

      {/* Drifting outline clouds — paper-thin, no fill */}
      <g style={{ animation: 'driftSlow 90s linear infinite' }} opacity="0.55">
        <path d="M180,200 Q168,200 168,188 Q168,176 184,176 Q188,162 204,162 Q220,162 224,176 Q238,176 238,190 Q238,202 224,202 L194,202 Q180,202 180,200 Z"
          fill="none" stroke="#3d3a2e" strokeWidth="1.4" strokeLinejoin="round" />
      </g>
      <g style={{ animation: 'driftSlow 110s linear infinite reverse', animationDelay: '-30s' }} opacity="0.45">
        <path d="M580,130 Q570,130 570,120 Q570,110 584,110 Q588,98 602,98 Q616,98 620,110 Q632,110 632,122 Q632,132 620,132 L592,132 Q580,132 580,130 Z"
          fill="none" stroke="#3d3a2e" strokeWidth="1.3" strokeLinejoin="round" />
      </g>
      <g style={{ animation: 'driftSlow 130s linear infinite', animationDelay: '-50s' }} opacity="0.4">
        <path d="M960,80 Q950,80 950,70 Q950,60 964,60 Q968,48 982,48 Q996,48 1000,60 Q1012,60 1012,72 Q1012,82 1000,82 L972,82 Q960,82 960,80 Z"
          fill="none" stroke="#3d3a2e" strokeWidth="1.3" strokeLinejoin="round" />
      </g>

      {/* Tiny twinkling stars in the upper area — cheerful, subtle */}
      <g opacity="0.55">
        <circle cx="320" cy="110" r="2" fill="#e8b25a">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="3.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="760" cy="160" r="1.8" fill="#7eb1d6">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="4.4s" begin="-1s" repeatCount="indefinite" />
        </circle>
        <circle cx="1080" cy="260" r="2" fill="#f7a3a8">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="5.2s" begin="-2s" repeatCount="indefinite" />
        </circle>
        <circle cx="460" cy="220" r="1.6" fill="#7fb8a0">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="4s" begin="-0.8s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Single bird in distance, slowly drifting */}
      <g style={{ animation: 'driftSlow 70s linear infinite' }} opacity="0.35">
        <path d="M380,260 Q386,254 392,260 Q398,254 404,260" stroke="#3d3a2e" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </g>
      <g style={{ animation: 'driftSlow 85s linear infinite reverse', animationDelay: '-20s' }} opacity="0.3">
        <path d="M820,290 Q826,284 832,290 Q838,284 844,290" stroke="#3d3a2e" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </g>

      {/* Tiny faraway sailboat — quiet, gently swaying */}
      <g transform="translate(1000, 488)" style={{ animation: 'sway 9s ease-in-out infinite' }} opacity="0.4">
        <path d="M-10,10 L10,10 L7,16 L-7,16 Z" fill="none" stroke="#3d3a2e" strokeWidth="1.3" strokeLinejoin="round" />
        <line x1="0" y1="10" x2="0" y2="-2" stroke="#3d3a2e" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M0,-1 L0,9 L7,9 Z" fill="none" stroke="#3d3a2e" strokeWidth="1.3" strokeLinejoin="round" />
      </g>
    </svg>
  ),
};

window.Doodles = Doodles;
