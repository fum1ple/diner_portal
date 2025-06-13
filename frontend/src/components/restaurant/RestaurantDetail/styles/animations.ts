export const keyframes = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(40px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @keyframes slideInFromRight {
    from {
      opacity: 0;
      transform: translateX(100px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  @keyframes gradient-border {
    0%, 100% {
      border-image: linear-gradient(45deg, #0891b2, #14b8a6, #059669) 1;
    }
    50% {
      border-image: linear-gradient(45deg, #059669, #0891b2, #14b8a6) 1;
    }
  }
`;

export const scrollbarStyles = `
  .scrollbar-thin::-webkit-scrollbar {
    width: 8px;
  }
  
  .scrollbar-thumb-cyan-300::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #67e8f9, #22d3ee);
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .scrollbar-thumb-cyan-300::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #22d3ee, #0891b2);
  }
  
  .scrollbar-track-transparent::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

export const animationClasses = {
  fadeInUp: 'fadeInUp 0.6s ease-out forwards',
  slideInFromRight: 'slideInFromRight 0.7s ease-out',
  float: 'float 6s ease-in-out infinite',
  gradientBorder: 'gradient-border 3s ease-in-out infinite',
} as const;
