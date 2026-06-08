import * as React from "react";

export const AssecLogo = ({ className = "h-12 w-auto", ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        {/* Golden Gradient */}
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="30%" stopColor="#FFC107" />
          <stop offset="70%" stopColor="#FFA000" />
          <stop offset="100%" stopColor="#B57C1E" />
        </linearGradient>

        {/* Shield Border Gradient */}
        <linearGradient id="shield-border" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="50%" stopColor="#FFB300" />
          <stop offset="100%" stopColor="#8D6E63" />
        </linearGradient>

        {/* Dark Shield Background */}
        <linearGradient id="shield-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0B1A30" />
          <stop offset="100%" stopColor="#050C16" />
        </linearGradient>

        {/* Green Accent Gradient */}
        <linearGradient id="green-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1B5E20" />
          <stop offset="50%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#1B5E20" />
        </linearGradient>

        {/* Red Crest Gradient */}
        <linearGradient id="red-crest" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF1744" />
          <stop offset="100%" stopColor="#B71C1C" />
        </linearGradient>

        {/* Shadow Effect */}
        <filter id="logo-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Group with Shadow */}
      <g filter="url(#logo-shadow)">
        {/* 1. Shield Background Structure */}
        {/* Outer Shield Border (Gold Outline) */}
        <path
          d="M250,40 L410,110 C410,110 415,280 250,450 C85,280 90,110 90,110 L250,40 Z"
          fill="url(#shield-border)"
        />
        
        {/* Middle Shield Border (Black/Dark Outline) */}
        <path
          d="M250,48 L398,113 C398,113 403,275 250,438 C97,275 102,113 102,113 L250,48 Z"
          fill="#060F1E"
        />

        {/* Green Top Arch Highlight */}
        <path
          d="M250,52 C300,74 394,116 394,116 C394,116 395,160 370,200 C340,160 300,130 250,130 C200,130 160,160 130,200 C105,160 106,116 106,116 C106,116 200,74 250,52 Z"
          fill="url(#green-gradient)"
        />

        {/* Main Inner Dark Shield */}
        <path
          d="M250,60 L386,120 C386,120 390,265 250,422 C110,265 114,120 114,120 L250,60 Z"
          fill="url(#shield-bg)"
        />

        {/* 2. Top Stars (5 Stars) */}
        {/* Center Star (Large) */}
        <polygon
          points="250,95 256,113 275,113 260,124 266,142 250,131 234,142 240,124 225,113 244,113"
          fill="url(#gold-gradient)"
        />
        {/* Inner Stars Left */}
        <polygon
          points="195,120 199,132 211,132 201,139 205,151 195,143 185,151 189,139 179,132 191,132"
          fill="url(#gold-gradient)"
        />
        <polygon
          points="150,132 153,142 163,142 155,148 158,158 150,152 142,158 145,148 137,142 147,142"
          fill="url(#gold-gradient)"
        />
        {/* Inner Stars Right */}
        <polygon
          points="305,120 309,132 321,132 311,139 315,151 305,143 295,151 299,139 289,132 301,132"
          fill="url(#gold-gradient)"
        />
        <polygon
          points="350,132 353,142 363,142 355,148 358,158 350,152 342,158 345,148 337,142 347,142"
          fill="url(#gold-gradient)"
        />

        {/* 3. "FORTITUDINE" Arch */}
        <path id="fortitude-path" d="M140,192 Q250,175 360,192" fill="none" />
        <text font-family="'Georgia', serif" font-weight="bold" font-size="16" fill="url(#gold-gradient)" letter-spacing="4" text-anchor="middle">
          <textPath href="#fortitude-path" startOffset="50%">
            FORTITUDINE
          </textPath>
        </text>

        {/* 4. ASSEC Ribbon/Banner */}
        {/* Banner Shadow/Back */}
        <path d="M102,192 H398 V265 H102 Z" fill="#030A14" />
        {/* Banner Front */}
        <path d="M108,198 H392 V258 H108 Z" fill="#08182D" stroke="url(#gold-gradient)" strokeWidth="3" />
        
        {/* ASSEC Typography */}
        <text
          x="250"
          y="245"
          font-family="'Georgia', 'Times New Roman', serif"
          font-weight="900"
          font-size="52"
          fill="#FFFFFF"
          text-anchor="middle"
          letter-spacing="5"
        >
          ASSEC
        </text>

        {/* 5. Main Corrected Text: ASSOCIAÇÃO DOS SERVIDORES... */}
        <text
          x="250"
          y="288"
          font-family="'Inter', 'system-ui', sans-serif"
          font-weight="bold"
          font-size="12"
          fill="#FFFFFF"
          text-anchor="middle"
          letter-spacing="1.5"
        >
          ASSOCIAÇÃO DOS
        </text>
        <text
          x="250"
          y="306"
          font-family="'Inter', 'system-ui', sans-serif"
          font-weight="bold"
          font-size="12"
          fill="#FFFFFF"
          text-anchor="middle"
          letter-spacing="1.5"
        >
          SERVIDORES DA
        </text>
        <text
          x="250"
          y="326"
          font-family="'Inter', 'system-ui', sans-serif"
          font-weight="900"
          font-size="15"
          fill="url(#gold-gradient)"
          text-anchor="middle"
          letter-spacing="2"
        >
          SEGURANÇA DO CEARÁ
        </text>

        {/* 6. Laurel Wreaths (Golden Branches) */}
        {/* Left Laurel */}
        <path
          d="M160,280 Q130,340 195,395"
          stroke="url(#gold-gradient)"
          strokeWidth="3"
          fill="none"
        />
        {/* Leaves Left */}
        <path d="M152,295 C146,289 146,299 152,305 Z" fill="url(#gold-gradient)" />
        <path d="M142,315 C136,309 136,319 142,325 Z" fill="url(#gold-gradient)" />
        <path d="M137,335 C131,329 131,339 137,345 Z" fill="url(#gold-gradient)" />
        <path d="M138,355 C132,349 135,361 143,365 Z" fill="url(#gold-gradient)" />
        <path d="M148,375 C144,369 148,380 156,382 Z" fill="url(#gold-gradient)" />
        <path d="M165,390 C162,384 167,393 175,391 Z" fill="url(#gold-gradient)" />

        {/* Right Laurel */}
        <path
          d="M340,280 Q370,340 305,395"
          stroke="url(#gold-gradient)"
          strokeWidth="3"
          fill="none"
        />
        {/* Leaves Right */}
        <path d="M348,295 C354,289 354,299 348,305 Z" fill="url(#gold-gradient)" />
        <path d="M358,315 C364,309 364,319 358,325 Z" fill="url(#gold-gradient)" />
        <path d="M363,335 C369,329 369,339 363,345 Z" fill="url(#gold-gradient)" />
        <path d="M362,355 C368,349 365,361 357,365 Z" fill="url(#gold-gradient)" />
        <path d="M352,375 C356,369 352,380 344,382 Z" fill="url(#gold-gradient)" />
        <path d="M335,390 C338,384 333,393 325,391 Z" fill="url(#gold-gradient)" />

        {/* 7. Spartan/Roman Helmet */}
        {/* Helmet Crest (Red Feather Plume) */}
        <path
          d="M210,345 C210,320 290,320 290,345 C275,340 225,340 210,345 Z"
          fill="url(#red-crest)"
        />
        <path
          d="M215,343 C220,330 280,330 285,343 C270,338 230,338 215,343 Z"
          fill="#FF8A80"
          opacity="0.3"
        />
        
        {/* Helmet Shield Face/Plate (Silver Metallic) */}
        <path
          d="M228,380 C228,348 272,348 272,380 C272,408 228,408 228,380 Z"
          fill="#90A4AE"
          stroke="#455A64"
          strokeWidth="2.5"
        />
        {/* Helmet Nose Guard & Eye Slits (Dark Cutouts) */}
        <path
          d="M250,358 L254,378 L266,378 L254,386 L254,402 L246,402 L246,386 L234,378 L246,378 Z"
          fill="#1C2833"
        />
        {/* Gold Trim/Accents on Helmet */}
        <path
          d="M232,376 C240,366 260,366 268,376"
          stroke="url(#gold-gradient)"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="250" cy="353" r="3.5" fill="url(#gold-gradient)" />
      </g>
    </svg>
  );
};
