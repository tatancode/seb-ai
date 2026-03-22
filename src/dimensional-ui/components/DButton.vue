<template>
  <button
    ref="buttonRef"
    :class="buttonClasses"
    :style="buttonStyles"
    :disabled="disabled"
    :type="type"
    v-bind="accessibilityAttrs"
    v-on="eventListeners"
    @click="handleClick"
  >
    <span v-if="loading" class="d-button__loading">
      <svg class="d-button__spinner" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416">
          <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
          <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
        </circle>
      </svg>
    </span>
    <span :class="{ 'd-button__content--hidden': loading }">
      <slot />
    </span>
  </button>
</template>

<script>
import { ref, computed, defineComponent } from 'vue'
import { useInteractiveStates } from '../composables/useInteractiveStates.js'
import { useTheme } from '../composables/useTheme.js'

export default defineComponent({
  name: 'DButton',
  props: {
    /**
     * Button variant - determines color scheme
     */
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'accent-yellow', 'accent-pink'].includes(value)
    },
    
    /**
     * Button size - affects padding and font size
     */
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    
    /**
     * Disabled state
     */
    disabled: {
      type: Boolean,
      default: false
    },
    
    /**
     * Loading state - shows spinner and disables interaction
     */
    loading: {
      type: Boolean,
      default: false
    },
    
    /**
     * Full width button
     */
    fullWidth: {
      type: Boolean,
      default: false
    },
    
    /**
     * Button type attribute
     */
    type: {
      type: String,
      default: 'button',
      validator: (value) => ['button', 'submit', 'reset'].includes(value)
    }
  },
  
  emits: ['click'],
  
  setup(props, { emit }) {
    const buttonRef = ref(null)
    const { prefersReducedMotion } = useTheme()
    
    // Interactive states with shadow effects
    const {
      stickerStyles,
      interactiveClasses,
      eventListeners,
      accessibilityAttrs
    } = useInteractiveStates({
      shadowSize: props.size === 'lg' ? 'lg' : 'md',
      disabled: computed(() => props.disabled || props.loading),
      trackFocus: true,
      trackHover: true,
      trackActive: true
    })
    
    /**
     * Generate button classes based on props and state
     */
    const buttonClasses = computed(() => {
      const classes = [
        'd-button',
        `d-button--${props.variant}`,
        `d-button--${props.size}`,
        ...interactiveClasses.value
      ]
      
      if (props.disabled) classes.push('d-button--disabled')
      if (props.loading) classes.push('d-button--loading')
      if (props.fullWidth) classes.push('d-button--full-width')
      
      return classes
    })
    
    /**
     * Generate button styles combining sticker effects
     */
    const buttonStyles = computed(() => {
      return {
        ...stickerStyles.value
      }
    })
    
    /**
     * Handle click events
     */
    const handleClick = (event) => {
      if (props.disabled || props.loading) {
        event.preventDefault()
        return
      }
      
      emit('click', event)
    }
    
    return {
      buttonRef,
      buttonClasses,
      buttonStyles,
      eventListeners,
      accessibilityAttrs,
      handleClick
    }
  }
})
</script>

<style scoped>
.d-button {
  /* Base button styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  /* Typography */
  font-family: var(--d-font-family);
  font-weight: var(--d-font-weight-bold);
  text-align: center;
  text-decoration: none;
  line-height: 1;
  
  /* Layout */
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-pill);
  cursor: pointer;
  user-select: none;
  
  /* Transitions */
  transition: all 0.15s ease-out;
  
  /* Remove default button styles */
  background: none;
  outline: none;
  
  /* Prevent text selection */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Size variations */
.d-button--sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  min-height: 2rem;
}

.d-button--md {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  min-height: 2.5rem;
}

.d-button--lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  min-height: 3rem;
}

/* Variant styles */
.d-button--primary {
  background-color: var(--d-accent-pink);
  color: var(--d-bg-secondary);
}

.d-button--secondary {
  background-color: var(--d-bg-secondary);
  color: var(--d-text-primary);
}

.d-button--accent-yellow {
  background-color: var(--d-accent-yellow);
  color: var(--d-text-primary);
}

.d-button--accent-pink {
  background-color: var(--d-accent-pink);
  color: var(--d-bg-secondary);
}

/* Interactive state styles */
.d-button.d-hovered:not(.d-button--disabled):not(.d-button--loading) {
  transform: translateY(-1px);
}

.d-button.d-pressed:not(.d-button--disabled):not(.d-button--loading) {
  transform: translate(2px, 2px);
}

/* Hover color adjustments */
.d-button--primary.d-hovered:not(.d-button--disabled):not(.d-button--loading) {
  background-color: #E6003D; /* Slightly darker pink */
}

.d-button--secondary.d-hovered:not(.d-button--disabled):not(.d-button--loading) {
  background-color: #F5F5F5; /* Slightly darker white */
}

.d-button--accent-yellow.d-hovered:not(.d-button--disabled):not(.d-button--loading) {
  background-color: #F0E84D; /* Slightly darker yellow */
}

.d-button--accent-pink.d-hovered:not(.d-button--disabled):not(.d-button--loading) {
  background-color: #E6003D; /* Slightly darker pink */
}

/* Pressed color adjustments */
.d-button.d-pressed:not(.d-button--disabled):not(.d-button--loading) {
  box-shadow: none !important;
}

.d-button--primary.d-pressed:not(.d-button--disabled):not(.d-button--loading) {
  background-color: #CC0036; /* Even darker pink */
}

.d-button--secondary.d-pressed:not(.d-button--disabled):not(.d-button--loading) {
  background-color: #E8E8E8; /* Even darker white */
}

.d-button--accent-yellow.d-pressed:not(.d-button--disabled):not(.d-button--loading) {
  background-color: #E8DC45; /* Even darker yellow */
}

.d-button--accent-pink.d-pressed:not(.d-button--disabled):not(.d-button--loading) {
  background-color: #CC0036; /* Even darker pink */
}

/* Disabled state */
.d-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none !important;
  transform: none !important;
}

/* Loading state */
.d-button--loading {
  cursor: wait;
  position: relative;
}

.d-button__loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.d-button__spinner {
  width: 1em;
  height: 1em;
  animation: spin 1s linear infinite;
}

.d-button__content--hidden {
  opacity: 0;
}

/* Full width */
.d-button--full-width {
  width: 100%;
}

/* Focus styles for accessibility */
.d-button:focus-visible {
  outline: var(--d-border-width-thick) solid var(--d-text-primary);
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .d-button {
    transition: none;
  }
  
  .d-button__spinner {
    animation: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .d-button {
    border-width: 3px;
  }
}

/* Spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>