import React from 'react';

interface StorySceneSvgProps {
  visualKey: string;
  className?: string;
}

export const StorySceneSvg: React.FC<StorySceneSvgProps> = ({ visualKey, className = "w-full h-64" }) => {
  switch (visualKey) {
    // 1. The Seed and the Rock
    case 'seed_blocked':
      return (
        <svg viewBox="0 0 500 300" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="soilGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A3B32" />
              <stop offset="100%" stopColor="#2D221C" />
            </linearGradient>
            <linearGradient id="rockGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7B827E" />
              <stop offset="100%" stopColor="#4A524D" />
            </linearGradient>
          </defs>
          {/* Earth soil */}
          <rect width="500" height="300" fill="url(#soilGrad1)" />
          {/* Surface boundary */}
          <path d="M 0 50 Q 150 40 300 55 T 500 45 L 500 0 L 0 0 Z" fill="#E5F0E8" />
          <path d="M 0 50 Q 150 40 300 55 T 500 45" stroke="#8EBD78" strokeWidth="6" fill="none" />
          {/* Heavy Rock directly above seed */}
          <path d="M 170 120 C 190 70, 310 70, 330 110 C 350 150, 320 200, 290 210 C 220 220, 160 170, 170 120 Z" fill="url(#rockGrad1)" stroke="#373D39" strokeWidth="3" />
          {/* Rock texture cracks */}
          <path d="M 230 110 L 260 140 L 250 170" stroke="#373D39" strokeWidth="2" fill="none" />
          {/* Sprout pushing upward directly against stone */}
          <circle cx="250" cy="260" r="10" fill="#8EBD78" />
          <path d="M 250 250 L 250 205" stroke="#8EBD78" strokeWidth="6" strokeLinecap="round" />
          {/* Straining micro-leaves hitting rock bottom */}
          <path d="M 245 205 Q 235 195 242 190" stroke="#8EBD78" strokeWidth="4" fill="none" />
          <path d="M 255 205 Q 265 195 258 190" stroke="#8EBD78" strokeWidth="4" fill="none" />
          <text x="250" y="290" textAnchor="middle" fill="#DEE2DC" fontSize="13" fontFamily="sans-serif">Direct upward path blocked by the heavy rock</text>
        </svg>
      );

    case 'seed_sideways':
      return (
        <svg viewBox="0 0 500 300" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="soilGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A3B32" />
              <stop offset="100%" stopColor="#2D221C" />
            </linearGradient>
            <linearGradient id="sunbeam" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F2D69B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F2D69B" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <rect width="500" height="300" fill="url(#soilGrad2)" />
          {/* Surface boundary */}
          <path d="M 0 50 Q 150 40 300 55 T 500 45 L 500 0 L 0 0 Z" fill="#E5F0E8" />
          {/* Warm Sunbeam reaching sideways gap */}
          <polygon points="360,0 420,0 380,240 330,240" fill="url(#sunbeam)" />
          {/* Immovable Rock */}
          <path d="M 150 120 C 170 70, 290 70, 310 110 C 330 150, 300 200, 270 210 C 200 220, 140 170, 150 120 Z" fill="#5A615D" stroke="#373D39" strokeWidth="3" />
          {/* Sprout curving gracefully sideways toward the light */}
          <circle cx="230" cy="260" r="10" fill="#8EBD78" />
          <path d="M 230 250 Q 240 220 280 220 T 350 200" stroke="#8EBD78" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Fresh vibrant green leaflets unfurling toward light */}
          <path d="M 350 200 Q 370 190 365 175" stroke="#8EBD78" strokeWidth="5" fill="#8EBD78" />
          <path d="M 345 205 Q 360 215 375 210" stroke="#8EBD78" strokeWidth="4" fill="#8EBD78" />
          <text x="250" y="290" textAnchor="middle" fill="#DEE2DC" fontSize="13" fontFamily="sans-serif">The sprout curves around the stone toward the sunlit gap</text>
        </svg>
      );

    case 'seed_blooming':
      return (
        <svg viewBox="0 0 500 300" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skyGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E5F0E8" />
              <stop offset="100%" stopColor="#F3F4F0" />
            </linearGradient>
            <radialGradient id="sunGlow" cx="80%" cy="20%" r="50%">
              <stop offset="0%" stopColor="#F2D69B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F2D69B" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="500" height="300" fill="url(#skyGrad1)" />
          <circle cx="420" cy="60" r="80" fill="url(#sunGlow)" />
          {/* Ground */}
          <path d="M 0 200 Q 200 190 350 210 T 500 200 L 500 300 L 0 300 Z" fill="#29483A" />
          <path d="M 0 200 Q 200 190 350 210 T 500 200" stroke="#8EBD78" strokeWidth="5" fill="none" />
          {/* The original rock resting quietly beside the plant */}
          <path d="M 120 230 C 140 170, 240 170, 260 210 C 270 240, 250 270, 220 275 C 160 280, 110 250, 120 230 Z" fill="#5A615D" />
          {/* Full flourishing plant rising gracefully beside the rock */}
          <path d="M 280 250 Q 300 180 320 120" stroke="#52796F" strokeWidth="8" strokeLinecap="round" fill="none" />
          {/* Leaves */}
          <path d="M 305 180 C 340 170, 360 190, 340 205 C 320 205, 305 190, 305 180 Z" fill="#8EBD78" />
          <path d="M 295 160 C 260 150, 240 170, 260 185 C 280 185, 295 170, 295 160 Z" fill="#8EBD78" />
          {/* Golden flower bloom */}
          <circle cx="320" cy="115" r="14" fill="#C47D57" />
          <circle cx="320" cy="90" r="12" fill="#F2D69B" />
          <circle cx="345" cy="105" r="12" fill="#F2D69B" />
          <circle cx="335" cy="130" r="12" fill="#F2D69B" />
          <circle cx="305" cy="130" r="12" fill="#F2D69B" />
          <circle cx="295" cy="105" r="12" fill="#F2D69B" />
          <circle cx="320" cy="115" r="9" fill="#C47D57" />
          <text x="250" y="285" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontFamily="sans-serif">The sideways bloom — thriving without breaking the rock</text>
        </svg>
      );

    // 2. The River That Took Another Route
    case 'river_blocked':
      return (
        <svg viewBox="0 0 500 300" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="500" height="300" fill="#E5F0E8" />
          {/* Mountain Wall */}
          <polygon points="260,30 360,30 380,260 240,260" fill="#4A524D" />
          <polygon points="230,80 330,80 350,260 210,260" fill="#3B423D" />
          {/* River rushing and crashing */}
          <path d="M 0 200 Q 120 180 230 190" stroke="#52796F" strokeWidth="36" fill="none" strokeLinecap="round" />
          <circle cx="230" cy="190" r="25" fill="#E5F0E8" opacity="0.8" />
          <text x="250" y="285" textAnchor="middle" fill="#252C28" fontSize="13" fontFamily="sans-serif">The mountain stream meets an impassable stone wall</text>
        </svg>
      );

    case 'river_pooling':
    case 'river_flowing':
      return (
        <svg viewBox="0 0 500 300" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="500" height="300" fill="#E9EEE8" />
          {/* Wall to the right */}
          <polygon points="320,40 450,40 470,250 300,250" fill="#4A524D" />
          {/* Gentle moss contour */}
          <path d="M 0 100 Q 150 120 260 140 T 400 280" fill="none" stroke="#8EBD78" strokeWidth="8" />
          {/* River curving around effortlessly */}
          <path d="M 0 170 Q 180 150 250 190 T 450 270" stroke="#52796F" strokeWidth="32" fill="none" />
          <circle cx="210" cy="180" r="28" fill="#52796F" opacity="0.4" />
          <text x="250" y="285" textAnchor="middle" fill="#252C28" fontSize="13" fontFamily="sans-serif">The river carves an easier, fertile curve around the bend</text>
        </svg>
      );

    // 3. The Smallest Tree
    case 'tree_shadow':
    case 'tree_roots':
    case 'tree_breeze':
      return (
        <svg viewBox="0 0 500 300" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="500" height="300" fill="#E5F0E8" />
          {/* Ground line */}
          <line x1="0" y1="210" x2="500" y2="210" stroke="#24332D" strokeWidth="4" />
          {/* Tall oak on left */}
          <rect x="70" y="50" width="30" height="160" fill="#4A3B32" />
          <circle cx="85" cy="50" r="60" fill="#29483A" opacity="0.8" />
          {/* Small young birch in center */}
          <rect x="250" y="120" width="10" height="90" fill="#DEE2DC" />
          <circle cx="255" cy="115" r="28" fill="#8EBD78" />
          {/* Deep underground taproots shown transparently below ground */}
          <rect x="0" y="212" width="500" height="88" fill="#2D221C" />
          <path d="M 255 212 L 255 270 M 255 240 L 230 280 M 255 250 L 280 285" stroke="#DEE2DC" strokeWidth="3" strokeLinecap="round" />
          <text x="250" y="200" textAnchor="middle" fill="#24332D" fontSize="13" fontFamily="sans-serif">Quiet underground roots anchor steady growth</text>
        </svg>
      );

    // 4. The Flower After the Rain
    case 'flower_wilting':
    case 'flower_rain':
    case 'flower_blooming':
      return (
        <svg viewBox="0 0 500 300" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="500" height="300" fill="#E5F0E8" />
          {/* Soft rain clouds */}
          <circle cx="200" cy="70" r="35" fill="#747C75" opacity="0.4" />
          <circle cx="240" cy="60" r="45" fill="#747C75" opacity="0.5" />
          <circle cx="280" cy="70" r="35" fill="#747C75" opacity="0.4" />
          {/* Rain streaks */}
          <line x1="210" y1="120" x2="200" y2="150" stroke="#52796F" strokeWidth="2" strokeDasharray="4 6" />
          <line x1="250" y1="120" x2="240" y2="150" stroke="#52796F" strokeWidth="2" strokeDasharray="4 6" />
          <line x1="290" y1="120" x2="280" y2="150" stroke="#52796F" strokeWidth="2" strokeDasharray="4 6" />
          {/* Ground */}
          <path d="M 0 230 Q 250 220 500 230 L 500 300 L 0 300 Z" fill="#29483A" />
          {/* Flower drinking in the rain */}
          <path d="M 250 230 Q 248 180 250 160" stroke="#8EBD78" strokeWidth="6" strokeLinecap="round" />
          <circle cx="250" cy="155" r="16" fill="#F2D69B" />
          <text x="250" y="280" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontFamily="sans-serif">Rest can be part of continuing, not the opposite of it</text>
        </svg>
      );

    // 5. One Stone at a Time
    case 'stone_mist':
    case 'stone_step':
    case 'stone_crossing':
    default:
      return (
        <svg viewBox="0 0 500 300" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="500" height="300" fill="#E9EEE8" />
          {/* Water channel */}
          <rect x="0" y="60" width="500" height="180" fill="#52796F" opacity="0.6" />
          {/* Shore lines */}
          <rect x="0" y="240" width="500" height="60" fill="#C47D57" opacity="0.6" />
          <rect x="0" y="0" width="500" height="60" fill="#747C75" opacity="0.4" />
          {/* Stepping stones */}
          <ellipse cx="250" cy="220" rx="30" ry="16" fill="#DEE2DC" stroke="#24332D" strokeWidth="2" />
          <ellipse cx="270" cy="170" rx="26" ry="14" fill="#DEE2DC" stroke="#24332D" strokeWidth="2" opacity="0.8" />
          <ellipse cx="250" cy="120" rx="24" ry="12" fill="#DEE2DC" stroke="#24332D" strokeWidth="2" opacity="0.6" />
          <ellipse cx="260" cy="75" rx="22" ry="10" fill="#DEE2DC" stroke="#24332D" strokeWidth="2" opacity="0.4" />
          <text x="250" y="280" textAnchor="middle" fill="#252C28" fontSize="13" fontFamily="sans-serif">You don't need to see the entire route to take the first step</text>
        </svg>
      );
  }
};
