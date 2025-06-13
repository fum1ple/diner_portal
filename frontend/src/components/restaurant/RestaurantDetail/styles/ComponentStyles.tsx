import React from 'react';
import { keyframes, scrollbarStyles } from './animations';

const ComponentStyles: React.FC = () => (
  <style jsx>{`
    ${keyframes}
    ${scrollbarStyles}
    
    .animate-in {
      animation: slideInFromRight 0.7s ease-out;
    }
    
    .floating {
      animation: float 6s ease-in-out infinite;
    }
    
    .gradient-border-animate {
      animation: gradient-border 3s ease-in-out infinite;
    }
  `}</style>
);

export default ComponentStyles;
