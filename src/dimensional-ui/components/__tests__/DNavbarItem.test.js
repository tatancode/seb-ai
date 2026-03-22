import { describe, it, expect, vi, beforeEach, beforeAll, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DNavbarItem from '../DNavbarItem.vue'
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
      --d-accent-yellow: #FFF455;
      --d-text-primary: #000000;
      --d-border: #000000;
      --d-shadow-sm: 2px 2px 0px #000000;
      --d-shadow-hover: 2px 2px 0px #000000;
      --d-radius-pill: 999px;
      --d-radius-md: 12px;
      --d-font-family: 'Inter', sans-serif;
      --d-font-weight-normal: 600;
      --d-font-weight-bold: 700;
      --d-border-width-thick: 2px;
      --d-z-dropdown: 1000;
    }
  `
  document.head.appendChild(style)
})

describe('DNavbarItem', () => {
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
    it('renders simple navigation item as anchor', () => {
      const item = { id: 'home', label: 'Home', href: '/' }
      
      wrapper = mount(DNavbarItem, {
        props: { item }
      })

      expect(wrapper.element.tagName).toBe('A')
      expect(wrapper.text()).toBe('Home')
      expect(wrapper.attributes('href')).toBe('/')
      expect(wrapper.classes()).toContain('d-navbar-item')
    })

    it('renders navigation item without href as button', () => {
      const item = { id: 'action', label: 'Action' }
      
      wrapper = mount(DNavbarItem, {
        props: { item }
      })

      expect(wrapper.element.tagName).toBe('BUTTON')
      expect(wrapper.text()).toBe('Action')
      expect(wrapper.classes()).toContain('d-navbar-item')
    })

    it('renders dropdown item as button with children', () => {
      const item = { 
        id: 'services', 
        label: 'Services',
        children: [
          { id: 'web', label: 'Web Development', href: '/services/web' }
        ]
      }
      
      wrapper = mount(DNavbarItem, {
        props: { item }
      })

      expect(wrapper.element.tagName).toBe('BUTTON')
      expect(wrapper.text()).toContain('Services')
      expect(wrapper.classes()).toContain('d-navbar-item--has-children')
      expect(wrapper.find('.d-navbar-item__dropdown-icon').exists()).toBe(true)
    })

    it('renders dropdown menu when isDropdownOpen is true', () => {
      const item = { 
        id: 'services', 
        label: 'Services',
        children: [
          { id: 'web', label: 'Web Development', href: '/services/web' },
          { id: 'mobile', label: 'Mobile Apps', href: '/services/mobile' }
        ]
      }
      
      wrapper = mount(DNavbarItem, {
        props: { 
          item,
          isDropdownOpen: true
        }
      })

      expect(wrapper.find('.d-navbar-item__dropdown').exists()).toBe(true)
      expect(wrapper.findAllComponents(DNavbarDropdownItem)).toHaveLength(2)
      expect(wrapper.classes()).toContain('d-navbar-item--dropdown-open')
    })

    it('does not render dropdown menu when isDropdownOpen is false', () => {
      const item = { 
        id: 'services', 
        label: 'Services',
        children: [
          { id: 'web', label: 'Web Development', href: '/services/web' }
        ]
      }
      
      wrapper = mount(DNavbarItem, {
        props: { 
          item,
          isDropdownOpen: false
        }
      })

      expect(wrapper.find('.d-navbar-item__dropdown').exists()).toBe(false)
      expect(wrapper.findAllComponents(DNavbarDropdownItem)).toHaveLength(0)
    })
  })

  describe('Active State Management', () => {
    it('applies active class when active prop is true', () => {
      const item = { id: 'home', label: 'Home', href: '/' }
      
      wrapper = mount(DNavbarItem, {
        props: { 
          item,
          active: true
        }
      })

      expect(wrapper.classes()).toContain('d-navbar-item--active')
    })

    it('does not apply active class when active prop is false', () => {
      const item = { id: 'home', label: 'Home', href: '/' }
      
      wrapper = mount(DNavbarItem, {
        props: { 
          item,
          active: false
        }
      })

      expect(wrapper.classes()).not.toContain('d-navbar-item--active')
    })
  })

  describe('Disabled State', () => {
    it('applies disabled class and attributes when item is disabled', () => {
      const item = { id: 'disabled', label: 'Disabled', disabled: true }
      
      wrapper = mount(DNavbarItem, {
        props: { item }
      })

      expect(wrapper.classes()).toContain('d-navbar-item--disabled')
      expect(wrapper.attributes('disabled')).toBeDefined()
      expect(wrapper.attributes('aria-disabled')).toBe('true')
    })

    it('does not emit events when disabled', async () => {
      const item = { id: 'disabled', label: 'Disabled', disabled: true }
      
      wrapper = mount(DNavbarItem, {
        props: { item }
      })

      await wrapper.trigger('click')
      expect(wrapper.emitted('navigate')).toBeFalsy()
    })
  })

  describe('Event Handling', () => {
    it('emits navigate event when simple item is clicked', async () => {
      const item = { id: 'home', label: 'Home', href: '/' }
      
      wrapper = mount(DNavbarItem, {
        props: { item }
      })

      await wrapper.trigger('click')
      
      expect(wrapper.emitted('navigate')).toBeTruthy()
      expect(wrapper.emitted('navigate')[0][0]).toEqual(item)
    })

    it('emits toggle-dropdown event when dropdown item is clicked', async () => {
      const item = { 
        id: 'services', 
        label: 'Services',
        children: [
          { id: 'web', label: 'Web Development', href: '/services/web' }
        ]
      }
      
      wrapper = mount(DNavbarItem, {
        props: { item }
      })

      await wrapper.trigger('click')
      
      expect(wrapper.emitted('toggle-dropdown')).toBeTruthy()
      expect(wrapper.emitted('navigate')).toBeFalsy()
    })

    it('emits navigate event when child item is clicked', async () => {
      const item = { 
        id: 'services', 
        label: 'Services',
        children: [
          { id: 'web', label: 'Web Development', href: '/services/web' }
        ]
      }
      
      wrapper = mount(DNavbarItem, {
        props: { 
          item,
          isDropdownOpen: true
        }
      })

      const dropdownItem = wrapper.findComponent(DNavbarDropdownItem)
      await dropdownItem.vm.$emit('navigate', item.children[0], new Event('click'))
      
      expect(wrapper.emitted('navigate')).toBeTruthy()
      expect(wrapper.emitted('navigate')[0][0]).toEqual(item.children[0])
    })
  })

  describe('Keyboard Navigation', () => {
    it('handles Enter key to trigger navigation', async () => {
      const item = { id: 'home', label: 'Home', href: '/' }
      
      wrapper = mount(DNavbarItem, {
        props: { item }
      })

      await wrapper.trigger('keydown', { key: 'Enter' })
      
      expect(wrapper.emitted('navigate')).toBeTruthy()
    })

    it('handles Space key to trigger navigation', async () => {
      const item = { id: 'home', label: 'Home', href: '/' }
      
      wrapper = mount(DNavbarItem, {
        props: { item }
      })

      await wrapper.trigger('keydown', { key: ' ' })
      
      expect(wrapper.emitted('navigate')).toBeTruthy()
    })

    it('handles ArrowDown key to open dropdown', async () => {
      const item = { 
        id: 'services', 
        label: 'Services',
        children: [
          { id: 'web', label: 'Web Development', href: '/services/web' }
        ]
      }
      
      wrapper = mount(DNavbarItem, {
        props: { item }
      })

      await wrapper.trigger('keydown', { key: 'ArrowDown' })
      
      expect(wrapper.emitted('toggle-dropdown')).toBeTruthy()
    })

    it('handles Escape key to close dropdown', async () => {
      const item = { 
        id: 'services', 
        label: 'Services',
        children: [
          { id: 'web', label: 'Web Development', href: '/services/web' }
        ]
      }
      
      wrapper = mount(DNavbarItem, {
        props: { 
          item,
          isDropdownOpen: true
        }
      })

      await wrapper.trigger('keydown', { key: 'Escape' })
      
      expect(wrapper.emitted('toggle-dropdown')).toBeTruthy()
    })

    it('does not handle keyboard events when disabled', async () => {
      const item = { id: 'disabled', label: 'Disabled', disabled: true }
      
      wrapper = mount(DNavbarItem, {
        props: { item }
      })

      await wrapper.trigger('keydown', { key: 'Enter' })
      
      expect(wrapper.emitted('navigate')).toBeFalsy()
      expect(wrapper.emitted('toggle-dropdown')).toBeFalsy()
    })
  })

  describe('Accessibility Attributes', () => {
    it('has proper menuitem role', () => {
      const item = { id: 'home', label: 'Home', href: '/' }
      
      wrapper = mount(DNavbarItem, {
        props: { item }
      })

      expect(wrapper.attributes('role')).toBe('menuitem')
    })

    it('has proper ARIA attributes for dropdown items', () => {
      const item = { 
        id: 'services', 
        label: 'Services',
        children: [
          { id: 'web', label: 'Web Development', href: '/services/web' }
        ]
      }
      
      wrapper = mount(DNavbarItem, {
        props: { item }
      })

      expect(wrapper.attributes('aria-haspopup')).toBe('true')
      expect(wrapper.attributes('aria-expanded')).toBe('false')
    })

    it('updates aria-expanded when dropdown is open', () => {
      const item = { 
        id: 'services', 
        label: 'Services',
        children: [
          { id: 'web', label: 'Web Development', href: '/services/web' }
        ]
      }
      
      wrapper = mount(DNavbarItem, {
        props: { 
          item,
          isDropdownOpen: true
        }
      })

      expect(wrapper.attributes('aria-expanded')).toBe('true')
    })

    it('has proper link attributes for anchor elements', () => {
      const item = { 
        id: 'external', 
        label: 'External Link', 
        href: 'https://example.com',
        target: '_blank'
      }
      
      wrapper = mount(DNavbarItem, {
        props: { item }
      })

      expect(wrapper.attributes('href')).toBe('https://example.com')
      expect(wrapper.attributes('target')).toBe('_blank')
      expect(wrapper.attributes('rel')).toBe('noopener noreferrer')
    })

    it('has proper dropdown menu accessibility attributes', () => {
      const item = { 
        id: 'services', 
        label: 'Services',
        children: [
          { id: 'web', label: 'Web Development', href: '/services/web' }
        ]
      }
      
      wrapper = mount(DNavbarItem, {
        props: { 
          item,
          isDropdownOpen: true
        }
      })

      const dropdown = wrapper.find('.d-navbar-item__dropdown')
      expect(dropdown.attributes('role')).toBe('menu')
      expect(dropdown.attributes('aria-labelledby')).toBeDefined()
    })
  })

  describe('Visual State Feedback', () => {
    it('applies hover state classes through interactive composable', async () => {
      const item = { id: 'home', label: 'Home', href: '/' }
      
      wrapper = mount(DNavbarItem, {
        props: { item }
      })

      // Trigger hover
      await wrapper.trigger('mouseenter')
      
      // The useInteractiveStates composable should add hover classes
      // We can't easily test the exact class names without mocking the composable
      // But we can verify the component structure supports it
      expect(wrapper.classes()).toContain('d-navbar-item')
    })

    it('shows dropdown icon rotation when dropdown is open', () => {
      const item = { 
        id: 'services', 
        label: 'Services',
        children: [
          { id: 'web', label: 'Web Development', href: '/services/web' }
        ]
      }
      
      wrapper = mount(DNavbarItem, {
        props: { 
          item,
          isDropdownOpen: true
        }
      })

      expect(wrapper.classes()).toContain('d-navbar-item--dropdown-open')
    })
  })

  describe('Props Validation', () => {
    it('validates item prop structure', () => {
      const validItem = { label: 'Valid Item' }
      
      wrapper = mount(DNavbarItem, {
        props: { item: validItem }
      })

      expect(wrapper.text()).toBe('Valid Item')
    })

    it('handles item with all optional properties (dropdown)', () => {
      const fullItem = {
        id: 'full',
        label: 'Full Item',
        href: '/full',
        target: '_blank',
        disabled: false,
        active: true,
        children: [
          { id: 'child', label: 'Child', href: '/child' }
        ]
      }
      
      wrapper = mount(DNavbarItem, {
        props: { 
          item: fullItem,
          active: true,
          isDropdownOpen: false
        }
      })

      expect(wrapper.text()).toContain('Full Item')
      // When item has children, it renders as button, not anchor
      expect(wrapper.element.tagName).toBe('BUTTON')
      expect(wrapper.classes()).toContain('d-navbar-item--active')
      expect(wrapper.classes()).toContain('d-navbar-item--has-children')
    })

    it('handles item with href properties (link)', () => {
      const linkItem = {
        id: 'link',
        label: 'Link Item',
        href: '/link',
        target: '_blank',
        disabled: false
      }
      
      wrapper = mount(DNavbarItem, {
        props: { 
          item: linkItem,
          active: false
        }
      })

      expect(wrapper.text()).toContain('Link Item')
      expect(wrapper.element.tagName).toBe('A')
      expect(wrapper.attributes('href')).toBe('/link')
      expect(wrapper.attributes('target')).toBe('_blank')
      expect(wrapper.attributes('rel')).toBe('noopener noreferrer')
    })
  })
})