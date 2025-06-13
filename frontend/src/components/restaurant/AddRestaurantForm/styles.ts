import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: ${theme.spacing.xxxxl} ${theme.spacing.xl};

  .container {
    max-width: ${theme.sizes.formMaxWidth};
    background: ${theme.colors.background.main};
    background: ${theme.colors.background.card};
    border-radius: ${theme.borderRadius.xl};
    padding: ${theme.spacing.xxxl} ${theme.spacing.xxxxl};
    border: 5px solid ${theme.colors.background.white};
    box-shadow: ${theme.shadows.primary};
    margin: ${theme.spacing.xl};
  }

  .heading {
    text-align: center;
    font-weight: 900;
    font-size: 30px;
    color: ${theme.colors.primary};
    margin-bottom: ${theme.spacing.xxl};
  }

  .form {
    margin-top: ${theme.spacing.xl};
  }

  .form .field-group {
    margin-top: ${theme.spacing.xl};

    &:first-child {
      margin-top: 0;
    }
  }

  .form .field-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.text.label};
    margin-bottom: ${theme.spacing.sm};
  }

  .form .required-mark {
    color: ${theme.colors.text.required};
    margin-left: ${theme.spacing.xs};
  }

  .form .input {
    width: 100%;
    background: ${theme.colors.background.white};
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.sm};
    box-shadow: ${theme.shadows.sm};
    border: 1px solid ${theme.colors.border.default};
    font-size: 14px;
    color: ${theme.colors.text.primary};
    transition: ${theme.transitions.normal};

    &::-moz-placeholder,
    &::placeholder {
      color: ${theme.colors.text.placeholder};
    }

    &:focus {
      outline: none;
      border-color: ${theme.colors.border.focus};
      box-shadow: ${theme.shadows.focus};
    }
  }

  .form .submit-button {
    display: block;
    width: 100%;
    font-weight: bold;
    background: linear-gradient(45deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%);
    color: ${theme.colors.background.white};
    padding-block: 15px;
    margin: ${theme.spacing.xxl} auto 0;
    border-radius: ${theme.borderRadius.lg};
    box-shadow: ${theme.shadows.primaryButton};
    border: none;
    transition: ${theme.transitions.normal};
    font-size: 16px;
    cursor: pointer;

    &:hover:not(:disabled) {
      transform: scale(1.03);
      box-shadow: rgba(0, 141, 151, 0.5) 0px 23px 10px -20px;
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
      box-shadow: rgba(0, 141, 151, 0.6) 0px 15px 10px -10px;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .alert {
    padding: ${theme.spacing.md} ${theme.spacing.xl};
    border-radius: ${theme.borderRadius.md};
    margin-bottom: ${theme.spacing.xl};
    border: none;
    font-size: 14px;

    &.alert-success {
      background: linear-gradient(45deg, ${theme.colors.success} 0%, ${theme.colors.successLight} 100%);
      color: ${theme.colors.background.white};
      box-shadow: ${theme.shadows.success};
    }

    &.alert-danger {
      background: linear-gradient(45deg, ${theme.colors.error} 0%, ${theme.colors.errorLight} 100%);
      color: ${theme.colors.background.white};
      box-shadow: ${theme.shadows.error};
    }
  }
`;
