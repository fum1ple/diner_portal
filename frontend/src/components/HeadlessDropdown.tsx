import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import styled from 'styled-components';

interface DropdownOption {
  value: string;
  label: string;
}

interface HeadlessDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  className?: string;
}

const StyledMenuWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const StyledMenuButton = styled(MenuButton)<{ $hasValue: boolean; disabled?: boolean }>`
  width: 100%;
  background: white;
  padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid rgb(209, 213, 219);
  font-size: 14px;
  color: ${props => props.$hasValue ? 'rgb(17, 24, 39)' : 'rgb(156, 163, 175)'};
  transition: all 0.2s ease-in-out;
  text-align: left;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  font-style: ${props => props.$hasValue ? 'normal' : 'italic'};
  font-weight: ${props => props.$hasValue ? 'normal' : '500'};

  &:focus {
    outline: none;
    border-color: #008d97;
    box-shadow: 0 0 0 3px rgba(0, 141, 151, 0.1);
  }

  &:hover:not(:disabled) {
    border-color: #008d97;
  }
`;

const StyledMenuItems = styled(MenuItems)`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 50;
  margin-top: 8px;
  width: 100%;
  border-radius: 6px;
  background: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  max-height: 200px;
  overflow-y: auto;
  
  /* HeadlessUI transition styles */
  transition: all 150ms ease-out;
  transform-origin: top;
  
  &[data-closed] {
    opacity: 0;
    transform: scale(0.95);
  }
  
  &[data-enter] {
    transition: all 100ms ease-out;
  }
  
  &[data-leave] {
    transition: all 75ms ease-in;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  display: block;
  width: 100%;
`;

const MenuItemButton = styled.button<{ $isActive?: boolean }>`
  display: block;
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  color: rgb(107, 114, 128);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.1s ease-in-out;

  &[data-focus] {
    background: rgb(243, 244, 246);
    color: rgb(17, 24, 39);
    outline: none;
  }

  &:first-child {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  &:last-child {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  ${props => props.$isActive && `
    background: rgb(243, 244, 246);
    color: rgb(17, 24, 39);
    font-weight: 500;
  `}
`;



const HeadlessDropdown: React.FC<HeadlessDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  className = ""
}) => {
  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
  };

  return (
    <StyledMenuWrapper className={className}>
      <Menu as="div">
        {() => (
          <>
            <StyledMenuButton
              $hasValue={!!selectedOption}
              disabled={disabled}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </StyledMenuButton>

            <StyledMenuItems>
              {options.map(option => (
                <StyledMenuItem key={option.value}>
                  <MenuItemButton
                    $isActive={option.value === value}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </MenuItemButton>
                </StyledMenuItem>
              ))}
            </StyledMenuItems>
          </>
        )}
      </Menu>
    </StyledMenuWrapper>
  );
};

export default HeadlessDropdown;
