export const COLORS = {
  primary: {
    cyan: 'from-cyan-600',
    teal: 'to-teal-600',
    emerald: 'to-emerald-600',
  },
  background: {
    gradient: 'bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50',
    glass: 'backdrop-blur-xl bg-white/80',
    glassDark: 'backdrop-blur-xl bg-white/85',
  },
  borders: {
    glass: 'border border-white/40',
    glassHover: 'hover:border-white/60',
  },
  shadows: {
    primary: 'shadow-2xl',
    hover: 'hover:shadow-blue-500/15',
    cyan: 'hover:shadow-cyan-500/25',
    emerald: 'hover:shadow-emerald-500/30',
  },
} as const;

export const TRANSITIONS = {
  default: 'transition-all duration-300',
  long: 'transition-all duration-500',
  extraLong: 'transition-all duration-700',
} as const;

export const ANIMATIONS = {
  slideInRight: 'animate-in slide-in-from-right duration-700',
  slideOutRight: 'animate-out slide-out-to-right duration-500',
  slideInLeft: 'animate-in slide-in-from-left duration-700',
  slideOutLeft: 'animate-out slide-out-to-left duration-500',
  fadeIn: 'animate-in fade-in duration-500',
  fadeOut: 'animate-out fade-out duration-300',
  scaleIn: 'animate-in zoom-in-95 duration-500',
  scaleOut: 'animate-out zoom-out-95 duration-300',
} as const;

export const SPACING = {
  section: 'space-y-6',
  large: 'space-y-8',
  padding: {
    card: 'p-8',
    section: 'px-4 py-6',
    large: 'p-10',
  },
  margin: {
    bottom: 'mb-6',
    large: 'mb-10',
  },
} as const;

export const LAYOUT = {
  container: 'relative z-10 w-full',
  grid: {
    reviews: 'grid grid-cols-1 lg:grid-cols-3 gap-12',
    center: 'flex justify-center',
  },
  responsive: {
    leftPanel: {
      withReviews: 'lg:col-span-1 scale-95 lg:scale-100',
      withoutReviews: 'w-full max-w-4xl mx-auto scale-100',
    },
    rightPanel: 'lg:col-span-2',
  },
} as const;

export const Z_INDEX = {
  background: 'z-0',
  content: 'z-10',
  floating: 'z-20',
  overlay: 'z-50',
} as const;
