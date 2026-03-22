<template>
  <div class="d-side-navbar-item-wrapper">
    <!-- Main navigation item -->
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
      <span class="d-side-navbar-item__content">
        {{ item.label }}
      </span>
      
      <!-- Dropdown indicator -->
      <span v-if="hasChildren" class="d-side-navbar-item__dropdown-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9,6 15,12 9,18"></polyline>
        </svg>
      </span>
    </component>
    
    <!-- Nested items -->
    <div
      v-if="hasChildren && isDropdownOpen"
      class="d-side-navbar-item__children"
      role="menu"
      :aria-labelledby="itemId"
    >
      <DSideNavbarItem
        v-for="(child, index) in item.children"
        :key="child.id || index"
        :item="child"
        :active="isChildActive(child)"
        :level="level + 1"
        @navigate="handleChildNavigate"
        @toggle-dropdown="handleChildToggleDropdown"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, defineComponent } from 'vue'
import { useInteractiveStates } from '../composables/useInteractiveStates.js'
import { useTheme } from '../composables/useTheme.js'

export default defineComponent({
  name: 'DSideNavbarItem',
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
    },
    
    /**
     * Nesting level for indentation
     */
    level: {
      type: Number,
      default: 0
    }
  },
  
  emits: ['navigate', 'toggle-dropdown'],
  
  setup(props, { emit }) {
    const itemRef = ref(null)
    const { prefersReducedMotion } = useTheme()
    
    // Generate unique ID for accessibility
    const itemId = computed(() => {
      return props.item.id || `side-nav-item-${Math.random().toString(36).substr(2, 9)}`
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
        'd-side-navbar-item',
        ...interactiveClasses.value
      ]
      
      classes.push(`d-side-navbar-item--level-${props.level}`)
      
      if (props.active) classes.push('d-side-navbar-item--active')
      if (hasChildren.value) classes.push('d-side-navbar-item--has-children')
      if (props.item.disabled) classes.push('d-side-navbar-item--disabled')
      if (props.isDropdownOpen) classes.push('d-side-navbar-item--dropdown-open')
      
      return classes
    })
    
    /**
     * Generate item styles with pill effects and indentation
     */
    const itemStyles = computed(() => {
      const indentationOffset = props.level * 1.5 // 1.5rem per level
      
      return {
        ...stickerStyles.value,
        '--d-side-navbar-item-indent': `${indentationOffset}rem`
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
     * Handle child dropdown toggle
     */
    const handleChildToggleDropdown = (itemId) => {
      emit('toggle-dropdown', itemId)
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
        case 'ArrowRight':
          if (hasChildren.value && !props.isDropdownOpen) {
            event.preventDefault()
            emit('toggle-dropdown', itemId.value)
          }
          break
        case 'ArrowLeft':
          if (hasChildren.value && props.isDropdownOpen) {
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
      handleChildToggleDropdown,
      handleKeyDown
    }
  }
})
</script>

<style scoped>
.d-side-navbar-item-wrapper {
  width: 100%;
}

.d-side-navbar-item {
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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
  text-align: left;
  
  /* Spacing */
  padding: 0.75rem 1rem;
  margin: 0.125rem 0;
  
  /* Indentation for nested items */
  padding-left: calc(1rem + var(--d-side-navbar-item-indent, 0rem));
  
  /* Interaction */
  cursor: pointer;
  user-select: none;
  
  /* Transitions */
  transition: all 0.15s ease-out;
  
  /* Remove default button styles */
  outline: none;
}

/* Level-specific styling */
.d-side-navbar-item--level-0 {
  font-weight: var(--d-font-weight-bold);
}

.d-side-navbar-item--level-1 {
  font-size: 0.8125rem;
  opacity: 0.9;
}

.d-side-navbar-item--level-2 {
  font-size: 0.75rem;
  opacity: 0.8;
}

/* Active state - pill with white background and shadow */
.d-side-navbar-item--active,
.d-side-navbar-item.d-active {
  background-color: var(--d-bg-secondary);
  border-color: var(--d-border);
  box-shadow: var(--d-shadow-sm);
  font-weight: var(--d-font-weight-bold);
}

/* Hover state - same as active but with reduced shadow */
.d-side-navbar-item.d-hovered:not(.d-side-navbar-item--disabled):not(.d-side-navbar-item--active) {
  background-color: var(--d-bg-secondary);
  border-color: var(--d-border);
  box-shadow: var(--d-shadow-hover);
  transform: translateX(2px);
}

/* Pressed state */
.d-side-navbar-item.d-pressed:not(.d-side-navbar-item--disabled) {
  transform: translate(1px, 1px);
  box-shadow: var(--d-shadow-hover);
}

/* Dropdown open state */
.d-side-navbar-item--dropdown-open {
  background-color: var(--d-bg-secondary);
  border-color: var(--d-border);
  box-shadow: var(--d-shadow-sm);
}

/* Item content */
.d-side-navbar-item__content {
  flex: 1;
  text-align: left;
}

/* Dropdown icon */
.d-side-navbar-item__dropdown-icon {
  display: flex;
  align-items: center;
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
  transition: transform 0.15s ease-out;
  flex-shrink: 0;
}

.d-side-navbar-item--dropdown-open .d-side-navbar-item__dropdown-icon {
  transform: rotate(90deg);
}

.d-side-navbar-item__dropdown-icon svg {
  width: 100%;
  height: 100%;
}

/* Children container */
.d-side-navbar-item__children {
  margin-top: 0.25rem;
  padding-left: 0.5rem;
  border-left: var(--d-border-width-thin) solid var(--d-border);
  margin-left: 1rem;
}

/* Disabled state */
.d-side-navbar-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none !important;
  transform: none !important;
}

/* Focus styles for accessibility */
.d-side-navbar-item:focus-visible {
  outline: var(--d-border-width-thick) solid var(--d-text-primary);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .d-side-navbar-item {
    border-width: var(--d-border-width-thick);
  }
  
  .d-side-navbar-item--active,
  .d-side-navbar-item.d-active {
    background-color: var(--d-bg-secondary);
    border-color: var(--d-text-primary);
  }
  
  .d-side-navbar-item__children {
    border-width: var(--d-border-width-thick);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .d-side-navbar-item,
  .d-side-navbar-item__dropdown-icon {
    transition: none;
  }
}
</style>