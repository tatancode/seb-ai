<template>
  <div :class="wrapperClasses">
    <!-- Label -->
    <label 
      v-if="label || $slots.label" 
      :for="inputId" 
      class="d-input__label"
    >
      <slot name="label">{{ label }}</slot>
      <span v-if="required" class="d-input__required" aria-label="required">*</span>
    </label>
    
    <!-- Input wrapper for styling -->
    <div 
      :class="inputWrapperClasses"
      :style="inputWrapperStyles"
    >
      <!-- Prefix slot -->
      <div v-if="$slots.prefix" class="d-input__prefix">
        <slot name="prefix" />
      </div>
      
      <!-- Input element -->
      <input
        :id="inputId"
        ref="inputRef"
        :class="inputClasses"
        :type="type"
        :name="name"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :maxlength="maxlength"
        :minlength="minlength"
        :min="min"
        :max="max"
        :step="step"
        v-bind="accessibilityAttrs"
        v-on="eventListeners"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <!-- Suffix slot -->
      <div v-if="$slots.suffix" class="d-input__suffix">
        <slot name="suffix" />
      </div>
    </div>
    
    <!-- Help text or error message -->
    <div v-if="helpText || errorMessage || $slots.help" class="d-input__help">
      <slot name="help">
        <span v-if="errorMessage" class="d-input__error">{{ errorMessage }}</span>
        <span v-else-if="helpText" class="d-input__help-text">{{ helpText }}</span>
      </slot>
    </div>
  </div>
</template>

<script>
import { ref, computed, defineComponent, nextTick } from 'vue'
import { useInteractiveStates } from '../composables/useInteractiveStates.js'
import { useTheme } from '../composables/useTheme.js'

let inputIdCounter = 0

export default defineComponent({
  name: 'DInput',
  props: {
    /**
     * Input value (v-model)
     */
    modelValue: {
      type: [String, Number],
      default: ''
    },
    
    /**
     * Input type
     */
    type: {
      type: String,
      default: 'text',
      validator: (value) => [
        'text', 'email', 'password', 'number', 'tel', 'url', 'search'
      ].includes(value)
    },
    
    /**
     * Input name attribute
     */
    name: {
      type: String,
      default: ''
    },

    /**
     * Input label
     */
    label: {
      type: String,
      default: ''
    },
    
    /**
     * Input placeholder
     */
    placeholder: {
      type: String,
      default: ''
    },
    
    /**
     * Help text displayed below input
     */
    helpText: {
      type: String,
      default: ''
    },
    
    /**
     * Error message (overrides help text)
     */
    errorMessage: {
      type: String,
      default: ''
    },
    
    /**
     * Input size
     */
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    
    /**
     * Input variant
     */
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'accent-yellow', 'accent-pink'].includes(value)
    },
    
    /**
     * Disabled state
     */
    disabled: {
      type: Boolean,
      default: false
    },
    
    /**
     * Readonly state
     */
    readonly: {
      type: Boolean,
      default: false
    },
    
    /**
     * Required field
     */
    required: {
      type: Boolean,
      default: false
    },
    
    /**
     * Full width input
     */
    fullWidth: {
      type: Boolean,
      default: false
    },
    
    /**
     * Autocomplete attribute
     */
    autocomplete: {
      type: String,
      default: ''
    },
    
    /**
     * Maximum length
     */
    maxlength: {
      type: [String, Number],
      default: null
    },
    
    /**
     * Minimum length
     */
    minlength: {
      type: [String, Number],
      default: null
    },
    
    /**
     * Minimum value (for number inputs)
     */
    min: {
      type: [String, Number],
      default: null
    },
    
    /**
     * Maximum value (for number inputs)
     */
    max: {
      type: [String, Number],
      default: null
    },
    
    /**
     * Step value (for number inputs)
     */
    step: {
      type: [String, Number],
      default: null
    }
  },
  
  emits: ['update:modelValue', 'input', 'change', 'focus', 'blur'],
  
  setup(props, { emit }) {
    const inputRef = ref(null)
    const inputId = `d-input-${++inputIdCounter}`
    const { prefersReducedMotion } = useTheme()
    
    // Interactive states for the input wrapper
    const {
      stickerStyles,
      interactiveClasses,
      eventListeners,
      accessibilityAttrs
    } = useInteractiveStates({
      shadowSize: props.size === 'lg' ? 'md' : 'sm',
      disabled: computed(() => props.disabled || props.readonly),
      trackFocus: true,
      trackHover: true,
      trackActive: false // Don't track active for inputs
    })
    
    /**
     * Check if input has error state
     */
    const hasError = computed(() => !!props.errorMessage)
    
    /**
     * Generate wrapper classes
     */
    const wrapperClasses = computed(() => {
      const classes = [
        'd-input-wrapper',
        `d-input-wrapper--${props.size}`
      ]
      
      if (props.fullWidth) classes.push('d-input-wrapper--full-width')
      if (hasError.value) classes.push('d-input-wrapper--error')
      if (props.disabled) classes.push('d-input-wrapper--disabled')
      if (props.readonly) classes.push('d-input-wrapper--readonly')
      
      return classes
    })
    
    /**
     * Generate input wrapper classes (the styled container)
     */
    const inputWrapperClasses = computed(() => {
      const classes = [
        'd-input',
        `d-input--${props.variant}`,
        `d-input--${props.size}`,
        ...interactiveClasses.value
      ]
      
      if (hasError.value) classes.push('d-input--error')
      if (props.disabled) classes.push('d-input--disabled')
      if (props.readonly) classes.push('d-input--readonly')
      
      return classes
    })
    
    /**
     * Generate input element classes
     */
    const inputClasses = computed(() => {
      return ['d-input__field']
    })
    
    /**
     * Generate input wrapper styles with sticker effects
     */
    const inputWrapperStyles = computed(() => {
      return {
        ...stickerStyles.value
      }
    })
    
    /**
     * Handle input events
     */
    const handleInput = (event) => {
      const value = event.target.value
      emit('update:modelValue', value)
      emit('input', event)
    }
    
    const handleChange = (event) => {
      emit('change', event)
    }
    
    const handleFocus = (event) => {
      emit('focus', event)
    }
    
    const handleBlur = (event) => {
      emit('blur', event)
    }
    
    /**
     * Focus the input programmatically
     */
    const focus = () => {
      nextTick(() => {
        if (inputRef.value) {
          inputRef.value.focus()
        }
      })
    }
    
    /**
     * Blur the input programmatically
     */
    const blur = () => {
      if (inputRef.value) {
        inputRef.value.blur()
      }
    }
    
    return {
      inputRef,
      inputId,
      wrapperClasses,
      inputWrapperClasses,
      inputClasses,
      inputWrapperStyles,
      eventListeners,
      accessibilityAttrs,
      hasError,
      handleInput,
      handleChange,
      handleFocus,
      handleBlur,
      focus,
      blur
    }
  }
})
</script>

<style scoped>
.d-input-wrapper {
  /* Base wrapper styles */
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  /* Typography */
  font-family: var(--d-font-family);
}

.d-input-wrapper--full-width {
  width: 100%;
}

/* Label styles */
.d-input__label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  font-size: 0.875rem;
  font-weight: var(--d-font-weight-bold);
  color: var(--d-text-primary);
  line-height: 1.2;
  
  cursor: pointer;
}

.d-input__required {
  color: var(--d-accent-red);
  font-weight: var(--d-font-weight-bold);
}

/* Input container styles */
.d-input {
  /* Layout */
  display: flex;
  align-items: center;
  position: relative;
  
  /* Styling */
  border: var(--d-border-width-thick) solid var(--d-border);
  border-radius: var(--d-radius-md);
  background-color: var(--d-bg-secondary);
  
  /* Transitions */
  transition: all 0.15s ease-out;
  
  /* Prevent text selection on wrapper */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Size variations */
.d-input--sm {
  border-radius: var(--d-radius-sm);
  min-height: 2rem;
}

.d-input--md {
  min-height: 2.5rem;
}

.d-input--lg {
  border-radius: var(--d-radius-lg);
  min-height: 3rem;
}

/* Variant styles */
.d-input--default {
  background-color: var(--d-bg-secondary);
}

.d-input--accent-yellow {
  background-color: var(--d-accent-yellow);
}

.d-input--accent-pink {
  background-color: var(--d-accent-pink);
}

/* Interactive states */
.d-input.d-hovered:not(.d-input--disabled):not(.d-input--readonly) {
  transform: translateY(-1px);
}

.d-input.d-focused:not(.d-input--disabled):not(.d-input--readonly) {
  outline: var(--d-border-width-thick) solid var(--d-text-primary);
  outline-offset: 2px;
}

/* Input field styles */
.d-input__field {
  /* Layout */
  flex: 1;
  width: 100%;
  
  /* Remove default styles */
  border: none;
  outline: none;
  background: transparent;
  
  /* Typography */
  font-family: inherit;
  font-size: 1rem;
  font-weight: var(--d-font-weight-normal);
  color: var(--d-text-primary);
  line-height: 1.5;
  
  /* Allow text selection in input */
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

.d-input--sm .d-input__field {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.d-input--md .d-input__field {
  padding: 0.75rem 1rem;
  font-size: 1rem;
}

.d-input--lg .d-input__field {
  padding: 1rem 1.25rem;
  font-size: 1.125rem;
}

/* Placeholder styles */
.d-input__field::placeholder {
  color: var(--d-text-primary);
  opacity: 0.6;
}

/* Prefix and suffix styles */
.d-input__prefix,
.d-input__suffix {
  display: flex;
  align-items: center;
  color: var(--d-text-primary);
  opacity: 0.7;
}

.d-input--sm .d-input__prefix,
.d-input--sm .d-input__suffix {
  padding: 0 0.75rem;
  font-size: 0.875rem;
}

.d-input--md .d-input__prefix,
.d-input--md .d-input__suffix {
  padding: 0 1rem;
  font-size: 1rem;
}

.d-input--lg .d-input__prefix,
.d-input--lg .d-input__suffix {
  padding: 0 1.25rem;
  font-size: 1.125rem;
}

/* Variant-specific text colors */
.d-input--accent-pink .d-input__field,
.d-input--accent-pink .d-input__prefix,
.d-input--accent-pink .d-input__suffix {
  color: var(--d-bg-secondary);
}

.d-input--accent-pink .d-input__field::placeholder {
  color: var(--d-bg-secondary);
  opacity: 0.8;
}

/* State styles */
.d-input--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none !important;
  transform: none !important;
}

.d-input--disabled .d-input__field {
  cursor: not-allowed;
}

.d-input--readonly {
  cursor: default;
}

.d-input--readonly .d-input__field {
  cursor: default;
}

.d-input--error {
  border-color: var(--d-accent-red);
}

/* Help text styles */
.d-input__help {
  font-size: 0.75rem;
  line-height: 1.3;
}

.d-input__help-text {
  color: var(--d-text-primary);
  opacity: 0.7;
}

.d-input__error {
  color: var(--d-accent-red);
  font-weight: var(--d-font-weight-bold);
}

/* Error state for wrapper */
.d-input-wrapper--error .d-input__label {
  color: var(--d-accent-red);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .d-input {
    transition: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .d-input {
    border-width: 3px;
  }
  
  .d-input.d-focused {
    outline-width: 3px;
  }
}

/* Autofill styles */
.d-input__field:-webkit-autofill,
.d-input__field:-webkit-autofill:hover,
.d-input__field:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px var(--d-bg-secondary) inset;
  -webkit-text-fill-color: var(--d-text-primary);
}

.d-input--accent-yellow .d-input__field:-webkit-autofill,
.d-input--accent-yellow .d-input__field:-webkit-autofill:hover,
.d-input--accent-yellow .d-input__field:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px var(--d-accent-yellow) inset;
}

.d-input--accent-pink .d-input__field:-webkit-autofill,
.d-input--accent-pink .d-input__field:-webkit-autofill:hover,
.d-input--accent-pink .d-input__field:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px var(--d-accent-pink) inset;
  -webkit-text-fill-color: var(--d-bg-secondary);
}
</style>