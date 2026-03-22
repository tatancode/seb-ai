<template>
  <component
    :is="componentTag"
    ref="itemRef"
    :class="itemClasses"
    :style="itemStyles"
    v-bind="componentProps"
    v-on="eventListeners"
    @click="handleClick"
    role="menuitem"
  >
    <span class="d-navbar-dropdown-item__content">
      {{ item.label }}
    </span>
  </component>
</template>

<script>
import { ref, computed, defineComponent } from 'vue'
import { useInteractiveStates } from '../composables/useInteractiveStates.js'

export default defineComponent({
  name: 'DNavbarDropdownItem',
  props: {
    /**
     * Navigation item object
     */
    item: {
      type: Object,
      required: true,
      validator: (item) => {
        return typeof item === 'object' && 
               item !== null && 
               typeof item.label === 'string'
      }
    },
    
    /**
     * Whether this item is currently active
     */
    active: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['navigate'],
  
  setup(props, { emit }) {
    const itemRef = ref(null)
    
    // Determine component tag and props
    const componentTag = computed(() => {
      return props.item.href ? 'a' : 'button'
    })
    
    const componentProps = computed(() => {
      const baseProps = {}
      
      if (props.item.href) {
        baseProps.href = props.item.href
        baseProps.target = props.item.target || undefined
        baseProps.rel = props.item.target === '_blank' ? 'noopener noreferrer' : undefined
      }
      
      if (props.item.disabled) {
        baseProps.disabled = true
        baseProps['aria-disabled'] = 'true'
      }
      
      return baseProps
    })
    
    // Interactive states
    const {
      stickerStyles,
      interactiveClasses,
      eventListeners: baseEventListeners,
      setActive
    } = useInteractiveStates({
      shadowSize: 'sm',
      disabled: computed(() => props.item.disabled),
      trackFocus: true,
      trackHover: true,
      trackActive: true
    })
    
    // Set active state based on prop
    setActive(props.active)
    
    /**
     * Generate item classes
     */
    const itemClasses = computed(() => {
      const classes = [
        'd-navbar-dropdown-item',
        ...interactiveClasses.value
      ]
      
      if (props.active) classes.push('d-navbar-dropdown-item--active')
      if (props.item.disabled) classes.push('d-navbar-dropdown-item--disabled')
      
      return classes
    })
    
    /**
     * Generate item styles
     */
    const itemStyles = computed(() => {
      return {
        ...stickerStyles.value
      }
    })
    
    /**
     * Handle item click
     */
    const handleClick = (event) => {
      if (props.item.disabled) {
        event.preventDefault()
        return
      }
      
      emit('navigate', props.item, event)
    }
    
    // Event listeners
    const eventListeners = computed(() => {
      return {
        ...baseEventListeners.value
      }
    })
    
    return {
      itemRef,
      componentTag,
      componentProps,
      itemClasses,
      itemStyles,
      eventListeners,
      handleClick
    }
  }
})
</script>

<style scoped>
.d-navbar-dropdown-item {
  /* Layout */
  display: flex;
  align-items: center;
  width: 100%;
  
  /* Styling */
  background-color: transparent;
  border: none;
  border-radius: var(--d-radius-sm);
  
  /* Typography */
  font-family: var(--d-font-family);
  font-weight: var(--d-font-weight-normal);
  font-size: 0.875rem;
  color: var(--d-text-primary);
  text-decoration: none;
  text-align: left;
  
  /* Spacing */
  padding: 0.5rem 0.75rem;
  margin: 0.125rem 0;
  
  /* Interaction */
  cursor: pointer;
  user-select: none;
  
  /* Transitions */
  transition: all 0.15s ease-out;
  
  /* Remove default button styles */
  outline: none;
}

/* Hover state */
.d-navbar-dropdown-item.d-hovered:not(.d-navbar-dropdown-item--disabled) {
  background-color: var(--d-bg-secondary);
  transform: translateX(2px);
}

/* Active state */
.d-navbar-dropdown-item--active,
.d-navbar-dropdown-item.d-active {
  background-color: var(--d-bg-secondary);
  font-weight: var(--d-font-weight-bold);
}

/* Pressed state */
.d-navbar-dropdown-item.d-pressed:not(.d-navbar-dropdown-item--disabled) {
  background-color: var(--d-bg-primary);
  transform: translateX(1px);
}

/* Item content */
.d-navbar-dropdown-item__content {
  flex: 1;
}

/* Disabled state */
.d-navbar-dropdown-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* Focus styles for accessibility */
.d-navbar-dropdown-item:focus-visible {
  outline: var(--d-border-width-thick) solid var(--d-text-primary);
  outline-offset: 1px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .d-navbar-dropdown-item.d-hovered:not(.d-navbar-dropdown-item--disabled),
  .d-navbar-dropdown-item--active,
  .d-navbar-dropdown-item.d-active {
    border: var(--d-border-width-thin) solid var(--d-text-primary);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .d-navbar-dropdown-item {
    transition: none;
  }
}
</style>