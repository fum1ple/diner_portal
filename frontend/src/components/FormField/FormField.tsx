import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  required = false, 
  children, 
  className = '' 
}) => (
    <div className={`field-group ${className}`}>
      <label className="field-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      {children}
    </div>
  );

export default FormField;
