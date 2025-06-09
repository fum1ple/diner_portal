import React from 'react';

const BackgroundDecorations: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
    <div 
      className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse" 
      style={{animationDelay: '1s'}}
    ></div>
    <div 
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" 
      style={{animationDelay: '2s'}}
    ></div>
  </div>
);

export default BackgroundDecorations;
