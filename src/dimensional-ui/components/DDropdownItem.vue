<template>
  <div
    ref="itemRef"
    class="d-dropdown-item"
    :class="itemClasses"
    :style="itemStyles"
    :tabindex="disabled ? -1 : 0"
    :aria-disabled="disabled"
    role="menuitem"
    v-bind="accessibilityAttrs"
    v-on="eventListeners"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <!-- Icon (if provided) -->
    <div v-if="item.icon" class="d-dropdown-item__icon">
      <component :is="item.icon" v-if="typeof item.icon === 'object'" />
      <span v-else v-html="item.icon" />
    </div>
    
    <!-- Content -->
    <div class="d-dropdown-item__content">
      <div class="d-dropdown-item__label">
        {{ item.label }}
      </div>
      <div v-if="item.description" class="d-dropdown-item__description">
        {{ item.description }}
      </div>
    </div>
    
    <!-- Badge/Tag (if provided) -->
    <div v-if="item.badge" class="d-dropdown-item__badge">
      {{ item.badge }}
    </div>
    
    <!-- Submenu indicator -->
    <div v-if="item.children && item.children.length > 0" class="d-dropdown-item__submenu-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9,18 15,12 9,6"></polyline>
      </svg>
    </div>
    
    <!-- Nested Dropdown for Submenus -->
    <div
      v-if="item.children && item.children.length > 0 && showSubmenu"
      class="d-dropdown-item__submenu"
    >
      <!-- Simplified nested menu for now - full nesting can be implemented later -->
      <div class="d-dropdown-item__submenu-content">
        <div
          v-for="(child, childIndex) in item.children"
          :key="child.key || childIndex"
          class="d-dropdown-item d-dropdown-item--nested"
          @click="() => handleSubmenuSelect(child, childIndex)"
        >
          <div class="d-dropdown-item__content">
            <div class="d-dropdown-item__label">
              {{ child.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, defineComponent } from 'vue'
import { useInteractiveStates } from '../composables/useInteractiveStates.js'

export default defineComponent({
  name: 'DDropdownItem',
  props: {
    /**
     * Item data object
     */
    item: {
      type: Object,
      required: true,
      validator: (item) => {
        return item && typeof item === 'object' && item.label
      }
    },
    
    /**
     * Whether this item is currently focused
     */
    focused: {
      type: Boolean,
      default: false
    },
    
    /**
     * Disabled state
     */
    disabled: {
      type: Boolean,
      default: false
    },
    
    /**
     * Dropdown variant (inherited from parent)
     */
    variant: {
      type: String,
      default: 'yellow'
    },
    
    /**
     * Dropdown size (inherited from parent)
     */
    size: {
      type: String,
      default: 'md'
    },
    
    /**
     * Close parent dropdown on click
     */
    closeOnClick: {
      type: Boolean,
      default: true
    }
  },
  
  emits: ['click', 'focus', 'mouseenter', 'select'],
  
  setup(props, { emit }) {
    const itemRef = ref(null)
    const showSubmenu = ref(false)
    
    // Interactive states
    const {
      interactiveClasses,
      eventListeners,
      accessibilityAttrs
    } = useInteractiveStates({
      shadowSize: 'sm',
      disabled: computed(() => props.disabled),
      trackFocus: true,
      trackHover: true,
      trackActive: false
    })
    
    /**
     * Item classes
     */
    const itemClasses = computed(() => {
      const classes = [
        `d-dropdown-item--${props.variant}`,
        `d-dropdown-item--${props.size}`,
        ...interactiveClasses.value
      ]
      
      if (props.disabled) classes.push('d-dropdown-item--disabled')
      if (props.focused) classes.push('d-dropdown-item--focused')
      if (props.item.active) classes.push('d-dropdown-item--active')
      if (props.item.children && props.item.children.length > 0) {
        classes.push('d-dropdown-item--has-submenu')
      }
      if (props.item.divider) classes.push('d-dropdown-item--divider')
      
      return classes
    })
    
    /**
     * Item styles
     */
    const itemStyles = computed(() => {
      const styles = {}
      
      // Custom color if provided
      if (props.item.color) {
        styles.color = props.item.color
      }
      
      return styles
    })
    
    /**
     * Handle click events
     */
    const handleClick = (event) => {
      if (props.disabled) {
        event.preventDefault()
        return
      }
      
      // Handle submenu toggle
      if (props.item.children && props.item.children.length > 0) {
        showSubmenu.value = !showSubmenu.value
        event.stopPropagation()
        return
      }
      
      // Handle regular item click
      if (props.item.href) {
        // Let the browser handle navigation
        return
      }
      
      if (props.item.onClick) {
        props.item.onClick(event, props.item)
      }
      
      emit('click', event, props.item)
    }
    
    /**
     * Handle keyboard navigation
     */
    const handleKeyDown = (event) => {
      if (props.disabled) return
      
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault()
          handleClick(event)
          break
          
        case 'ArrowRight':
          if (props.item.children && props.item.children.length > 0) {
            event.preventDefault()
            showSubmenu.value = true
          }
          break
          
        case 'ArrowLeft':
          if (showSubmenu.value) {
            event.preventDefault()
            showSubmenu.value = false
          }
          break
      }
    }
    
    /**
     * Handle submenu selection
     */
    const handleSubmenuSelect = (item, index) => {
      emit('select', item, index)
    }
    
    /**
     * Handle focus events
     */
    const handleFocus = () => {
      if (!props.disabled) {
        emit('focus')
      }
    }
    
    /**
     * Handle mouse enter events
     */
    const handleMouseEnter = () => {
      if (!props.disabled) {
        emit('mouseenter')
      }
    }
    
    return {
      // Refs
      itemRef,
      showSubmenu,
      
      // Computed
      itemClasses,
      itemStyles,
      
      // Event listeners
      eventListeners,
      accessibilityAttrs,
      
      // Methods
      handleClick,
      handleKeyDown,
      handleSubmenuSelect,
      handleFocus,
      handleMouseEnter
    }
  }
})
</script>

<style scoped>
.d-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--d-radius-sm);
  cursor: pointer;
  user-select: none;
  position: relative;
  
  /* Typography */
  font-family: var(--d-font-family);
  font-weight: var(--d-font-weight-normal);
  line-height: 1.2;
  
  /* Transitions */
  transition: all 0.15s ease-out;
  
  /* Remove default styles */
  outline: none;
  text-decoration: none;
}

/* Size Variations */
.d-dropdown-item--sm {
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  gap: 0.5rem;
}

.d-dropdown-item--md {
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  gap: 0.75rem;
}

.d-dropdown-item--lg {
  padding: 0.75rem 1rem;
  font-size: 1.125rem;
  gap: 1rem;
}

/* Variant Styles - Hover States */
.d-dropdown-item--yellow.d-hovered:not(.d-dropdown-item--disabled) {
  background-color: rgba(0, 0, 0, 0.1);
  color: var(--d-text-primary);
}

.d-dropdown-item--pink.d-hovered:not(.d-dropdown-item--disabled) {
  background-color: rgba(255, 255, 255, 0.2);
  color: var(--d-bg-secondary);
}

.d-dropdown-item--white.d-hovered:not(.d-dropdown-item--disabled) {
  background-color: var(--d-accent-yellow);
  color: var(--d-text-primary);
}

/* Focused State */
.d-dropdown-item--focused:not(.d-dropdown-item--disabled) {
  background-color: rgba(0, 0, 0, 0.1);
}

.d-dropdown-item--pink.d-dropdown-item--focused:not(.d-dropdown-item--disabled) {
  background-color: rgba(255, 255, 255, 0.2);
}

.d-dropdown-item--white.d-dropdown-item--focused:not(.d-dropdown-item--disabled) {
  background-color: var(--d-accent-yellow);
}

/* Active State */
.d-dropdown-item--active:not(.d-dropdown-item--disabled) {
  background-color: var(--d-text-primary);
  color: var(--d-bg-secondary);
}

.d-dropdown-item--pink.d-dropdown-item--active:not(.d-dropdown-item--disabled) {
  background-color: var(--d-bg-secondary);
  color: var(--d-text-primary);
}

/* Disabled State */
.d-dropdown-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Icon */
.d-dropdown-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25em;
  height: 1.25em;
  flex-shrink: 0;
}

.d-dropdown-item__icon svg {
  width: 100%;
  height: 100%;
}

/* Content */
.d-dropdown-item__content {
  flex: 1;
  min-width: 0;
}

.d-dropdown-item__label {
  font-weight: var(--d-font-weight-bold);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.d-dropdown-item__description {
  font-size: 0.875em;
  opacity: 0.8;
  margin-top: 0.125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Badge */
.d-dropdown-item__badge {
  padding: 0.125rem 0.375rem;
  background-color: var(--d-text-primary);
  color: var(--d-bg-secondary);
  border-radius: var(--d-radius-sm);
  font-size: 0.75em;
  font-weight: var(--d-font-weight-bold);
  flex-shrink: 0;
}

.d-dropdown-item--pink .d-dropdown-item__badge {
  background-color: var(--d-bg-secondary);
  color: var(--d-text-primary);
}

/* Submenu Icon */
.d-dropdown-item__submenu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  opacity: 0.7;
}

.d-dropdown-item__submenu-icon svg {
  width: 100%;
  height: 100%;
}

/* Submenu */
.d-dropdown-item__submenu {
  position: absolute;
  top: 0;
  left: 100%;
  margin-left: 0.5rem;
  z-index: calc(var(--d-z-dropdown) + 1);
}

.d-dropdown-item__submenu-content {
  background: inherit;
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-md);
  box-shadow: var(--d-shadow-dropdown);
  padding: 0.5rem;
  min-width: 150px;
}

.d-dropdown-item--nested {
  margin: 0;
  padding: 0.375rem 0.5rem;
  font-size: 0.875em;
}

/* Divider */
.d-dropdown-item--divider {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
}

.d-dropdown-item--pink.d-dropdown-item--divider {
  border-bottom-color: rgba(255, 255, 255, 0.3);
}

/* Focus Styles */
.d-dropdown-item:focus-visible {
  outline: 2px solid var(--d-text-primary);
  outline-offset: -2px;
}

.d-dropdown-item--pink:focus-visible {
  outline-color: var(--d-bg-secondary);
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .d-dropdown-item {
    transition: none;
  }
}
</style>