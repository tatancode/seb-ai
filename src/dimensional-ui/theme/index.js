// Theme system exports
// This file provides organized exports for the entire theme system

// CSS imports - these will be bundled with the library
import './tokens.css'
import './base.css'
import './utilities.css'

// Theme composable
export { useTheme } from '../composables/useTheme.js'

// Theme constants and utilities
export const THEME_COLORS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  ACCENT_YELLOW: 'accent-yellow',
  ACCENT_PINK: 'accent-pink',
  ACCENT_RED: 'accent-red',
  TEXT: 'text',
  BORDER: 'border'
}

export const SHADOW_SIZES = {
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg',
  DROPDOWN: 'dropdown',
  HOVER: 'hover',
  ACTIVE: 'active'
}

export const SPACING_SIZES = {
  EXTRA_SMALL: 'xs',
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg',
  EXTRA_LARGE: 'xl'
}

export const RADIUS_SIZES = {
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg',
  PILL: 'pill'
}

// Theme utility functions
export const themeUtils = {
  /**
   * Create inline styles for dimensional button effect
   * @param {string} bgColor - Background color token name
   * @param {string} shadowSize - Shadow size token name
   * @returns {object} Style object for Vue components
   */
  createButtonStyles(bgColor, shadowSize = 'md') {
    return {
      backgroundColor: `var(--d-${bgColor})`,
      boxShadow: `var(--d-shadow-${shadowSize})`,
      border: `var(--d-border-width-thick) solid var(--d-border)`,
      borderRadius: 'var(--d-radius-pill)',
      fontWeight: 'var(--d-font-weight-bold)',
      transition: 'box-shadow 0.1s ease-out'
    }
  },

  /**
   * Create inline styles for dimensional card effect
   * @param {string} bgColor - Background color token name
   * @param {string} shadowSize - Shadow size token name
   * @returns {object} Style object for Vue components
   */
  createCardStyles(bgColor = 'bg-secondary', shadowSize = 'md') {
    return {
      backgroundColor: `var(--d-${bgColor})`,
      boxShadow: `var(--d-shadow-${shadowSize})`,
      border: `var(--d-border-width-thick) solid var(--d-border)`,
      borderRadius: 'var(--d-radius-lg)',
      padding: 'var(--d-spacing-md)'
    }
  },

  /**
   * Create hover state styles
   * @param {string} shadowSize - Target shadow size for hover state
   * @returns {object} Style object for hover states
   */
  createHoverStyles(shadowSize = 'hover') {
    return {
      boxShadow: `var(--d-shadow-${shadowSize})`,
      transform: 'translateY(-1px)'
    }
  },

  /**
   * Create active/pressed state styles
   * @returns {object} Style object for active states
   */
  createActiveStyles() {
    return {
      boxShadow: 'var(--d-shadow-active)',
      transform: 'translateY(2px)'
    }
  }
}

// Default theme configuration
export const defaultTheme = {
  colors: {
    primary: '#F9F8F4',
    secondary: '#FFFFFF',
    accentYellow: '#FFF455',
    accentPink: '#FF004D',
    accentRed: '#FF0000',
    text: '#000000',
    border: '#000000'
  },
  shadows: {
    sm: '2px 2px 0px #000000',
    md: '3px 3px 0px #000000',
    lg: '5px 5px 0px #000000',
    dropdown: '4px 4px 0px #000000',
    hover: '2px 2px 0px #000000',
    active: '0px 0px 0px #000000'
  },
  spacing: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px'
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    pill: '999px'
  }
}