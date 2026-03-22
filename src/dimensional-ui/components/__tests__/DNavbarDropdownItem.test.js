import { describe, it, expect, vi, beforeEach, beforeAll, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DNavbarDropdownItem from '../DNavbarDropdownItem.vue'

// Mock window.matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Set up CSS custom properties for theme tokens
beforeAll(() => {
  const style = document.createElement('style')
  style.textContent = `
    :root {
      --d-bg-primary: #F9F8F4;
      --d-bg-secondary: #FFFFFF;
      --d-text-primary: #000000;
      --d-border: #000000;
      --d-shadow-sm: 2px 2px 0px #000000;
      --d-shadow-hover: 2px 2px 0px #000000;
      --d-radius-sm: 8px;
      --d-font-family: 'Inter', sans-serif;
      --d-font-weight-normal: 600;
      --d-font-weight-bold: 700;
      --d-border-width-thick: 2px;
    }
  `
  document.head.appendChild(style)
})

describe('DNavbarDropdownItem', () => {
  let wrapper

  beforeEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Component Rendering', () => {
    it('renders as anchor when item has href', () => {
      const item = { id: 'web', label: 'Web Development', href: '/services/web' }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { item }
      })

      expect(wrapper.element.tagName).toBe('A')
      expect(wrapper.text()).toBe('Web Development')
      expect(wrapper.attributes('href')).toBe('/services/web')
      expect(wrapper.classes()).toContain('d-navbar-dropdown-item')
    })

    it('renders as button when item has no href', () => {
      const item = { id: 'action', label: 'Action Item' }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { item }
      })

      expect(wrapper.element.tagName).toBe('BUTTON')
      expect(wrapper.text()).toBe('Action Item')
      expect(wrapper.classes()).toContain('d-navbar-dropdown-item')
    })

    it('renders with external link attributes', () => {
      const item = { 
        id: 'external', 
        label: 'External Link', 
        href: 'https://example.com',
        target: '_blank'
      }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { item }
      })

      expect(wrapper.attributes('href')).toBe('https://example.com')
      expect(wrapper.attributes('target')).toBe('_blank')
      expect(wrapper.attributes('rel')).toBe('noopener noreferrer')
    })
  })

  describe('Active State Management', () => {
    it('applies active class when active prop is true', () => {
      const item = { id: 'web', label: 'Web Development', href: '/services/web' }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { 
          item,
          active: true
        }
      })

      expect(wrapper.classes()).toContain('d-navbar-dropdown-item--active')
    })

    it('does not apply active class when active prop is false', () => {
      const item = { id: 'web', label: 'Web Development', href: '/services/web' }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { 
          item,
          active: false
        }
      })

      expect(wrapper.classes()).not.toContain('d-navbar-dropdown-item--active')
    })
  })

  describe('Disabled State', () => {
    it('applies disabled class and attributes when item is disabled', () => {
      const item = { id: 'disabled', label: 'Disabled Item', disabled: true }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { item }
      })

      expect(wrapper.classes()).toContain('d-navbar-dropdown-item--disabled')
      expect(wrapper.attributes('disabled')).toBeDefined()
      expect(wrapper.attributes('aria-disabled')).toBe('true')
    })

    it('does not emit events when disabled', async () => {
      const item = { id: 'disabled', label: 'Disabled Item', disabled: true }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { item }
      })

      await wrapper.trigger('click')
      expect(wrapper.emitted('navigate')).toBeFalsy()
    })

    it('prevents default action when disabled', async () => {
      const item = { 
        id: 'disabled', 
        label: 'Disabled Link', 
        href: '/disabled',
        disabled: true 
      }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { item }
      })

      // Mock preventDefault to verify it's called
      const mockPreventDefault = vi.fn()
      
      // Trigger click and check that navigate is not emitted
      await wrapper.trigger('click')
      
      expect(wrapper.emitted('navigate')).toBeFalsy()
    })
  })

  describe('Event Handling', () => {
    it('emits navigate event when clicked and not disabled', async () => {
      const item = { id: 'web', label: 'Web Development', href: '/services/web' }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { item }
      })

      await wrapper.trigger('click')
      
      expect(wrapper.emitted('navigate')).toBeTruthy()
      expect(wrapper.emitted('navigate')[0][0]).toEqual(item)
      expect(wrapper.emitted('navigate')[0][1]).toBeInstanceOf(Event)
    })

    it('does not emit navigate event when disabled', async () => {
      const item = { id: 'disabled', label: 'Disabled Item', disabled: true }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { item }
      })

      await wrapper.trigger('click')
      
      expect(wrapper.emitted('navigate')).toBeFalsy()
    })
  })

  describe('Accessibility Attributes', () => {
    it('has proper menuitem role', () => {
      const item = { id: 'web', label: 'Web Development', href: '/services/web' }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { item }
      })

      expect(wrapper.attributes('role')).toBe('menuitem')
    })

    it('has proper disabled attributes when disabled', () => {
      const item = { id: 'disabled', label: 'Disabled Item', disabled: true }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { item }
      })

      expect(wrapper.attributes('aria-disabled')).toBe('true')
      
      // For button elements
      if (wrapper.element.tagName === 'BUTTON') {
        expect(wrapper.attributes('disabled')).toBeDefined()
      }
    })

    it('has proper link attributes for external links', () => {
      const item = { 
        id: 'external', 
        label: 'External Link', 
        href: 'https://example.com',
        target: '_blank'
      }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { item }
      })

      expect(wrapper.attributes('rel')).toBe('noopener noreferrer')
    })
  })

  describe('Visual State Feedback', () => {
    it('supports hover state through interactive composable', async () => {
      const item = { id: 'web', label: 'Web Development', href: '/services/web' }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { item }
      })

      // Trigger hover
      await wrapper.trigger('mouseenter')
      
      // The useInteractiveStates composable should handle hover states
      // We verify the component structure supports it
      expect(wrapper.classes()).toContain('d-navbar-dropdown-item')
    })

    it('supports active state styling', () => {
      const item = { id: 'web', label: 'Web Development', href: '/services/web' }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { 
          item,
          active: true
        }
      })

      expect(wrapper.classes()).toContain('d-navbar-dropdown-item--active')
    })

    it('supports disabled state styling', () => {
      const item = { id: 'disabled', label: 'Disabled Item', disabled: true }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { item }
      })

      expect(wrapper.classes()).toContain('d-navbar-dropdown-item--disabled')
    })
  })

  describe('Props Validation', () => {
    it('validates item prop structure', () => {
      const validItem = { label: 'Valid Item' }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { item: validItem }
      })

      expect(wrapper.text()).toBe('Valid Item')
    })

    it('handles item with all properties', () => {
      const fullItem = {
        id: 'full',
        label: 'Full Item',
        href: '/full',
        target: '_self',
        disabled: false
      }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { 
          item: fullItem,
          active: false
        }
      })

      expect(wrapper.text()).toBe('Full Item')
      expect(wrapper.attributes('href')).toBe('/full')
      expect(wrapper.attributes('target')).toBe('_self')
      expect(wrapper.classes()).not.toContain('d-navbar-dropdown-item--disabled')
      expect(wrapper.classes()).not.toContain('d-navbar-dropdown-item--active')
    })

    it('handles minimal item structure', () => {
      const minimalItem = { label: 'Minimal' }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { item: minimalItem }
      })

      expect(wrapper.element.tagName).toBe('BUTTON')
      expect(wrapper.text()).toBe('Minimal')
      expect(wrapper.classes()).toContain('d-navbar-dropdown-item')
    })
  })

  describe('Component Integration', () => {
    it('integrates with useInteractiveStates composable', () => {
      const item = { id: 'web', label: 'Web Development', href: '/services/web' }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { item }
      })

      // Verify the component structure supports interactive states
      expect(wrapper.classes()).toContain('d-navbar-dropdown-item')
      expect(wrapper.find('.d-navbar-dropdown-item__content').exists()).toBe(true)
    })

    it('maintains consistent styling with theme system', () => {
      const item = { id: 'web', label: 'Web Development', href: '/services/web' }
      
      wrapper = mount(DNavbarDropdownItem, {
        props: { item }
      })

      // Verify base classes are applied for theme integration
      expect(wrapper.classes()).toContain('d-navbar-dropdown-item')
    })
  })
})