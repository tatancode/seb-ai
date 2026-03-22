import { ref, computed } from 'vue'
import { useTheme } from './useTheme.js'

/**
 * Composable for managing shadow effects and transitions
 * Provides utilities for dynamic shadow manipulation and sticker-like effects
 */
export function useShadowEffects() {
  const { getShadow, prefersReducedMotion } = useTheme()
  
  // Current shadow state
  const currentShadowSize = ref('md')
  const isTransitioning = ref(false)
  
  /**
   * Get shadow value for current state
   * @returns {string} CSS box-shadow value
   */
  const currentShadow = computed(() => {
    return getShadow(currentShadowSize.value)
  })
  
  /**
   * Generate dynamic shadow based on interaction state
   * @param {string} baseSize - Base shadow size ('sm', 'md', 'lg')
   * @param {object} state - Interaction state object
   * @returns {string} CSS box-shadow value
   */
  const getDynamicShadow = (baseSize = 'md', state = {}) => {
    const { isHovered = false, isPressed = false, isActive = false } = state
    
    // Pressed state removes shadow (sticker pressed down)
    if (isPressed) {
      return 'none'
    }
    
    // Hovered state reduces shadow (sticker lifting up)
    if (isHovered && !isActive) {
      const hoverSize = baseSize === 'lg' ? 'md' : 'sm'
      return getShadow(hoverSize)
    }
    
    // Active state uses consistent shadow
    if (isActive) {
      return getShadow(baseSize)
    }
    
    // Default state
    return getShadow(baseSize)
  }
  
  /**
   * Generate shadow CSS class based on interaction state
   * @param {string} baseSize - Base shadow size
   * @param {object} state - Interaction state object
   * @returns {string} CSS class name
   */
  const getShadowClass = (baseSize = 'md', state = {}) => {
    const { isHovered = false, isPressed = false, isActive = false } = state
    
    if (isPressed) {
      return 'd-shadow-none'
    }
    
    if (isHovered && !isActive) {
      const hoverSize = baseSize === 'lg' ? 'md' : 'sm'
      return `d-shadow-${hoverSize}`
    }
    
    if (isActive) {
      return `d-shadow-${baseSize}`
    }
    
    return `d-shadow-${baseSize}`
  }
  
  /**
   * Generate inline shadow styles for dynamic use
   * @param {string} baseSize - Base shadow size
   * @param {object} state - Interaction state object
   * @returns {object} CSS style object
   */
  const getShadowStyles = (baseSize = 'md', state = {}) => {
    const shadowValue = getDynamicShadow(baseSize, state)
    
    const styles = {
      boxShadow: shadowValue,
    }
    
    // Add transition if motion is not reduced
    if (!prefersReducedMotion.value) {
      styles.transition = 'box-shadow 0.15s ease-out, transform 0.15s ease-out'
    }
    
    // Add subtle transform for pressed state
    if (state.isPressed) {
      styles.transform = 'translate(2px, 2px)'
    }
    
    return styles
  }
  
  /**
   * Create shadow offset values for manual positioning
   * @param {string} size - Shadow size
   * @returns {object} Offset values {x, y}
   */
  const getShadowOffset = (size = 'md') => {
    const offsetMap = {
      sm: { x: 2, y: 2 },
      md: { x: 3, y: 3 },
      lg: { x: 5, y: 5 },
      dropdown: { x: 4, y: 4 },
      hover: { x: 2, y: 2 },
      active: { x: 3, y: 3 }
    }
    
    return offsetMap[size] || offsetMap.md
  }
  
  /**
   * Generate shadow for dropdown positioning
   * @param {string} direction - Dropdown direction ('down', 'up', 'left', 'right')
   * @returns {string} CSS box-shadow value
   */
  const getDropdownShadow = (direction = 'down') => {
    const baseShadow = getShadow('dropdown')
    
    // Adjust shadow direction based on dropdown position
    const directionMap = {
      down: baseShadow,
      up: baseShadow.replace(/(\d+)px\s+(\d+)px/, '$1px -$2px'),
      left: baseShadow.replace(/(\d+)px\s+(\d+)px/, '-$1px $2px'),
      right: baseShadow
    }
    
    return directionMap[direction] || baseShadow
  }
  
  /**
   * Animate shadow transition
   * @param {string} fromSize - Starting shadow size
   * @param {string} toSize - Target shadow size
   * @param {number} duration - Animation duration in ms
   */
  const animateShadow = (fromSize, toSize, duration = 150) => {
    if (prefersReducedMotion.value) {
      currentShadowSize.value = toSize
      return
    }
    
    isTransitioning.value = true
    currentShadowSize.value = fromSize
    
    setTimeout(() => {
      currentShadowSize.value = toSize
      setTimeout(() => {
        isTransitioning.value = false
      }, duration)
    }, 16) // Next frame
  }
  
  /**
   * Generate CSS variables for shadow values
   * @returns {object} CSS custom properties object
   */
  const getShadowVariables = () => {
    return {
      '--shadow-sm': getShadow('sm'),
      '--shadow-md': getShadow('md'),
      '--shadow-lg': getShadow('lg'),
      '--shadow-dropdown': getShadow('dropdown'),
      '--shadow-hover': getShadow('hover'),
      '--shadow-active': getShadow('active'),
      '--shadow-none': 'none'
    }
  }
  
  /**
   * Create sticker-like shadow effect utilities
   * @returns {object} Utility functions for sticker effects
   */
  const createStickerEffects = () => {
    return {
      // Sticker at rest
      rest: (size = 'md') => getShadowStyles(size, {}),
      
      // Sticker being hovered (lifting up)
      hover: (size = 'md') => getShadowStyles(size, { isHovered: true }),
      
      // Sticker being pressed (pushed down)
      pressed: (size = 'md') => getShadowStyles(size, { isPressed: true }),
      
      // Sticker in active state
      active: (size = 'md') => getShadowStyles(size, { isActive: true })
    }
  }
  
  return {
    // State
    currentShadowSize: computed(() => currentShadowSize.value),
    currentShadow,
    isTransitioning: computed(() => isTransitioning.value),
    
    // Dynamic shadow generation
    getDynamicShadow,
    getShadowClass,
    getShadowStyles,
    
    // Utilities
    getShadowOffset,
    getDropdownShadow,
    getShadowVariables,
    
    // Animation
    animateShadow,
    
    // Sticker effects
    createStickerEffects
  }
}