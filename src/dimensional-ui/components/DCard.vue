<template>
  <div
    ref="cardRef"
    :class="cardClasses"
    :style="cardStyles"
    v-bind="accessibilityAttrs"
    v-on="eventListeners"
  >
    <!-- Header slot -->
    <header v-if="$slots.header || title" class="d-card__header">
      <slot name="header">
        <h3 v-if="title" class="d-card__title">{{ title }}</h3>
      </slot>
    </header>
    
    <!-- Main content -->
    <div class="d-card__content">
      <slot />
    </div>
    
    <!-- Footer slot -->
    <footer v-if="$slots.footer" class="d-card__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script>
import { ref, computed, defineComponent } from 'vue'
import { useInteractiveStates } from '../composables/useInteractiveStates.js'
import { useTheme } from '../composables/useTheme.js'

export default defineComponent({
  name: 'DCard',
  props: {
    /**
     * Card variant - determines styling theme
     */
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'accent-yellow', 'accent-pink', 'secondary'].includes(value)
    },
    
    /**
     * Card size - affects padding and shadow
     */
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    
    /**
     * Card title (alternative to header slot)
     */
    title: {
      type: String,
      default: ''
    },
    
    /**
     * Whether the card is interactive (clickable)
     */
    interactive: {
      type: Boolean,
      default: false
    },
    
    /**
     * Whether the card should have a border
     */
    bordered: {
      type: Boolean,
      default: true
    },
    
    /**
     * Custom shadow size override
     */
    shadowSize: {
      type: String,
      default: null,
      validator: (value) => !value || ['sm', 'md', 'lg'].includes(value)
    }
  },
  
  emits: ['click'],
  
  setup(props, { emit }) {
    const cardRef = ref(null)
    const { prefersReducedMotion } = useTheme()
    
    // Determine shadow size based on card size or override
    const effectiveShadowSize = computed(() => {
      if (props.shadowSize) return props.shadowSize
      
      switch (props.size) {
        case 'sm': return 'sm'
        case 'lg': return 'lg'
        default: return 'md'
      }
    })
    
    // Interactive states only if card is interactive
    const {
      stickerStyles,
      interactiveClasses,
      eventListeners,
      accessibilityAttrs
    } = useInteractiveStates({
      shadowSize: effectiveShadowSize.value,
      disabled: computed(() => !props.interactive),
      trackFocus: props.interactive,
      trackHover: props.interactive,
      trackActive: props.interactive
    })
    
    /**
     * Generate card classes based on props and state
     */
    const cardClasses = computed(() => {
      const classes = [
        'd-card',
        `d-card--${props.variant}`,
        `d-card--${props.size}`,
        ...(props.interactive ? interactiveClasses.value : [])
      ]
      
      if (props.interactive) classes.push('d-card--interactive')
      if (props.bordered) classes.push('d-card--bordered')
      
      return classes
    })
    
    /**
     * Generate card styles combining sticker effects for interactive cards
     */
    const cardStyles = computed(() => {
      if (!props.interactive) {
        // Static shadow for non-interactive cards
        const shadowMap = {
          sm: 'var(--d-shadow-sm)',
          md: 'var(--d-shadow-md)',
          lg: 'var(--d-shadow-lg)'
        }
        return {
          boxShadow: shadowMap[effectiveShadowSize.value]
        }
      }
      
      return {
        ...stickerStyles.value
      }
    })
    
    /**
     * Handle click events for interactive cards
     */
    const handleClick = (event) => {
      if (!props.interactive) return
      
      emit('click', event)
    }
    
    return {
      cardRef,
      cardClasses,
      cardStyles,
      eventListeners: props.interactive ? eventListeners : {},
      accessibilityAttrs: props.interactive ? accessibilityAttrs : {},
      handleClick
    }
  }
})
</script>

<style scoped>
.d-card {
  /* Base card styles */
  display: flex;
  flex-direction: column;
  
  /* Layout */
  border-radius: var(--d-radius-md);
  background-color: var(--d-bg-secondary);
  
  /* Typography */
  font-family: var(--d-font-family);
  color: var(--d-text-primary);
  
  /* Transitions for interactive cards */
  transition: all 0.15s ease-out;
  
  /* Prevent text selection for interactive cards */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Border styles */
.d-card--bordered {
  border: var(--d-border-width-thick) solid var(--d-border);
}

/* Size variations */
.d-card--sm {
  border-radius: var(--d-radius-sm);
}

.d-card--sm .d-card__header,
.d-card--sm .d-card__content,
.d-card--sm .d-card__footer {
  padding: var(--d-spacing-xs);
}

.d-card--md .d-card__header,
.d-card--md .d-card__content,
.d-card--md .d-card__footer {
  padding: var(--d-spacing-sm);
}

.d-card--lg {
  border-radius: var(--d-radius-lg);
}

.d-card--lg .d-card__header,
.d-card--lg .d-card__content,
.d-card--lg .d-card__footer {
  padding: var(--d-spacing-md);
}

/* Variant styles */
.d-card--default {
  background-color: var(--d-bg-secondary);
}

.d-card--accent-yellow {
  background-color: var(--d-accent-yellow);
}

.d-card--accent-pink {
  background-color: var(--d-accent-pink);
  color: var(--d-bg-secondary);
}

.d-card--secondary {
  background-color: var(--d-bg-primary);
}

/* Interactive card styles */
.d-card--interactive {
  cursor: pointer;
}

.d-card--interactive.d-hovered {
  transform: translateY(-1px);
}

.d-card--interactive.d-pressed {
  transform: translate(2px, 2px);
}

/* Card sections */
.d-card__header {
  border-bottom: var(--d-border-width-thin) solid var(--d-border);
}

.d-card__content {
  flex: 1;
}

.d-card__footer {
  border-top: var(--d-border-width-thin) solid var(--d-border);
}

/* Title styles */
.d-card__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: var(--d-font-weight-bold);
  line-height: 1.2;
}

/* Variant-specific section borders */
.d-card--accent-pink .d-card__header,
.d-card--accent-pink .d-card__footer {
  border-color: var(--d-bg-secondary);
}

/* Focus styles for interactive cards */
.d-card--interactive:focus-visible {
  outline: var(--d-border-width-thick) solid var(--d-text-primary);
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .d-card {
    transition: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .d-card--bordered {
    border-width: 3px;
  }
  
  .d-card__header,
  .d-card__footer {
    border-width: 2px;
  }
}
</style>