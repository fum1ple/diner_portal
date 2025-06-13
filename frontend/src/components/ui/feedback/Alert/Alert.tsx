import React from 'react';

interface AlertProps {
  type: 'success' | 'danger';
  children: React.ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ type, children, className = '' }) => (
    <div className={`alert alert-${type} ${className}`}>
      {children}
    </div>
  );

export default Alert;
