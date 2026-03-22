<template>
  <div
    ref="dropdownRef"
    class="d-dropdown"
    :class="dropdownClasses"
    @keydown="handleKeyDown"
  >
    <!-- Trigger Element -->
    <div
      ref="triggerRef"
      class="d-dropdown__trigger"
      :class="triggerClasses"
      :style="triggerStyles"
      :tabindex="disabled ? -1 : 0"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      :aria-controls="dropdownId"
      role="button"
      v-bind="triggerAccessibilityAttrs"
      v-on="triggerEventListeners"
      @click="toggle"
      @keydown="handleTriggerKeyDown"
    >
      <slot name="trigger" :is-open="isOpen" :toggle="toggle">
        <span class="d-dropdown__trigger-text">{{ triggerText }}</span>
        <svg
          class="d-dropdown__trigger-icon"
          :class="{ 'd-dropdown__trigger-icon--rotated': isOpen }"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </slot>
    </div>

    <!-- Dropdown Menu -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="menuRef"
        :id="dropdownId"
        class="d-dropdown__menu"
        :class="menuClasses"
        :style="menuStyles"
        role="menu"
        :aria-labelledby="dropdownId + '-trigger'"
      >
        <div class="d-dropdown__menu-content">
          <slot :is-open="isOpen" :close="close" :items="items">
            <DDropdownItem
              v-for="(item, index) in items"
              :key="item.key || index"
              :item="item"
              :focused="focusedIndex === index"
              :disabled="item.disabled"
              @click="handleItemClick(item, index)"
              @focus="focusedIndex = index"
              @mouseenter="focusedIndex = index"
            />
          </slot>
        </div>
      </div>
    </Teleport>

    <!-- Backdrop for mobile -->
    <div
      v-if="isOpen && backdrop"
      class="d-dropdown__backdrop"
      @click="close"
    />
  </div>
</template>

<script>
import { ref, computed, defineComponent, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useInteractiveStates } from '../composables/useInteractiveStates.js'
import { useShadowEffects } from '../composables/useShadowEffects.js'
import { useTheme } from '../composables/useTheme.js'

// Import DDropdownItem component (we'll create this next)
import DDropdownItem from './DDropdownItem.vue'

export default defineComponent({
  name: 'DDropdown',
  components: {
    DDropdownItem
  },
  props: {
    /**
     * Dropdown items array
     */
    items: {
      type: Array,
      default: () => []
    },
    
    /**
     * Trigger text when using default trigger
     */
    triggerText: {
      type: String,
      default: 'Dropdown'
    },
    
    /**
     * Dropdown variant - determines color scheme
     */
    variant: {
      type: String,
      default: 'yellow',
      validator: (value) => ['yellow', 'pink', 'white'].includes(value)
    },
    
    /**
     * Dropdown size
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
     * Dropdown position relative to trigger
     */
    position: {
      type: String,
      default: 'bottom-start',
      validator: (value) => [
        'top-start', 'top-end', 'bottom-start', 'bottom-end',
        'left-start', 'left-end', 'right-start', 'right-end'
      ].includes(value)
    },
    
    /**
     * Close on item click
     */
    closeOnClick: {
      type: Boolean,
      default: true
    },
    
    /**
     * Show backdrop on mobile
     */
    backdrop: {
      type: Boolean,
      default: true
    },
    
    /**
     * Maximum height of dropdown menu
     */
    maxHeight: {
      type: String,
      default: '300px'
    },
    
    /**
     * Offset from trigger element
     */
    offset: {
      type: Number,
      default: 8
    }
  },
  
  emits: ['open', 'close', 'select', 'toggle'],
  
  setup(props, { emit }) {
    const dropdownRef = ref(null)
    const triggerRef = ref(null)
    const menuRef = ref(null)
    
    // State
    const isOpen = ref(false)
    const focusedIndex = ref(-1)
    const dropdownId = ref(`d-dropdown-${Math.random().toString(36).substr(2, 9)}`)
    
    // Theme and effects
    const { prefersReducedMotion } = useTheme()
    const { getDropdownShadow } = useShadowEffects()
    
    // Interactive states for trigger
    const {
      stickerStyles: triggerStickerStyles,
      interactiveClasses: triggerInteractiveClasses,
      eventListeners: triggerEventListeners,
      accessibilityAttrs: triggerAccessibilityAttrs
    } = useInteractiveStates({
      shadowSize: props.size === 'lg' ? 'lg' : 'md',
      disabled: computed(() => props.disabled),
      trackFocus: true,
      trackHover: true,
      trackActive: true
    })
    
    /**
     * Dropdown classes
     */
    const dropdownClasses = computed(() => {
      const classes = [
        `d-dropdown--${props.variant}`,
        `d-dropdown--${props.size}`
      ]
      
      if (props.disabled) classes.push('d-dropdown--disabled')
      if (isOpen.value) classes.push('d-dropdown--open')
      
      return classes
    })
    
    /**
     * Trigger classes
     */
    const triggerClasses = computed(() => {
      const classes = [
        'd-dropdown__trigger',
        `d-dropdown__trigger--${props.variant}`,
        `d-dropdown__trigger--${props.size}`,
        ...triggerInteractiveClasses.value
      ]
      
      if (props.disabled) classes.push('d-dropdown__trigger--disabled')
      if (isOpen.value) classes.push('d-dropdown__trigger--open')
      
      return classes
    })
    
    /**
     * Trigger styles
     */
    const triggerStyles = computed(() => {
      return {
        ...triggerStickerStyles.value
      }
    })
    
    /**
     * Menu classes
     */
    const menuClasses = computed(() => {
      const classes = [
        `d-dropdown__menu--${props.variant}`,
        `d-dropdown__menu--${props.size}`,
        `d-dropdown__menu--${props.position}`
      ]
      
      return classes
    })
    
    /**
     * Menu styles with positioning
     */
    const menuStyles = ref({})
    
    /**
     * Calculate menu position
     */
    const calculatePosition = async () => {
      if (!triggerRef.value || !menuRef.value) return
      
      await nextTick()
      
      const trigger = triggerRef.value.getBoundingClientRect()
      const menu = menuRef.value.getBoundingClientRect()
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      }
      
      let top = 0
      let left = 0
      
      // Calculate base position
      switch (props.position) {
        case 'top-start':
          top = trigger.top - menu.height - props.offset
          left = trigger.left
          break
        case 'top-end':
          top = trigger.top - menu.height - props.offset
          left = trigger.right - menu.width
          break
        case 'bottom-start':
          top = trigger.bottom + props.offset
          left = trigger.left
          break
        case 'bottom-end':
          top = trigger.bottom + props.offset
          left = trigger.right - menu.width
          break
        case 'left-start':
          top = trigger.top
          left = trigger.left - menu.width - props.offset
          break
        case 'left-end':
          top = trigger.bottom - menu.height
          left = trigger.left - menu.width - props.offset
          break
        case 'right-start':
          top = trigger.top
          left = trigger.right + props.offset
          break
        case 'right-end':
          top = trigger.bottom - menu.height
          left = trigger.right + props.offset
          break
      }
      
      // Adjust for viewport boundaries
      if (left < 0) left = 8
      if (left + menu.width > viewport.width) left = viewport.width - menu.width - 8
      if (top < 0) top = 8
      if (top + menu.height > viewport.height) top = viewport.height - menu.height - 8
      
      // Get shadow direction for positioning
      const shadowDirection = props.position.startsWith('top') ? 'up' : 'down'
      
      menuStyles.value = {
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        maxHeight: props.maxHeight,
        zIndex: 'var(--d-z-dropdown)',
        boxShadow: getDropdownShadow(shadowDirection)
      }
    }
    
    /**
     * Open dropdown
     */
    const open = async () => {
      if (props.disabled || isOpen.value) return
      
      isOpen.value = true
      focusedIndex.value = -1
      
      await nextTick()
      await calculatePosition()
      
      emit('open')
      emit('toggle', true)
    }
    
    /**
     * Close dropdown
     */
    const close = () => {
      if (!isOpen.value) return
      
      isOpen.value = false
      focusedIndex.value = -1
      
      // Return focus to trigger
      if (triggerRef.value) {
        triggerRef.value.focus()
      }
      
      emit('close')
      emit('toggle', false)
    }
    
    /**
     * Toggle dropdown
     */
    const toggle = () => {
      if (isOpen.value) {
        close()
      } else {
        open()
      }
    }
    
    /**
     * Handle item click
     */
    const handleItemClick = (item, index) => {
      if (item.disabled) return
      
      emit('select', item, index)
      
      if (props.closeOnClick && !item.children) {
        close()
      }
    }
    
    /**
     * Handle keyboard navigation
     */
    const handleKeyDown = (event) => {
      if (!isOpen.value) return
      
      const visibleItems = props.items.filter(item => !item.disabled)
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          focusedIndex.value = Math.min(focusedIndex.value + 1, visibleItems.length - 1)
          break
          
        case 'ArrowUp':
          event.preventDefault()
          focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
          break
          
        case 'Home':
          event.preventDefault()
          focusedIndex.value = 0
          break
          
        case 'End':
          event.preventDefault()
          focusedIndex.value = visibleItems.length - 1
          break
          
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (focusedIndex.value >= 0 && focusedIndex.value < visibleItems.length) {
            const item = visibleItems[focusedIndex.value]
            handleItemClick(item, focusedIndex.value)
          }
          break
          
        case 'Escape':
          event.preventDefault()
          close()
          break
      }
    }
    
    /**
     * Handle trigger keyboard events
     */
    const handleTriggerKeyDown = (event) => {
      switch (event.key) {
        case 'Enter':
        case ' ':
        case 'ArrowDown':
          event.preventDefault()
          if (!isOpen.value) {
            open()
            focusedIndex.value = 0
          }
          break
          
        case 'ArrowUp':
          event.preventDefault()
          if (!isOpen.value) {
            open()
            focusedIndex.value = props.items.length - 1
          }
          break
          
        case 'Escape':
          if (isOpen.value) {
            event.preventDefault()
            close()
          }
          break
      }
    }
    
    /**
     * Handle clicks outside dropdown
     */
    const handleClickOutside = (event) => {
      if (!isOpen.value) return
      
      const dropdown = dropdownRef.value
      const menu = menuRef.value
      
      if (dropdown && !dropdown.contains(event.target) && 
          menu && !menu.contains(event.target)) {
        close()
      }
    }
    
    /**
     * Handle window resize
     */
    const handleResize = () => {
      if (isOpen.value) {
        calculatePosition()
      }
    }
    
    // Watch for position changes
    watch(() => props.position, () => {
      if (isOpen.value) {
        calculatePosition()
      }
    })
    
    // Lifecycle
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      window.addEventListener('resize', handleResize)
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('resize', handleResize)
    })
    
    return {
      // Refs
      dropdownRef,
      triggerRef,
      menuRef,
      
      // State
      isOpen,
      focusedIndex,
      dropdownId,
      
      // Classes and styles
      dropdownClasses,
      triggerClasses,
      triggerStyles,
      menuClasses,
      menuStyles,
      
      // Event listeners
      triggerEventListeners,
      triggerAccessibilityAttrs,
      
      // Methods
      open,
      close,
      toggle,
      handleItemClick,
      handleKeyDown,
      handleTriggerKeyDown
    }
  }
})
</script>

<style scoped>
.d-dropdown {
  position: relative;
  display: inline-block;
}

/* Trigger Styles */
.d-dropdown__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  
  /* Typography */
  font-family: var(--d-font-family);
  font-weight: var(--d-font-weight-bold);
  text-align: left;
  line-height: 1;
  
  /* Layout */
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-md);
  cursor: pointer;
  user-select: none;
  
  /* Transitions */
  transition: all 0.15s ease-out;
  
  /* Remove default styles */
  background: none;
  outline: none;
}

/* Trigger Size Variations */
.d-dropdown__trigger--sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  min-height: 2rem;
}

.d-dropdown__trigger--md {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  min-height: 2.5rem;
}

.d-dropdown__trigger--lg {
  padding: 1rem 1.25rem;
  font-size: 1.125rem;
  min-height: 3rem;
}

/* Trigger Variant Styles */
.d-dropdown__trigger--yellow {
  background-color: var(--d-accent-yellow);
  color: var(--d-text-primary);
}

.d-dropdown__trigger--pink {
  background-color: var(--d-accent-pink);
  color: var(--d-bg-secondary);
}

.d-dropdown__trigger--white {
  background-color: var(--d-bg-secondary);
  color: var(--d-text-primary);
}

/* Trigger Interactive States */
.d-dropdown__trigger.d-hovered:not(.d-dropdown__trigger--disabled) {
  transform: translateY(-1px);
}

.d-dropdown__trigger.d-pressed:not(.d-dropdown__trigger--disabled),
.d-dropdown__trigger--open:not(.d-dropdown__trigger--disabled) {
  transform: translate(2px, 2px);
  box-shadow: none !important;
}

/* Trigger Hover Colors */
.d-dropdown__trigger--yellow.d-hovered:not(.d-dropdown__trigger--disabled) {
  background-color: #F0E84D;
}

.d-dropdown__trigger--pink.d-hovered:not(.d-dropdown__trigger--disabled) {
  background-color: #E6003D;
}

.d-dropdown__trigger--white.d-hovered:not(.d-dropdown__trigger--disabled) {
  background-color: #F5F5F5;
}

/* Trigger Icon */
.d-dropdown__trigger-icon {
  width: 1em;
  height: 1em;
  transition: transform 0.15s ease-out;
  flex-shrink: 0;
}

.d-dropdown__trigger-icon--rotated {
  transform: rotate(180deg);
}

/* Trigger Disabled State */
.d-dropdown__trigger--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none !important;
  transform: none !important;
}

/* Menu Styles */
.d-dropdown__menu {
  position: fixed;
  min-width: 200px;
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-md);
  overflow: hidden;
  z-index: var(--d-z-dropdown);
}

/* Menu Variant Styles */
.d-dropdown__menu--yellow {
  background-color: var(--d-accent-yellow);
}

.d-dropdown__menu--pink {
  background-color: var(--d-accent-pink);
}

.d-dropdown__menu--white {
  background-color: var(--d-bg-secondary);
}

/* Menu Content */
.d-dropdown__menu-content {
  padding: 0.5rem;
  max-height: inherit;
  overflow-y: auto;
}

/* Backdrop */
.d-dropdown__backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: calc(var(--d-z-dropdown) - 1);
  background: transparent;
}

/* Focus Styles */
.d-dropdown__trigger:focus-visible {
  outline: var(--d-border-width-thick) solid var(--d-text-primary);
  outline-offset: 2px;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .d-dropdown__trigger,
  .d-dropdown__trigger-icon {
    transition: none;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .d-dropdown__trigger,
  .d-dropdown__menu {
    border-width: 3px;
  }
}
</style>