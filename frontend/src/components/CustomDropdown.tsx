import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  className?: string;
}

const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button<{ $isOpen: boolean; disabled?: boolean }>`
  width: 100%;
  background: white;
  padding: 12px 16px;
  border-radius: 6px;
  margin-top: 15px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid ${props => props.$isOpen ? '#008d97' : 'rgb(209, 213, 219)'};
  font-size: 14px;
  color: rgb(17, 24, 39);
  transition: all 0.2s ease-in-out;
  text-align: left;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:focus {
    outline: none;
    border-color: #008d97;
    box-shadow: 0 0 0 3px rgba(0, 141, 151, 0.1);
  }

  .placeholder {
    color: #999999 !important;
    font-style: italic !important;
    font-weight: 500 !important;
    opacity: 1 !important;
    display: block !important;
    font-family: system-ui, -apple-system, sans-serif !important;
  }

  .arrow {
    transition: transform 0.2s ease-in-out;
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  right: 0;
  left: 0;
  z-index: 50;
  margin-top: 8px;
  width: 100%;
  origin: top;
  border-radius: 6px;
  background: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  max-height: 200px;
  overflow-y: auto;
  
  opacity: ${props => props.$isOpen ? 1 : 0};
  transform: ${props => props.$isOpen ? 'scale(1)' : 'scale(0.95)'};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.1s ease-out;
`;

const DropdownItem = styled.button<{ $isActive?: boolean }>`
  display: block;
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  color: ${props => props.$isActive ? 'rgb(17, 24, 39)' : 'rgb(107, 114, 128)'};
  background: ${props => props.$isActive ? 'rgb(243, 244, 246)' : 'transparent'};
  border: none;
  cursor: pointer;
  transition: all 0.1s ease-in-out;

  &:hover {
    background: rgb(243, 244, 246);
    color: rgb(17, 24, 39);
  }

  &:focus {
    outline: none;
    background: rgb(243, 244, 246);
    color: rgb(17, 24, 39);
  }

  &:first-child {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  &:last-child {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

const ChevronIcon = () => (
  <svg
    className="arrow"
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
);

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <DropdownWrapper ref={dropdownRef} className={className}>
      <DropdownButton
        type="button"
        $isOpen={isOpen}
        disabled={disabled}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup={true}
      >
        <span className={selectedOption ? '' : 'placeholder'} style={{
          color: selectedOption ? 'rgb(17, 24, 39)' : '#999999',
          fontStyle: selectedOption ? 'normal' : 'italic',
          opacity: 1,
          fontSize: '14px',
          fontWeight: selectedOption ? 'normal' : '500',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronIcon />
      </DropdownButton>

      <DropdownMenu $isOpen={isOpen} role="menu" aria-orientation="vertical">
        {options.map(option => (
          <DropdownItem
            key={option.value}
            type="button"
            $isActive={option.value === value}
            onClick={() => handleSelect(option.value)}
            role="menuitem"
          >
            {option.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </DropdownWrapper>
  );
};

export default CustomDropdown;
