import { computed, ref } from 'vue'

/**
 * Composable for accessing and managing theme tokens
 * Provides utilities for working with CSS custom properties and theme values
 */
export function useTheme() {
  // Reactive theme mode (for future dark mode support)
  const themeMode = ref('light')

  /**
   * Get a CSS custom property value
   * @param {string} tokenName - The token name (without -- prefix)
   * @returns {string} The CSS custom property value
   */
  const getToken = (tokenName) => {
    if (typeof window === 'undefined') return ''
    
    const propertyName = tokenName.startsWith('--') ? tokenName : `--d-${tokenName}`
    const value = getComputedStyle(document.documentElement).getPropertyValue(propertyName).trim()
    
    if (!value) {
      console.warn(`Theme token "${propertyName}" not found`)
      return ''
    }
    
    return value
  }

  /**
   * Set a CSS custom property value
   * @param {string} tokenName - The token name (without -- prefix)
   * @param {string} value - The new value
   */
  const setToken = (tokenName, value) => {
    if (typeof window === 'undefined') return
    
    const propertyName = tokenName.startsWith('--') ? tokenName : `--d-${tokenName}`
    document.documentElement.style.setProperty(propertyName, value)
  }

  /**
   * Generate shadow class name based on size
   * @param {string} size - Shadow size ('sm', 'md', 'lg', 'hover', 'active')
   * @returns {string} CSS class name
   */
  const generateShadowClass = (size) => {
    const validSizes = ['sm', 'md', 'lg', 'hover', 'active']
    if (!validSizes.includes(size)) {
      console.warn(`Invalid shadow size "${size}". Valid sizes: ${validSizes.join(', ')}`)
      return 'd-shadow-md'
    }
    return `d-shadow-${size}`
  }

  /**
   * Generate color class name
   * @param {string} color - Color name ('primary', 'secondary', 'accent-yellow', etc.)
   * @param {string} variant - Color variant ('bg', 'text', 'border')
   * @returns {string} CSS class name or inline style
   */
  const generateColorClass = (color, variant = 'bg') => {
    const colorMap = {
      primary: 'var(--d-bg-primary)',
      secondary: 'var(--d-bg-secondary)',
      'accent-yellow': 'var(--d-accent-yellow)',
      'accent-pink': 'var(--d-accent-pink)',
      'accent-red': 'var(--d-accent-red)',
      text: 'var(--d-text-primary)',
      border: 'var(--d-border)'
    }

    const colorValue = colorMap[color]
    if (!colorValue) {
      console.warn(`Unknown color "${color}"`)
      return ''
    }

    const property = variant === 'bg' ? 'background-color' : 
                    variant === 'text' ? 'color' : 
                    variant === 'border' ? 'border-color' : 'background-color'

    return `${property}: ${colorValue}`
  }

  /**
   * Get spacing value
   * @param {string} size - Spacing size ('xs', 'sm', 'md', 'lg', 'xl')
   * @returns {string} CSS spacing value
   */
  const getSpacing = (size) => {
    return getToken(`spacing-${size}`)
  }

  /**
   * Get border radius value
   * @param {string} size - Radius size ('sm', 'md', 'lg', 'pill')
   * @returns {string} CSS border-radius value
   */
  const getRadius = (size) => {
    return getToken(`radius-${size}`)
  }

  /**
   * Get shadow value
   * @param {string} size - Shadow size ('sm', 'md', 'lg', 'dropdown', 'hover', 'active')
   * @returns {string} CSS box-shadow value
   */
  const getShadow = (size) => {
    return getToken(`shadow-${size}`)
  }

  /**
   * Check if user prefers reduced motion
   * @returns {boolean} True if user prefers reduced motion
   */
  const prefersReducedMotion = computed(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  /**
   * Check if user prefers high contrast
   * @returns {boolean} True if user prefers high contrast
   */
  const prefersHighContrast = computed(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-contrast: high)').matches
  })

  /**
   * Set theme mode (for future dark mode support)
   * @param {string} mode - Theme mode ('light' or 'dark')
   */
  const setThemeMode = (mode) => {
    themeMode.value = mode
    // Future implementation for dark mode token switching
  }

  /**
   * Get all available theme tokens
   * @returns {object} Object containing all theme token categories
   */
  const getAllTokens = () => {
    return {
      colors: {
        primary: getToken('bg-primary'),
        secondary: getToken('bg-secondary'),
        accentYellow: getToken('accent-yellow'),
        accentPink: getToken('accent-pink'),
        accentRed: getToken('accent-red'),
        text: getToken('text-primary'),
        border: getToken('border')
      },
      shadows: {
        sm: getToken('shadow-sm'),
        md: getToken('shadow-md'),
        lg: getToken('shadow-lg'),
        dropdown: getToken('shadow-dropdown'),
        hover: getToken('shadow-hover'),
        active: getToken('shadow-active')
      },
      spacing: {
        xs: getToken('spacing-xs'),
        sm: getToken('spacing-sm'),
        md: getToken('spacing-md'),
        lg: getToken('spacing-lg'),
        xl: getToken('spacing-xl')
      },
      radius: {
        sm: getToken('radius-sm'),
        md: getToken('radius-md'),
        lg: getToken('radius-lg'),
        pill: getToken('radius-pill')
      }
    }
  }

  return {
    // State
    themeMode: computed(() => themeMode.value),
    prefersReducedMotion,
    prefersHighContrast,
    
    // Token access
    getToken,
    setToken,
    getAllTokens,
    
    // Utilities
    generateShadowClass,
    generateColorClass,
    getSpacing,
    getRadius,
    getShadow,
    
    // Theme management
    setThemeMode
  }
}