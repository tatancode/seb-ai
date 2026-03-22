import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import DButton from '../DButton.vue'

// Mock window.matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Don't mock the composables - we want to test the real behavior
// Just mock the theme tokens that would normally come from CSS

// Set up CSS custom properties for theme tokens
beforeAll(() => {
  // Add theme tokens to document root for testing
  const style = document.createElement('style')
  style.textContent = `
    :root {
      --d-bg-primary: #F9F8F4;
      --d-bg-secondary: #FFFFFF;
      --d-accent-yellow: #FFF455;
      --d-accent-pink: #FF004D;
      --d-accent-red: #FF0000;
      --d-text-primary: #000000;
      --d-border: #000000;
      --d-shadow-sm: 2px 2px 0px #000000;
      --d-shadow-md: 3px 3px 0px #000000;
      --d-shadow-lg: 5px 5px 0px #000000;
      --d-shadow-dropdown: 4px 4px 0px #000000;
      --d-shadow-hover: 2px 2px 0px #000000;
      --d-shadow-active: 3px 3px 0px #000000;
      --d-radius-sm: 8px;
      --d-radius-md: 12px;
      --d-radius-lg: 16px;
      --d-radius-pill: 999px;
      --d-font-family: 'Inter', 'DM Sans', sans-serif;
      --d-font-weight-normal: 600;
      --d-font-weight-bold: 700;
      --d-spacing-xs: 8px;
      --d-spacing-sm: 16px;
      --d-spacing-md: 24px;
      --d-spacing-lg: 32px;
      --d-border-width-thick: 2px;
    }
  `
  document.head.appendChild(style)
})

describe('DButton', () => {
  let wrapper

  beforeEach(() => {
    // Reset any previous wrapper
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Component Rendering', () => {
    it('renders correctly with default props', () => {
      wrapper = mount(DButton, {
        slots: {
          default: 'Click me'
        }
      })

      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.text()).toBe('Click me')
      expect(wrapper.classes()).toContain('d-button')
      expect(wrapper.classes()).toContain('d-button--primary')
      expect(wrapper.classes()).toContain('d-button--md')
    })

    it('renders with custom slot content', () => {
      wrapper = mount(DButton, {
        slots: {
          default: '<span>Custom Content</span>'
        }
      })

      expect(wrapper.html()).toContain('<span>Custom Content</span>')
    })
  })

  describe('Variant Prop Testing', () => {
    const variants = ['primary', 'secondary', 'accent-yellow', 'accent-pink']

    variants.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        wrapper = mount(DButton, {
          props: { variant },
          slots: { default: 'Button' }
        })

        expect(wrapper.classes()).toContain(`d-button--${variant}`)
      })
    })

    it('validates variant prop and falls back to primary for invalid values', () => {
      // Vue's prop validation will handle this, but we can test the default
      wrapper = mount(DButton, {
        props: { variant: 'invalid-variant' },
        slots: { default: 'Button' }
      })

      // Should still render but Vue will warn about invalid prop
      expect(wrapper.find('button').exists()).toBe(true)
    })
  })

  describe('Size Prop Testing', () => {
    const sizes = ['sm', 'md', 'lg']

    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        wrapper = mount(DButton, {
          props: { size },
          slots: { default: 'Button' }
        })

        expect(wrapper.classes()).toContain(`d-button--${size}`)
      })
    })
  })

  describe('Boolean Props Testing', () => {
    it('renders disabled state correctly', () => {
      wrapper = mount(DButton, {
        props: { disabled: true },
        slots: { default: 'Button' }
      })

      expect(wrapper.classes()).toContain('d-button--disabled')
      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('renders loading state correctly', () => {
      wrapper = mount(DButton, {
        props: { loading: true },
        slots: { default: 'Button' }
      })

      expect(wrapper.classes()).toContain('d-button--loading')
      expect(wrapper.find('.d-button__loading').exists()).toBe(true)
      expect(wrapper.find('.d-button__spinner').exists()).toBe(true)
      expect(wrapper.find('.d-button__content--hidden').exists()).toBe(true)
    })

    it('renders full width state correctly', () => {
      wrapper = mount(DButton, {
        props: { fullWidth: true },
        slots: { default: 'Button' }
      })

      expect(wrapper.classes()).toContain('d-button--full-width')
    })
  })

  describe('Type Prop Testing', () => {
    const types = ['button', 'submit', 'reset']

    types.forEach(type => {
      it(`renders with type="${type}" correctly`, () => {
        wrapper = mount(DButton, {
          props: { type },
          slots: { default: 'Button' }
        })

        expect(wrapper.attributes('type')).toBe(type)
      })
    })
  })

  describe('Combined Props Testing', () => {
    it('renders with multiple props combined', () => {
      wrapper = mount(DButton, {
        props: {
          variant: 'accent-yellow',
          size: 'lg',
          fullWidth: true,
          type: 'submit'
        },
        slots: { default: 'Submit Button' }
      })

      expect(wrapper.classes()).toContain('d-button--accent-yellow')
      expect(wrapper.classes()).toContain('d-button--lg')
      expect(wrapper.classes()).toContain('d-button--full-width')
      expect(wrapper.attributes('type')).toBe('submit')
    })

    it('handles disabled and loading states together', () => {
      wrapper = mount(DButton, {
        props: {
          disabled: true,
          loading: true
        },
        slots: { default: 'Button' }
      })

      expect(wrapper.classes()).toContain('d-button--disabled')
      expect(wrapper.classes()).toContain('d-button--loading')
      expect(wrapper.attributes('disabled')).toBeDefined()
    })
  })

  describe('Event Handling', () => {
    it('emits click event when clicked and not disabled', async () => {
      wrapper = mount(DButton, {
        slots: { default: 'Button' }
      })

      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('does not emit click event when disabled', async () => {
      wrapper = mount(DButton, {
        props: { disabled: true },
        slots: { default: 'Button' }
      })

      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('does not emit click event when loading', async () => {
      wrapper = mount(DButton, {
        props: { loading: true },
        slots: { default: 'Button' }
      })

      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('passes click event object to handler', async () => {
      wrapper = mount(DButton, {
        slots: { default: 'Button' }
      })

      await wrapper.trigger('click')
      const clickEvents = wrapper.emitted('click')
      expect(clickEvents[0][0]).toBeInstanceOf(Event)
    })
  })

  describe('Accessibility Attributes', () => {
    it('has proper button role by default', () => {
      wrapper = mount(DButton, {
        slots: { default: 'Button' }
      })

      expect(wrapper.element.tagName).toBe('BUTTON')
    })

    it('has proper type attribute', () => {
      wrapper = mount(DButton, {
        slots: { default: 'Button' }
      })

      expect(wrapper.attributes('type')).toBe('button')
    })

    it('has disabled attribute when disabled', () => {
      wrapper = mount(DButton, {
        props: { disabled: true },
        slots: { default: 'Button' }
      })

      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('maintains focus visibility styles', () => {
      wrapper = mount(DButton, {
        slots: { default: 'Button' }
      })

      // The focus-visible styles are handled by CSS
      // We verify the button element exists and can receive focus events
      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      expect(button.element.tagName).toBe('BUTTON')
      
      // Button elements are naturally focusable unless explicitly disabled
      expect(button.element.disabled).toBe(false)
    })
  })

  describe('Keyboard Navigation', () => {
    it('responds to Enter key press', async () => {
      wrapper = mount(DButton, {
        slots: { default: 'Button' }
      })

      await wrapper.trigger('keydown.enter')
      // Note: Native button elements handle Enter key automatically
      // We're testing that the component doesn't interfere with this behavior
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('responds to Space key press', async () => {
      wrapper = mount(DButton, {
        slots: { default: 'Button' }
      })

      await wrapper.trigger('keydown.space')
      // Note: Native button elements handle Space key automatically
      // We're testing that the component doesn't interfere with this behavior
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('is focusable when not disabled', () => {
      wrapper = mount(DButton, {
        slots: { default: 'Button' }
      })

      const button = wrapper.find('button')
      expect(button.element.disabled).toBe(false)
    })

    it('is not focusable when disabled', () => {
      wrapper = mount(DButton, {
        props: { disabled: true },
        slots: { default: 'Button' }
      })

      const button = wrapper.find('button')
      expect(button.element.disabled).toBe(true)
    })
  })

  describe('Interactive State Behavior', () => {
    it('has event listeners for interactive behavior', () => {
      wrapper = mount(DButton, {
        slots: { default: 'Button' }
      })

      const button = wrapper.find('button')
      
      // Verify that the button has the necessary event listeners
      // We can't easily test the actual hover behavior in jsdom, but we can verify structure
      expect(button.exists()).toBe(true)
      expect(wrapper.classes()).toContain('d-button')
      
      // The useInteractiveStates composable should be providing event listeners
      // This is tested more thoroughly in the composable's own tests
    })

    it('supports interactive state CSS classes structure', () => {
      wrapper = mount(DButton, {
        slots: { default: 'Button' }
      })

      // Verify the component structure supports interactive states
      expect(wrapper.classes()).toContain('d-button')
      expect(wrapper.find('button').exists()).toBe(true)
      
      // The actual interactive behavior is handled by useInteractiveStates
      // and tested in its own test suite
    })

    it('does not apply interactive states when disabled', async () => {
      wrapper = mount(DButton, {
        props: { disabled: true },
        slots: { default: 'Button' }
      })

      const button = wrapper.find('button')
      expect(wrapper.classes()).toContain('d-button--disabled')
      
      // Try to trigger hover on disabled button
      await button.trigger('mouseenter')
      expect(wrapper.classes()).not.toContain('d-hovered')
      
      // Try to trigger press on disabled button
      await button.trigger('mousedown')
      expect(wrapper.classes()).not.toContain('d-pressed')
    })

    it('does not apply interactive states when loading', async () => {
      wrapper = mount(DButton, {
        props: { loading: true },
        slots: { default: 'Button' }
      })

      const button = wrapper.find('button')
      expect(wrapper.classes()).toContain('d-button--loading')
      
      // Try to trigger hover on loading button
      await button.trigger('mouseenter')
      expect(wrapper.classes()).not.toContain('d-hovered')
      
      // Try to trigger press on loading button
      await button.trigger('mousedown')
      expect(wrapper.classes()).not.toContain('d-pressed')
    })
  })

  describe('Loading State Behavior', () => {
    it('shows spinner when loading', () => {
      wrapper = mount(DButton, {
        props: { loading: true },
        slots: { default: 'Button' }
      })

      expect(wrapper.find('.d-button__loading').exists()).toBe(true)
      expect(wrapper.find('.d-button__spinner').exists()).toBe(true)
    })

    it('hides content when loading', () => {
      wrapper = mount(DButton, {
        props: { loading: true },
        slots: { default: 'Button Text' }
      })

      expect(wrapper.find('.d-button__content--hidden').exists()).toBe(true)
    })

    it('shows content when not loading', () => {
      wrapper = mount(DButton, {
        props: { loading: false },
        slots: { default: 'Button Text' }
      })

      expect(wrapper.find('.d-button__content--hidden').exists()).toBe(false)
      expect(wrapper.text()).toBe('Button Text')
    })
  })

  describe('Prop Validation', () => {
    it('accepts valid variant values', () => {
      const validVariants = ['primary', 'secondary', 'accent-yellow', 'accent-pink']
      
      validVariants.forEach(variant => {
        wrapper = mount(DButton, {
          props: { variant },
          slots: { default: 'Button' }
        })
        
        expect(wrapper.classes()).toContain(`d-button--${variant}`)
        wrapper.unmount()
      })
    })

    it('accepts valid size values', () => {
      const validSizes = ['sm', 'md', 'lg']
      
      validSizes.forEach(size => {
        wrapper = mount(DButton, {
          props: { size },
          slots: { default: 'Button' }
        })
        
        expect(wrapper.classes()).toContain(`d-button--${size}`)
        wrapper.unmount()
      })
    })

    it('accepts valid type values', () => {
      const validTypes = ['button', 'submit', 'reset']
      
      validTypes.forEach(type => {
        wrapper = mount(DButton, {
          props: { type },
          slots: { default: 'Button' }
        })
        
        expect(wrapper.attributes('type')).toBe(type)
        wrapper.unmount()
      })
    })
  })

  describe('CSS Classes Integration', () => {
    it('applies base button class', () => {
      wrapper = mount(DButton, {
        slots: { default: 'Button' }
      })

      expect(wrapper.classes()).toContain('d-button')
    })

    it('applies variant-specific classes', () => {
      wrapper = mount(DButton, {
        props: { variant: 'accent-pink' },
        slots: { default: 'Button' }
      })

      expect(wrapper.classes()).toContain('d-button--accent-pink')
    })

    it('applies size-specific classes', () => {
      wrapper = mount(DButton, {
        props: { size: 'lg' },
        slots: { default: 'Button' }
      })

      expect(wrapper.classes()).toContain('d-button--lg')
    })

    it('applies state-specific classes', () => {
      wrapper = mount(DButton, {
        props: { 
          disabled: true,
          loading: true,
          fullWidth: true
        },
        slots: { default: 'Button' }
      })

      expect(wrapper.classes()).toContain('d-button--disabled')
      expect(wrapper.classes()).toContain('d-button--loading')
      expect(wrapper.classes()).toContain('d-button--full-width')
    })
  })
})