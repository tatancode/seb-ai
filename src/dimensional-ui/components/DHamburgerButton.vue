<template>
  <button
    ref="buttonRef"
    :class="buttonClasses"
    :style="buttonStyles"
    :disabled="disabled"
    :aria-label="ariaLabel"
    :aria-expanded="isOpen"
    @click="handleClick"
    v-on="eventListeners"
  >
    <span class="d-hamburger-button__lines">
      <span class="d-hamburger-button__line d-hamburger-button__line--top"></span>
      <span class="d-hamburger-button__line d-hamburger-button__line--middle"></span>
      <span class="d-hamburger-button__line d-hamburger-button__line--bottom"></span>
    </span>
  </button>
</template>

<script>
import { ref, computed, defineComponent } from 'vue'
import { useInteractiveStates } from '../composables/useInteractiveStates.js'

export default defineComponent({
  name: 'DHamburgerButton',
  props: {
    /**
     * Whether the menu is open (for animation state)
     */
    isOpen: {
      type: Boolean,
      default: false
    },
    
    /**
     * Button size
     */
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    
    /**
     * Whether the button is disabled
     */
    disabled: {
      type: Boolean,
      default: false
    },
    
    /**
     * ARIA label for accessibility
     */
    ariaLabel: {
      type: String,
      default: 'Toggle navigation menu'
    }
  },
  
  emits: ['click'],
  
  setup(props, { emit }) {
    const buttonRef = ref(null)
    
    // Interactive states for sticker effect
    const {
      stickerStyles,
      interactiveClasses,
      eventListeners
    } = useInteractiveStates({
      shadowSize: 'sm',
      disabled: computed(() => props.disabled),
      trackFocus: true,
      trackHover: true,
      trackActive: true
    })
    
    /**
     * Generate button classes
     */
    const buttonClasses = computed(() => {
      const classes = [
        'd-hamburger-button',
        `d-hamburger-button--${props.size}`,
        ...interactiveClasses.value
      ]
      
      if (props.isOpen) classes.push('d-hamburger-button--open')
      if (props.disabled) classes.push('d-hamburger-button--disabled')
      
      return classes
    })
    
    /**
     * Generate button styles
     */
    const buttonStyles = computed(() => {
      return {
        ...stickerStyles.value
      }
    })
    
    /**
     * Handle button click
     */
    const handleClick = (event) => {
      if (props.disabled) return
      emit('click', event)
    }
    
    return {
      buttonRef,
      buttonClasses,
      buttonStyles,
      eventListeners,
      handleClick
    }
  }
})
</script>

<style scoped>
.d-hamburger-button {
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  /* Sizing */
  width: 2.5rem;
  height: 2.5rem;
  
  /* Styling */
  background-color: var(--d-bg-secondary);
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-sm);
  
  /* Interaction */
  cursor: pointer;
  user-select: none;
  
  /* Transitions */
  transition: all 0.15s ease-out;
  
  /* Remove default button styles */
  outline: none;
  padding: 0;
}

/* Size variations */
.d-hamburger-button--sm {
  width: 2rem;
  height: 2rem;
}

.d-hamburger-button--lg {
  width: 3rem;
  height: 3rem;
}

/* Interactive states */
.d-hamburger-button.d-hovered:not(.d-hamburger-button--disabled) {
  background-color: var(--d-accent-yellow);
  transform: translateY(-1px);
}

.d-hamburger-button.d-pressed:not(.d-hamburger-button--disabled) {
  transform: translate(1px, 1px);
}

/* Lines container */
.d-hamburger-button__lines {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 1.25rem;
  height: 1rem;
  position: relative;
}

.d-hamburger-button--sm .d-hamburger-button__lines {
  width: 1rem;
  height: 0.75rem;
}

.d-hamburger-button--lg .d-hamburger-button__lines {
  width: 1.5rem;
  height: 1.25rem;
}

/* Individual lines */
.d-hamburger-button__line {
  display: block;
  height: var(--d-border-width-thick);
  background-color: var(--d-text-primary);
  border-radius: 1px;
  transition: all 0.3s ease-out;
  transform-origin: center;
}

/* Burger-style progressive widths */
.d-hamburger-button__line--top {
  width: 100%; /* Longest line */
}

.d-hamburger-button__line--middle {
  width: 85%; /* Medium line */
  margin-left: auto;
  margin-right: auto;
}

.d-hamburger-button__line--bottom {
  width: 70%; /* Shortest line */
  margin-left: auto;
  margin-right: auto;
}

/* Open state animation */
.d-hamburger-button--open .d-hamburger-button__line--top {
  transform: translateY(0.375rem) rotate(45deg);
  width: 100%; /* Full width when forming X */
}

.d-hamburger-button--open .d-hamburger-button__line--middle {
  opacity: 0;
  transform: scaleX(0);
}

.d-hamburger-button--open .d-hamburger-button__line--bottom {
  transform: translateY(-0.375rem) rotate(-45deg);
  width: 100%; /* Full width when forming X */
}

/* Size-specific open animations */
.d-hamburger-button--sm.d-hamburger-button--open .d-hamburger-button__line--top {
  transform: translateY(0.25rem) rotate(45deg);
  width: 100%;
}

.d-hamburger-button--sm.d-hamburger-button--open .d-hamburger-button__line--bottom {
  transform: translateY(-0.25rem) rotate(-45deg);
  width: 100%;
}

.d-hamburger-button--lg.d-hamburger-button--open .d-hamburger-button__line--top {
  transform: translateY(0.5rem) rotate(45deg);
  width: 100%;
}

.d-hamburger-button--lg.d-hamburger-button--open .d-hamburger-button__line--bottom {
  transform: translateY(-0.5rem) rotate(-45deg);
  width: 100%;
}

/* Disabled state */
.d-hamburger-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none !important;
  transform: none !important;
}

.d-hamburger-button--disabled .d-hamburger-button__line {
  background-color: var(--d-text-primary);
  opacity: 0.5;
}

/* Focus styles for accessibility */
.d-hamburger-button:focus-visible {
  outline: var(--d-border-width-thick) solid var(--d-text-primary);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .d-hamburger-button {
    border-width: var(--d-border-width-extra-thick);
  }
  
  .d-hamburger-button__line {
    height: var(--d-border-width-extra-thick);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .d-hamburger-button,
  .d-hamburger-button__line {
    transition: none !important;
  }
}
</style>