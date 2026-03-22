<template>
  <component
    :is="componentTag"
    ref="itemRef"
    :class="itemClasses"
    :style="itemStyles"
    v-bind="componentProps"
    v-on="eventListeners"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <!-- Item content -->
    <span class="d-navbar-item__content">
      {{ item.label }}
    </span>
    
    <!-- Dropdown indicator -->
    <span v-if="hasChildren" class="d-navbar-item__dropdown-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6,9 12,15 18,9"></polyline>
      </svg>
    </span>
    
    <!-- Dropdown menu -->
    <div
      v-if="hasChildren && isDropdownOpen"
      class="d-navbar-item__dropdown"
      role="menu"
      :aria-labelledby="itemId"
    >
      <DNavbarDropdownItem
        v-for="(child, index) in item.children"
        :key="child.id || index"
        :item="child"
        :active="isChildActive(child)"
        @navigate="handleChildNavigate"
      />
    </div>
  </component>
</template>

<script>
import { ref, computed, defineComponent } from 'vue'
import { useInteractiveStates } from '../composables/useInteractiveStates.js'
import { useTheme } from '../composables/useTheme.js'
import DNavbarDropdownItem from './DNavbarDropdownItem.vue'

export default defineComponent({
  name: 'DNavbarItem',
  components: {
    DNavbarDropdownItem
  },
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
    },
    
    /**
     * Whether dropdown is open (controlled by parent)
     */
    isDropdownOpen: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['navigate', 'toggle-dropdown'],
  
  setup(props, { emit }) {
    const itemRef = ref(null)
    const { prefersReducedMotion } = useTheme()
    
    // Generate unique ID for accessibility
    const itemId = computed(() => {
      return props.item.id || `nav-item-${Math.random().toString(36).substr(2, 9)}`
    })
    
    // Check if item has children
    const hasChildren = computed(() => {
      return Array.isArray(props.item.children) && props.item.children.length > 0
    })
    
    // Determine component tag and props
    const componentTag = computed(() => {
      if (hasChildren.value) return 'button'
      if (props.item.href) return 'a'
      return 'button'
    })
    
    const componentProps = computed(() => {
      const baseProps = {
        id: itemId.value,
        role: hasChildren.value ? 'menuitem' : 'menuitem',
        'aria-haspopup': hasChildren.value ? 'true' : undefined,
        'aria-expanded': hasChildren.value ? props.isDropdownOpen : undefined
      }
      
      if (props.item.href && !hasChildren.value) {
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
    
    // Interactive states for pill effect
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
        'd-navbar-item',
        ...interactiveClasses.value
      ]
      
      if (props.active) classes.push('d-navbar-item--active')
      if (hasChildren.value) classes.push('d-navbar-item--has-children')
      if (props.item.disabled) classes.push('d-navbar-item--disabled')
      if (props.isDropdownOpen) classes.push('d-navbar-item--dropdown-open')
      
      return classes
    })
    
    /**
     * Generate item styles with pill effects
     */
    const itemStyles = computed(() => {
      return {
        ...stickerStyles.value
      }
    })
    
    /**
     * Check if a child item is active
     */
    const isChildActive = (child) => {
      return child.active || false
    }
    
    /**
     * Handle item click
     */
    const handleClick = (event) => {
      if (props.item.disabled) {
        event.preventDefault()
        return
      }
      
      if (hasChildren.value) {
        event.preventDefault()
        emit('toggle-dropdown', itemId.value)
      } else {
        emit('navigate', props.item, event)
      }
    }
    
    /**
     * Handle child navigation
     */
    const handleChildNavigate = (child, event) => {
      emit('navigate', child, event)
    }
    
    /**
     * Handle keyboard navigation
     */
    const handleKeyDown = (event) => {
      if (props.item.disabled) return
      
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault()
          handleClick(event)
          break
        case 'ArrowDown':
          if (hasChildren.value) {
            event.preventDefault()
            emit('toggle-dropdown', itemId.value)
          }
          break
        case 'Escape':
          if (props.isDropdownOpen) {
            event.preventDefault()
            emit('toggle-dropdown', itemId.value)
          }
          break
      }
    }
    
    // Combine event listeners
    const eventListeners = computed(() => {
      return {
        ...baseEventListeners.value
      }
    })
    
    return {
      itemRef,
      itemId,
      hasChildren,
      componentTag,
      componentProps,
      itemClasses,
      itemStyles,
      eventListeners,
      isChildActive,
      handleClick,
      handleChildNavigate,
      handleKeyDown
    }
  }
})
</script>

<style scoped>
.d-navbar-item {
  /* Layout */
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  
  /* Styling */
  background-color: transparent;
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-pill);
  
  /* Typography */
  font-family: var(--d-font-family);
  font-weight: var(--d-font-weight-normal);
  font-size: 0.875rem;
  color: var(--d-text-primary);
  text-decoration: none;
  
  /* Spacing */
  padding: 0.5rem 1rem;
  
  /* Interaction */
  cursor: pointer;
  user-select: none;
  
  /* Transitions */
  transition: all 0.15s ease-out;
  
  /* Remove default button styles */
  outline: none;
}

/* Active state - pill with white background and shadow */
.d-navbar-item--active,
.d-navbar-item.d-active {
  background-color: var(--d-bg-secondary);
  border-color: var(--d-border);
  box-shadow: var(--d-shadow-sm);
}

/* Hover state - same as active but with reduced shadow */
.d-navbar-item.d-hovered:not(.d-navbar-item--disabled):not(.d-navbar-item--active) {
  background-color: var(--d-bg-secondary);
  border-color: var(--d-border);
  box-shadow: var(--d-shadow-hover);
  transform: translateY(-1px);
}

/* Pressed state */
.d-navbar-item.d-pressed:not(.d-navbar-item--disabled) {
  transform: translate(1px, 1px);
  box-shadow: var(--d-shadow-hover);
}

/* Dropdown open state */
.d-navbar-item--dropdown-open {
  background-color: var(--d-bg-secondary);
  border-color: var(--d-border);
  box-shadow: var(--d-shadow-sm);
}

/* Item content */
.d-navbar-item__content {
  font-weight: var(--d-font-weight-bold);
}

/* Dropdown icon */
.d-navbar-item__dropdown-icon {
  display: flex;
  align-items: center;
  width: 1rem;
  height: 1rem;
  transition: transform 0.15s ease-out;
}

.d-navbar-item--dropdown-open .d-navbar-item__dropdown-icon {
  transform: rotate(180deg);
}

.d-navbar-item__dropdown-icon svg {
  width: 100%;
  height: 100%;
}

/* Dropdown menu */
.d-navbar-item__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 12rem;
  
  /* Styling */
  background-color: var(--d-accent-yellow);
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-md);
  box-shadow: var(--d-shadow-dropdown);
  
  /* Spacing */
  padding: var(--d-spacing-xs);
  margin-top: 0.25rem;
  
  /* Positioning */
  z-index: calc(var(--d-z-dropdown) + 1);
}

/* Disabled state */
.d-navbar-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none !important;
  transform: none !important;
}

/* Focus styles for accessibility */
.d-navbar-item:focus-visible {
  outline: var(--d-border-width-thick) solid var(--d-text-primary);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .d-navbar-item {
    border-width: var(--d-border-width-extra-thick);
  }
  
  .d-navbar-item--active,
  .d-navbar-item.d-active {
    background-color: var(--d-bg-secondary);
    border-color: var(--d-text-primary);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .d-navbar-item,
  .d-navbar-item__dropdown-icon {
    transition: none;
  }
}
</style>