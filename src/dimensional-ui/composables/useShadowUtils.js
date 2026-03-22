import { useTheme } from './useTheme.js'

/**
 * Utility functions for generating shadow classes and styles dynamically
 * Provides helper functions for creating consistent shadow effects
 */
export function useShadowUtils() {
  const { getShadow, getToken } = useTheme()
  
  /**
   * Generate CSS class names for shadow utilities
   * @returns {object} Object containing CSS class definitions
   */
  const generateShadowClasses = () => {
    return {
      '.d-shadow-none': {
        'box-shadow': 'none'
      },
      '.d-shadow-sm': {
        'box-shadow': 'var(--d-shadow-sm)'
      },
      '.d-shadow-md': {
        'box-shadow': 'var(--d-shadow-md)'
      },
      '.d-shadow-lg': {
        'box-shadow': 'var(--d-shadow-lg)'
      },
      '.d-shadow-dropdown': {
        'box-shadow': 'var(--d-shadow-dropdown)'
      },
      '.d-shadow-hover': {
        'box-shadow': 'var(--d-shadow-hover)'
      },
      '.d-shadow-active': {
        'box-shadow': 'var(--d-shadow-active)'
      }
    }
  }
  
  /**
   * Generate interactive state classes
   * @returns {object} Object containing interactive CSS class definitions
   */
  const generateInteractiveClasses = () => {
    return {
      '.d-interactive': {
        'transition': 'box-shadow 0.15s ease-out, transform 0.15s ease-out',
        'cursor': 'pointer'
      },
      '.d-interactive:hover': {
        'box-shadow': 'var(--d-shadow-hover)'
      },
      '.d-interactive:active': {
        'box-shadow': 'var(--d-shadow-none)',
        'transform': 'translate(2px, 2px)'
      },
      '.d-interactive:focus-visible': {
        'outline': '2px solid var(--d-accent-yellow)',
        'outline-offset': '2px'
      },
      '.d-interactive.d-disabled': {
        'opacity': '0.6',
        'cursor': 'not-allowed',
        'pointer-events': 'none'
      }
    }
  }
  
  /**
   * Generate sticker-style component classes
   * @returns {object} Object containing sticker CSS class definitions
   */
  const generateStickerClasses = () => {
    return {
      '.d-sticker': {
        'border-radius': 'var(--d-radius-md)',
        'border': '2px solid var(--d-border)',
        'box-shadow': 'var(--d-shadow-md)',
        'transition': 'box-shadow 0.15s ease-out, transform 0.15s ease-out',
        'cursor': 'pointer',
        'user-select': 'none'
      },
      '.d-sticker:hover': {
        'box-shadow': 'var(--d-shadow-hover)'
      },
      '.d-sticker:active': {
        'box-shadow': 'var(--d-shadow-none)',
        'transform': 'translate(2px, 2px)'
      },
      '.d-sticker.d-pressed': {
        'box-shadow': 'var(--d-shadow-none)',
        'transform': 'translate(2px, 2px)'
      },
      '.d-sticker.d-active': {
        'box-shadow': 'var(--d-shadow-active)'
      }
    }
  }
  
  /**
   * Generate button variant classes
   * @returns {object} Object containing button CSS class definitions
   */
  const generateButtonClasses = () => {
    return {
      '.d-btn': {
        'display': 'inline-flex',
        'align-items': 'center',
        'justify-content': 'center',
        'padding': 'var(--d-spacing-sm) var(--d-spacing-md)',
        'border': '2px solid var(--d-border)',
        'border-radius': 'var(--d-radius-pill)',
        'font-family': 'var(--d-font-family)',
        'font-weight': 'var(--d-font-weight-bold)',
        'text-decoration': 'none',
        'box-shadow': 'var(--d-shadow-md)',
        'transition': 'box-shadow 0.15s ease-out, transform 0.15s ease-out',
        'cursor': 'pointer',
        'user-select': 'none'
      },
      '.d-btn:hover': {
        'box-shadow': 'var(--d-shadow-hover)'
      },
      '.d-btn:active': {
        'box-shadow': 'var(--d-shadow-none)',
        'transform': 'translate(2px, 2px)'
      },
      '.d-btn:focus-visible': {
        'outline': '2px solid var(--d-accent-yellow)',
        'outline-offset': '2px'
      },
      '.d-btn-primary': {
        'background-color': 'var(--d-accent-pink)',
        'color': 'white'
      },
      '.d-btn-secondary': {
        'background-color': 'var(--d-bg-secondary)',
        'color': 'var(--d-text-primary)'
      },
      '.d-btn-accent': {
        'background-color': 'var(--d-accent-yellow)',
        'color': 'var(--d-text-primary)'
      }
    }
  }
  
  /**
   * Generate all utility classes as CSS string
   * @returns {string} Complete CSS string with all utility classes
   */
  const generateUtilityCSS = () => {
    const shadowClasses = generateShadowClasses()
    const interactiveClasses = generateInteractiveClasses()
    const stickerClasses = generateStickerClasses()
    const buttonClasses = generateButtonClasses()
    
    const allClasses = {
      ...shadowClasses,
      ...interactiveClasses,
      ...stickerClasses,
      ...buttonClasses
    }
    
    let css = ''
    for (const [selector, rules] of Object.entries(allClasses)) {
      css += `${selector} {\n`
      for (const [property, value] of Object.entries(rules)) {
        css += `  ${property}: ${value};\n`
      }
      css += '}\n\n'
    }
    
    return css
  }
  
  /**
   * Create custom shadow with specific offset and color
   * @param {number} offsetX - Horizontal offset in pixels
   * @param {number} offsetY - Vertical offset in pixels
   * @param {string} color - Shadow color (defaults to black)
   * @returns {string} CSS box-shadow value
   */
  const createCustomShadow = (offsetX = 3, offsetY = 3, color = '#000000') => {
    return `${offsetX}px ${offsetY}px 0px ${color}`
  }
  
  /**
   * Create shadow with multiple layers for depth effect
   * @param {Array} layers - Array of shadow layer objects {x, y, color, opacity}
   * @returns {string} CSS box-shadow value with multiple shadows
   */
  const createLayeredShadow = (layers = []) => {
    if (layers.length === 0) {
      return getShadow('md')
    }
    
    return layers
      .map(layer => {
        const { x = 3, y = 3, color = '#000000', opacity = 1 } = layer
        const shadowColor = opacity < 1 ? `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}` : color
        return `${x}px ${y}px 0px ${shadowColor}`
      })
      .join(', ')
  }
  
  /**
   * Get shadow configuration for different component types
   * @param {string} componentType - Type of component ('button', 'card', 'dropdown', 'navbar')
   * @returns {object} Shadow configuration object
   */
  const getComponentShadowConfig = (componentType) => {
    const configs = {
      button: {
        rest: 'md',
        hover: 'hover',
        active: 'none',
        pressed: 'none'
      },
      card: {
        rest: 'lg',
        hover: 'md',
        active: 'lg',
        pressed: 'md'
      },
      dropdown: {
        rest: 'dropdown',
        hover: 'dropdown',
        active: 'dropdown',
        pressed: 'dropdown'
      },
      navbar: {
        rest: 'none',
        hover: 'sm',
        active: 'md',
        pressed: 'sm'
      }
    }
    
    return configs[componentType] || configs.button
  }
  
  return {
    // Class generators
    generateShadowClasses,
    generateInteractiveClasses,
    generateStickerClasses,
    generateButtonClasses,
    generateUtilityCSS,
    
    // Custom shadow creators
    createCustomShadow,
    createLayeredShadow,
    
    // Component configurations
    getComponentShadowConfig
  }
}