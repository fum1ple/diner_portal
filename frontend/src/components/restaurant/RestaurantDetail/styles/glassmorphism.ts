export const glassmorphismCard = `
  backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/40 
  hover:shadow-blue-500/15 transition-all duration-500 hover:bg-white/90 hover:border-white/60
`;

export const glassmorphismCardDark = `
  backdrop-blur-xl bg-white/85 rounded-3xl shadow-2xl border border-white/40 
  hover:bg-white/90 hover:border-white/60 transition-all duration-500
`;

export const glassmorphismButton = `
  group/btn w-full relative overflow-hidden 
  text-white font-bold py-5 px-8 rounded-2xl 
  transition-all duration-300 transform hover:scale-105 active:scale-95
`;

export const glassmorphismFloatingButton = `
  group relative p-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-full 
  shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-110 
  backdrop-blur-md border border-white/20
`;

export const gradientOverlay = `
  absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-teal-500/5 to-emerald-500/5 
  rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
`;

export const buttonShineEffect = `
  absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
  -skew-x-12 translate-x-[-200%] group-hover/btn:translate-x-[200%] 
  transition-transform duration-700
`;

export const buttonGradientOverlay = (colors: string) => `
  absolute inset-0 bg-gradient-to-r ${colors} rounded-2xl opacity-0 
  group-hover/btn:opacity-100 transition-opacity duration-300
`;

export const decorativeElements = `
  absolute inset-0 overflow-hidden pointer-events-none
`;

export const decorativeCircle = (position: string, size: string, colors: string, delay?: string) => `
  absolute ${position} ${size} bg-gradient-to-r ${colors} rounded-full blur-3xl animate-pulse
  ${delay ? `[animation-delay:${delay}]` : ''}
`;
