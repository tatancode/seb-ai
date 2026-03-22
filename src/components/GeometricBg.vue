<template>
  <div class="geometric-bg" aria-hidden="true">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none">
      <defs>
        <pattern id="geo" x="0" y="0" width="800" height="800" patternUnits="userSpaceOnUse">
          <!-- Angular geometric lines like Internet Pipes -->
          <line x1="0" y1="150" x2="350" y2="0" stroke="#000" stroke-width="1.5" opacity="0.08" />
          <line x1="200" y1="0" x2="800" y2="400" stroke="#000" stroke-width="1.5" opacity="0.08" />
          <line x1="0" y1="500" x2="600" y2="200" stroke="#000" stroke-width="1.5" opacity="0.06" />
          <line x1="400" y1="0" x2="100" y2="800" stroke="#000" stroke-width="1.5" opacity="0.08" />
          <line x1="600" y1="0" x2="800" y2="300" stroke="#000" stroke-width="1.5" opacity="0.06" />
          <line x1="0" y1="700" x2="500" y2="400" stroke="#000" stroke-width="1.5" opacity="0.08" />
          <line x1="700" y1="100" x2="300" y2="800" stroke="#000" stroke-width="1.5" opacity="0.06" />
          <line x1="150" y1="300" x2="800" y2="650" stroke="#000" stroke-width="1.5" opacity="0.08" />
          <line x1="500" y1="500" x2="800" y2="800" stroke="#000" stroke-width="1.5" opacity="0.06" />
          <line x1="0" y1="350" x2="250" y2="800" stroke="#000" stroke-width="1.5" opacity="0.08" />
          <!-- Larger angular shapes -->
          <polyline points="100,200 350,50 500,250" fill="none" stroke="#000" stroke-width="1.5" opacity="0.06" />
          <polyline points="550,400 750,200 800,500" fill="none" stroke="#000" stroke-width="1.5" opacity="0.06" />
          <polyline points="0,600 200,450 400,700" fill="none" stroke="#000" stroke-width="1.5" opacity="0.06" />
          <polyline points="600,600 450,750 700,800" fill="none" stroke="#000" stroke-width="1.5" opacity="0.06" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#geo)" />
    </svg>
  </div>
</template>
