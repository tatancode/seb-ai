<template>
  <nav
    ref="navbarRef"
    :class="navbarClasses"
    :style="navbarStyles"
    role="navigation"
    :aria-label="ariaLabel"
  >
    <!-- Logo section -->
    <div v-if="logo || $slots.logo" class="d-navbar__logo">
      <slot name="logo">
        <img v-if="logo" :src="logo" :alt="logoAlt" class="d-navbar__logo-image" />
      </slot>
    </div>
    
    <!-- Navigation items -->
    <ul class="d-navbar__items" role="menubar">
      <li
        v-for="(item, index) in items"
        :key="item.id || index"
        class="d-navbar__item"
        role="none"
      >
        <DNavbarItem
          :item="item"
          :active="isItemActive(item)"
          :is-dropdown-open="activeDropdown === (item.id || index)"
          @navigate="handleNavigate"
          @toggle-dropdown="handleToggleDropdown"
        />
      </li>
    </ul>
    
    <!-- Actions slot -->
    <div v-if="$slots.actions" class="d-navbar__actions">
      <slot name="actions" />
    </div>
  </nav>
</template>

<script>
import { ref, computed, defineComponent, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../composables/useTheme.js'
import DNavbarItem from './DNavbarItem.vue'

export default defineComponent({
  name: 'DNavbar',
  components: {
    DNavbarItem
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
     * Sticky positioning
     */
    sticky: {
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
      default: 'Main navigation'
    },
    
    /**
     * Responsive behavior
     */
    responsive: {
      type: Boolean,
      default: true
    }
  },
  
  emits: ['navigate', 'dropdown-toggle'],
  
  setup(props, { emit }) {
    const navbarRef = ref(null)
    const { prefersReducedMotion } = useTheme()
    
    // Active dropdown tracking
    const activeDropdown = ref(null)
    
    /**
     * Generate navbar classes
     */
    const navbarClasses = computed(() => {
      const classes = ['d-navbar']
      
      if (props.sticky) classes.push('d-navbar--sticky')
      if (props.responsive) classes.push('d-navbar--responsive')
      
      return classes
    })
    
    /**
     * Generate navbar styles
     */
    const navbarStyles = computed(() => {
      return {
        // Base styles are handled in CSS
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
      
      return item.active || false
    }
    
    /**
     * Handle navigation item click
     */
    const handleNavigate = (item, event) => {
      // Close any open dropdowns
      activeDropdown.value = null
      
      emit('navigate', { item, event })
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
     * Close dropdowns when clicking outside
     */
    const handleClickOutside = (event) => {
      if (navbarRef.value && !navbarRef.value.contains(event.target)) {
        activeDropdown.value = null
      }
    }
    
    /**
     * Handle keyboard navigation
     */
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        activeDropdown.value = null
      }
    }
    
    // Lifecycle
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    })
    
    return {
      navbarRef,
      navbarClasses,
      navbarStyles,
      activeDropdown,
      isItemActive,
      handleNavigate,
      handleToggleDropdown
    }
  }
})
</script>

<style scoped>
.d-navbar {
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--d-spacing-md);
  
  /* Styling */
  background-color: var(--d-bg-primary);
  border-bottom: var(--d-border-width-thin) solid var(--d-border);
  
  /* Spacing */
  padding: var(--d-spacing-sm) var(--d-spacing-md);
  
  /* Typography */
  font-family: var(--d-font-family);
  font-weight: var(--d-font-weight-normal);
  
  /* Positioning */
  position: relative;
  z-index: var(--d-z-dropdown);
}

/* Sticky positioning */
.d-navbar--sticky {
  position: sticky;
  top: 0;
}

/* Logo section */
.d-navbar__logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.d-navbar__logo-image {
  height: 2rem;
  width: auto;
  object-fit: contain;
}

/* Navigation items container */
.d-navbar__items {
  display: flex;
  align-items: center;
  gap: var(--d-spacing-xs);
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  justify-content: center;
}

.d-navbar__item {
  position: relative;
}

/* Actions section */
.d-navbar__actions {
  display: flex;
  align-items: center;
  gap: var(--d-spacing-sm);
  flex-shrink: 0;
}

/* Responsive behavior */
@media (max-width: 768px) {
  .d-navbar--responsive {
    flex-wrap: wrap;
    gap: var(--d-spacing-sm);
  }
  
  .d-navbar--responsive .d-navbar__items {
    order: 3;
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: var(--d-spacing-xs);
  }
  
  .d-navbar--responsive .d-navbar__actions {
    order: 2;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .d-navbar {
    border-bottom-width: var(--d-border-width-thick);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .d-navbar * {
    transition: none !important;
  }
}
</style>