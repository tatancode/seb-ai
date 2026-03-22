<template>
  <div class="d-side-navbar-wrapper">
    <!-- Hamburger button for mobile -->
    <DHamburgerButton
      v-if="showHamburgerButton && isMobile"
      :is-open="isOpen"
      class="d-side-navbar__hamburger"
      @click="handleHamburgerClick"
    />
    
    <aside
      ref="sideNavbarRef"
      :class="sideNavbarClasses"
      :style="sideNavbarStyles"
      role="navigation"
      :aria-label="ariaLabel"
      :aria-hidden="!isOpen"
    >
    <!-- Overlay for mobile -->
    <div
      v-if="showOverlay && isOpen"
      class="d-side-navbar__overlay"
      @click="handleOverlayClick"
      aria-hidden="true"
    />
    
    <!-- Side navigation content -->
    <nav class="d-side-navbar__content">
      <!-- Header section -->
      <div v-if="logo || $slots.logo || $slots.header" class="d-side-navbar__header">
        <slot name="header">
          <div v-if="logo || $slots.logo" class="d-side-navbar__logo">
            <slot name="logo">
              <img v-if="logo" :src="logo" :alt="logoAlt" class="d-side-navbar__logo-image" />
            </slot>
          </div>
        </slot>
        
        <!-- Close button for mobile -->
        <button
          v-if="showCloseButton"
          class="d-side-navbar__close"
          @click="handleClose"
          aria-label="Close navigation"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <!-- Navigation items -->
      <ul class="d-side-navbar__items" role="menubar" :aria-orientation="orientation">
        <li
          v-for="(item, index) in items"
          :key="item.id || index"
          class="d-side-navbar__item"
          role="none"
        >
          <DSideNavbarItem
            :item="item"
            :active="isItemActive(item)"
            :is-dropdown-open="activeDropdown === (item.id || index)"
            :level="0"
            @navigate="handleNavigate"
            @toggle-dropdown="handleToggleDropdown"
          />
        </li>
      </ul>
      
      <!-- Footer section -->
      <div v-if="$slots.footer" class="d-side-navbar__footer">
        <slot name="footer" />
      </div>
    </nav>
    </aside>
  </div>
</template>

<script>
import { ref, computed, defineComponent, onMounted, onUnmounted, watch } from 'vue'
import { useTheme } from '../composables/useTheme.js'
import DSideNavbarItem from './DSideNavbarItem.vue'
import DHamburgerButton from './DHamburgerButton.vue'

export default defineComponent({
  name: 'DSideNavbar',
  components: {
    DSideNavbarItem,
    DHamburgerButton
  },
  props: {
    /**
     * Navigation items array
     */
    items: {
      type: Array,
      default: () => [],
      validator: (items) => {
        return items.every(item => 
          typeof item === 'object' && 
          item !== null && 
          typeof item.label === 'string'
        )
      }
    },
    
    /**
     * Logo image source
     */
    logo: {
      type: String,
      default: ''
    },
    
    /**
     * Logo alt text
     */
    logoAlt: {
      type: String,
      default: 'Logo'
    },
    
    /**
     * Whether the sidebar is open (controlled)
     */
    isOpen: {
      type: Boolean,
      default: false
    },
    
    /**
     * Current active route/path for highlighting
     */
    currentPath: {
      type: String,
      default: ''
    },
    
    /**
     * ARIA label for navigation
     */
    ariaLabel: {
      type: String,
      default: 'Side navigation'
    },
    
    /**
     * Position of the sidebar
     */
    position: {
      type: String,
      default: 'left',
      validator: (value) => ['left', 'right'].includes(value)
    },
    
    /**
     * Width of the sidebar
     */
    width: {
      type: String,
      default: '280px'
    },
    
    /**
     * Whether to show overlay on mobile
     */
    showOverlay: {
      type: Boolean,
      default: true
    },
    
    /**
     * Whether to show close button
     */
    showCloseButton: {
      type: Boolean,
      default: true
    },
    
    /**
     * Sticky positioning
     */
    sticky: {
      type: Boolean,
      default: false
    },
    
    /**
     * Responsive breakpoint for mobile behavior
     */
    mobileBreakpoint: {
      type: String,
      default: '768px'
    },
    
    /**
     * Whether to show hamburger button for mobile
     */
    showHamburgerButton: {
      type: Boolean,
      default: true
    }
  },
  
  emits: ['navigate', 'dropdown-toggle', 'close', 'overlay-click', 'hamburger-click'],
  
  setup(props, { emit }) {
    const sideNavbarRef = ref(null)
    const { prefersReducedMotion } = useTheme()
    
    // Active dropdown tracking
    const activeDropdown = ref(null)
    
    // Media query for mobile detection
    const isMobile = ref(false)
    
    /**
     * Navigation orientation
     */
    const orientation = computed(() => 'vertical')
    
    /**
     * Generate sidebar classes
     */
    const sideNavbarClasses = computed(() => {
      const classes = ['d-side-navbar']
      
      classes.push(`d-side-navbar--${props.position}`)
      
      if (props.isOpen) classes.push('d-side-navbar--open')
      if (props.sticky) classes.push('d-side-navbar--sticky')
      if (isMobile.value) classes.push('d-side-navbar--mobile')
      
      return classes
    })
    
    /**
     * Generate sidebar styles
     */
    const sideNavbarStyles = computed(() => {
      return {
        '--d-side-navbar-width': props.width,
        '--d-side-navbar-mobile-breakpoint': props.mobileBreakpoint
      }
    })
    
    /**
     * Check if a navigation item is active
     */
    const isItemActive = (item) => {
      if (!props.currentPath) return item.active || false
      
      // Exact match
      if (item.href === props.currentPath) return true
      
      // Check if current path starts with item href (for parent routes)
      if (item.href && props.currentPath.startsWith(item.href) && item.href !== '/') {
        return true
      }
      
      // Check children for active state
      if (item.children && Array.isArray(item.children)) {
        return item.children.some(child => isItemActive(child))
      }
      
      return item.active || false
    }
    
    /**
     * Handle navigation item click
     */
    const handleNavigate = (item, event) => {
      // Close any open dropdowns
      activeDropdown.value = null
      
      emit('navigate', { item, event })
      
      // Auto-close on mobile after navigation
      if (isMobile.value && item.href) {
        emit('close')
      }
    }
    
    /**
     * Handle dropdown toggle
     */
    const handleToggleDropdown = (itemId) => {
      if (activeDropdown.value === itemId) {
        activeDropdown.value = null
      } else {
        activeDropdown.value = itemId
      }
      
      emit('dropdown-toggle', { itemId, isOpen: activeDropdown.value === itemId })
    }
    
    /**
     * Handle overlay click
     */
    const handleOverlayClick = () => {
      emit('overlay-click')
      emit('close')
    }
    
    /**
     * Handle close button click
     */
    const handleClose = () => {
      emit('close')
    }
    
    /**
     * Handle hamburger button click
     */
    const handleHamburgerClick = () => {
      emit('hamburger-click')
    }
    
    /**
     * Close dropdowns when clicking outside
     */
    const handleClickOutside = (event) => {
      if (sideNavbarRef.value && !sideNavbarRef.value.contains(event.target)) {
        activeDropdown.value = null
      }
    }
    
    /**
     * Handle keyboard navigation
     */
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (activeDropdown.value) {
          activeDropdown.value = null
        } else if (props.isOpen) {
          emit('close')
        }
      }
    }
    
    /**
     * Setup media query listener for mobile detection
     */
    const setupMediaQuery = () => {
      const mediaQuery = window.matchMedia(`(max-width: ${props.mobileBreakpoint})`)
      
      const handleMediaChange = (e) => {
        isMobile.value = e.matches
      }
      
      // Set initial value
      isMobile.value = mediaQuery.matches
      
      // Listen for changes
      mediaQuery.addEventListener('change', handleMediaChange)
      
      // Return cleanup function
      return () => {
        mediaQuery.removeEventListener('change', handleMediaChange)
      }
    }
    
    // Lifecycle
    let cleanupMediaQuery
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
      cleanupMediaQuery = setupMediaQuery()
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
      if (cleanupMediaQuery) {
        cleanupMediaQuery()
      }
    })
    
    // Watch for isOpen changes to manage body scroll
    watch(() => props.isOpen, (isOpen) => {
      if (isMobile.value) {
        if (isOpen) {
          document.body.style.overflow = 'hidden'
        } else {
          document.body.style.overflow = ''
        }
      }
    })
    
    return {
      sideNavbarRef,
      sideNavbarClasses,
      sideNavbarStyles,
      activeDropdown,
      isMobile,
      orientation,
      isItemActive,
      handleNavigate,
      handleToggleDropdown,
      handleOverlayClick,
      handleClose,
      handleHamburgerClick
    }
  }
})
</script>

<style scoped>
.d-side-navbar-wrapper {
  position: relative;
}

/* Hamburger button positioning */
.d-side-navbar__hamburger {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: calc(var(--d-z-dropdown) + 20);
}

.d-side-navbar {
  /* Layout */
  position: fixed;
  top: 0;
  bottom: 0;
  width: var(--d-side-navbar-width);
  
  /* Styling */
  background-color: var(--d-bg-primary);
  border-right: var(--d-border-width-thick) solid var(--d-border);
  
  /* Positioning */
  z-index: var(--d-z-dropdown);
  
  /* Transform for slide animation */
  transform: translateX(-100%);
  transition: transform 0.3s ease-out;
}

/* Right position */
.d-side-navbar--right {
  right: 0;
  left: auto;
  border-right: none;
  border-left: var(--d-border-width-thick) solid var(--d-border);
  transform: translateX(100%);
}

/* Open state */
.d-side-navbar--open {
  transform: translateX(0);
}

/* Sticky positioning */
.d-side-navbar--sticky {
  position: sticky;
}

/* Mobile behavior */
.d-side-navbar--mobile {
  z-index: calc(var(--d-z-dropdown) + 10);
}

/* Overlay */
.d-side-navbar__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
  cursor: pointer;
}

/* Content container */
.d-side-navbar__content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* Header section */
.d-side-navbar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--d-spacing-md);
  border-bottom: var(--d-border-width-thin) solid var(--d-border);
  flex-shrink: 0;
}

.d-side-navbar__logo {
  display: flex;
  align-items: center;
}

.d-side-navbar__logo-image {
  height: 2rem;
  width: auto;
  object-fit: contain;
}

/* Close button */
.d-side-navbar__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  
  /* Styling */
  background-color: transparent;
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-sm);
  color: var(--d-text-primary);
  
  /* Interaction */
  cursor: pointer;
  transition: all 0.15s ease-out;
  
  /* Remove default button styles */
  outline: none;
}

.d-side-navbar__close:hover {
  background-color: var(--d-bg-secondary);
  box-shadow: var(--d-shadow-sm);
  transform: translateY(-1px);
}

.d-side-navbar__close:active {
  transform: translate(1px, 1px);
  box-shadow: var(--d-shadow-hover);
}

.d-side-navbar__close svg {
  width: 1rem;
  height: 1rem;
}

/* Navigation items container */
.d-side-navbar__items {
  display: flex;
  flex-direction: column;
  gap: var(--d-spacing-xs);
  list-style: none;
  margin: 0;
  padding: var(--d-spacing-md);
  flex: 1;
  overflow-y: auto;
}

.d-side-navbar__item {
  position: relative;
}

/* Footer section */
.d-side-navbar__footer {
  padding: var(--d-spacing-md);
  border-top: var(--d-border-width-thin) solid var(--d-border);
  flex-shrink: 0;
}

/* Desktop behavior */
@media (min-width: 769px) {
  .d-side-navbar {
    position: relative;
    transform: none;
    transition: none;
  }
  
  .d-side-navbar--open {
    transform: none;
  }
  
  .d-side-navbar__overlay {
    display: none;
  }
  
  .d-side-navbar__close {
    display: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .d-side-navbar {
    border-width: var(--d-border-width-extra-thick);
  }
  
  .d-side-navbar__header,
  .d-side-navbar__footer {
    border-width: var(--d-border-width-thick);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .d-side-navbar,
  .d-side-navbar__close {
    transition: none !important;
  }
}
</style>