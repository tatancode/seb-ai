import { describe, it, expect, vi, beforeEach, beforeAll, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DNavbar from '../DNavbar.vue'
import DNavbarItem from '../DNavbarItem.vue'

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

// Set up CSS custom properties for theme tokens
beforeAll(() => {
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
      --d-border-width-thin: 1px;
      --d-z-dropdown: 1000;
    }
  `
  document.head.appendChild(style)
})

describe('DNavbar', () => {
  let wrapper
  let mockItems

  beforeEach(() => {
    // Reset any previous wrapper
    if (wrapper) {
      wrapper.unmount()
    }

    // Mock navigation items for testing
    mockItems = [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'about', label: 'About', href: '/about' },
      { 
        id: 'services', 
        label: 'Services', 
        children: [
          { id: 'web', label: 'Web Development', href: '/services/web' },
          { id: 'mobile', label: 'Mobile Apps', href: '/services/mobile' }
        ]
      },
      { id: 'contact', label: 'Contact', href: '/contact', disabled: true }
    ]
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Component Rendering', () => {
    it('renders correctly with default props', () => {
      wrapper = mount(DNavbar, {
        props: { items: mockItems }
      })

      expect(wrapper.find('nav').exists()).toBe(true)
      expect(wrapper.classes()).toContain('d-navbar')
      expect(wrapper.find('.d-navbar__items').exists()).toBe(true)
    })

    it('renders without items', () => {
      wrapper = mount(DNavbar, {
        props: { items: [] }
      })

      expect(wrapper.find('nav').exists()).toBe(true)
      expect(wrapper.find('.d-navbar__items').exists()).toBe(true)
      expect(wrapper.findAllComponents(DNavbarItem)).toHaveLength(0)
    })

    it('renders with logo prop', () => {
      wrapper = mount(DNavbar, {
        props: { 
          items: mockItems,
          logo: '/dimensional-ui-logo.png',
          logoAlt: 'Company Logo'
        }
      })

      expect(wrapper.find('.d-navbar__logo').exists()).toBe(true)
      expect(wrapper.find('.d-navbar__logo-image').exists()).toBe(true)
      expect(wrapper.find('.d-navbar__logo-image').attributes('src')).toBe('/dimensional-ui-logo.png')
      expect(wrapper.find('.d-navbar__logo-image').attributes('alt')).toBe('Company Logo')
    })

    it('renders with logo slot', () => {
      wrapper = mount(DNavbar, {
        props: { items: mockItems },
        slots: {
          logo: '<div class="custom-logo">Custom Logo</div>'
        }
      })

      expect(wrapper.find('.d-navbar__logo').exists()).toBe(true)
      expect(wrapper.find('.custom-logo').exists()).toBe(true)
      expect(wrapper.text()).toContain('Custom Logo')
    })

    it('renders with actions slot', () => {
      wrapper = mount(DNavbar, {
        props: { items: mockItems },
        slots: {
          actions: '<button class="login-btn">Login</button>'
        }
      })

      expect(wrapper.find('.d-navbar__actions').exists()).toBe(true)
      expect(wrapper.find('.login-btn').exists()).toBe(true)
    })
  })

  describe('Navigation Item Rendering and State Management', () => {
    it('renders all navigation items', () => {
      wrapper = mount(DNavbar, {
        props: { items: mockItems }
      })

      const navbarItems = wrapper.findAllComponents(DNavbarItem)
      expect(navbarItems).toHaveLength(4)
      
      // Check that each item receives correct props
      expect(navbarItems[0].props('item')).toEqual(mockItems[0])
      expect(navbarItems[1].props('item')).toEqual(mockItems[1])
      expect(navbarItems[2].props('item')).toEqual(mockItems[2])
      expect(navbarItems[3].props('item')).toEqual(mockItems[3])
    })

    it('manages active state based on currentPath prop', () => {
      wrapper = mount(DNavbar, {
        props: { 
          items: mockItems,
          currentPath: '/about'
        }
      })

      const navbarItems = wrapper.findAllComponents(DNavbarItem)
      
      // Home should not be active
      expect(navbarItems[0].props('active')).toBe(false)
      
      // About should be active (exact match)
      expect(navbarItems[1].props('active')).toBe(true)
      
      // Services should not be active
      expect(navbarItems[2].props('active')).toBe(false)
      
      // Contact should not be active
      expect(navbarItems[3].props('active')).toBe(false)
    })

    it('manages active state with path prefix matching', () => {
      wrapper = mount(DNavbar, {
        props: { 
          items: [
            { id: 'home', label: 'Home', href: '/' },
            { id: 'products', label: 'Products', href: '/products' },
            { id: 'about', label: 'About', href: '/about' }
          ],
          currentPath: '/products/category/electronics'
        }
      })

      const navbarItems = wrapper.findAllComponents(DNavbarItem)
      
      // Home should not be active (special case for '/')
      expect(navbarItems[0].props('active')).toBe(false)
      
      // Products should be active (path starts with /products)
      expect(navbarItems[1].props('active')).toBe(true)
      
      // About should not be active
      expect(navbarItems[2].props('active')).toBe(false)
    })

    it('manages active state from item.active property', () => {
      const itemsWithActive = [
        { id: 'home', label: 'Home', href: '/', active: true },
        { id: 'about', label: 'About', href: '/about', active: false }
      ]

      wrapper = mount(DNavbar, {
        props: { items: itemsWithActive }
      })

      const navbarItems = wrapper.findAllComponents(DNavbarItem)
      
      expect(navbarItems[0].props('active')).toBe(true)
      expect(navbarItems[1].props('active')).toBe(false)
    })

    it('manages dropdown state correctly', async () => {
      wrapper = mount(DNavbar, {
        props: { items: mockItems }
      })

      const servicesItem = wrapper.findAllComponents(DNavbarItem)[2]
      
      // Initially no dropdown should be open
      expect(servicesItem.props('isDropdownOpen')).toBe(false)
      
      // Emit toggle-dropdown event
      await servicesItem.vm.$emit('toggle-dropdown', 'services')
      
      // Check that dropdown state is updated
      expect(servicesItem.props('isDropdownOpen')).toBe(true)
      
      // Toggle again to close
      await servicesItem.vm.$emit('toggle-dropdown', 'services')
      expect(servicesItem.props('isDropdownOpen')).toBe(false)
    })

    it('closes dropdown when different dropdown is opened', async () => {
      const itemsWithMultipleDropdowns = [
        { 
          id: 'services', 
          label: 'Services', 
          children: [
            { id: 'web', label: 'Web Development', href: '/services/web' }
          ]
        },
        { 
          id: 'products', 
          label: 'Products', 
          children: [
            { id: 'software', label: 'Software', href: '/products/software' }
          ]
        }
      ]

      wrapper = mount(DNavbar, {
        props: { items: itemsWithMultipleDropdowns }
      })

      const servicesItem = wrapper.findAllComponents(DNavbarItem)[0]
      const productsItem = wrapper.findAllComponents(DNavbarItem)[1]
      
      // Open services dropdown
      await servicesItem.vm.$emit('toggle-dropdown', 'services')
      expect(servicesItem.props('isDropdownOpen')).toBe(true)
      expect(productsItem.props('isDropdownOpen')).toBe(false)
      
      // Open products dropdown
      await productsItem.vm.$emit('toggle-dropdown', 'products')
      expect(servicesItem.props('isDropdownOpen')).toBe(false)
      expect(productsItem.props('isDropdownOpen')).toBe(true)
    })
  })

  describe('Event Handling', () => {
    it('emits navigate event when item is clicked', async () => {
      wrapper = mount(DNavbar, {
        props: { items: mockItems }
      })

      const homeItem = wrapper.findAllComponents(DNavbarItem)[0]
      const mockEvent = new Event('click')
      
      await homeItem.vm.$emit('navigate', mockItems[0], mockEvent)
      
      expect(wrapper.emitted('navigate')).toBeTruthy()
      expect(wrapper.emitted('navigate')[0][0]).toEqual({
        item: mockItems[0],
        event: mockEvent
      })
    })

    it('emits dropdown-toggle event when dropdown is toggled', async () => {
      wrapper = mount(DNavbar, {
        props: { items: mockItems }
      })

      const servicesItem = wrapper.findAllComponents(DNavbarItem)[2]
      
      await servicesItem.vm.$emit('toggle-dropdown', 'services')
      
      expect(wrapper.emitted('dropdown-toggle')).toBeTruthy()
      expect(wrapper.emitted('dropdown-toggle')[0][0]).toEqual({
        itemId: 'services',
        isOpen: true
      })
    })

    it('closes dropdown when navigation occurs', async () => {
      wrapper = mount(DNavbar, {
        props: { items: mockItems }
      })

      const servicesItem = wrapper.findAllComponents(DNavbarItem)[2]
      
      // Open dropdown first
      await servicesItem.vm.$emit('toggle-dropdown', 'services')
      expect(servicesItem.props('isDropdownOpen')).toBe(true)
      
      // Navigate to another item
      const homeItem = wrapper.findAllComponents(DNavbarItem)[0]
      await homeItem.vm.$emit('navigate', mockItems[0], new Event('click'))
      
      // Dropdown should be closed
      expect(servicesItem.props('isDropdownOpen')).toBe(false)
    })
  })

  describe('Accessibility Navigation and ARIA Attributes', () => {
    it('has proper navigation role and ARIA label', () => {
      wrapper = mount(DNavbar, {
        props: { 
          items: mockItems,
          ariaLabel: 'Main navigation'
        }
      })

      const nav = wrapper.find('nav')
      expect(nav.attributes('role')).toBe('navigation')
      expect(nav.attributes('aria-label')).toBe('Main navigation')
    })

    it('uses default ARIA label when not provided', () => {
      wrapper = mount(DNavbar, {
        props: { items: mockItems }
      })

      const nav = wrapper.find('nav')
      expect(nav.attributes('aria-label')).toBe('Main navigation')
    })

    it('has proper menubar structure', () => {
      wrapper = mount(DNavbar, {
        props: { items: mockItems }
      })

      const menubar = wrapper.find('.d-navbar__items')
      expect(menubar.attributes('role')).toBe('menubar')
      expect(menubar.element.tagName).toBe('UL')
    })

    it('has proper list item structure', () => {
      wrapper = mount(DNavbar, {
        props: { items: mockItems }
      })

      const listItems = wrapper.findAll('.d-navbar__item')
      expect(listItems).toHaveLength(4)
      
      listItems.forEach(item => {
        expect(item.element.tagName).toBe('LI')
        expect(item.attributes('role')).toBe('none')
      })
    })

    it('passes accessibility props to navbar items', () => {
      wrapper = mount(DNavbar, {
        props: { items: mockItems }
      })

      const navbarItems = wrapper.findAllComponents(DNavbarItem)
      
      // Each DNavbarItem should receive the item prop with proper structure
      navbarItems.forEach((navbarItem, index) => {
        expect(navbarItem.props('item')).toEqual(mockItems[index])
      })
    })

    it('handles keyboard navigation - Escape key closes dropdowns', async () => {
      wrapper = mount(DNavbar, {
        props: { items: mockItems }
      })

      const servicesItem = wrapper.findAllComponents(DNavbarItem)[2]
      
      // Open dropdown
      await servicesItem.vm.$emit('toggle-dropdown', 'services')
      await wrapper.vm.$nextTick()
      expect(servicesItem.props('isDropdownOpen')).toBe(true)
      
      // Simulate Escape key press on document (as the component listens to document)
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(escapeEvent)
      
      // Wait for component to process the event
      await wrapper.vm.$nextTick()
      
      // Dropdown should be closed
      expect(servicesItem.props('isDropdownOpen')).toBe(false)
    })

    it('handles click outside to close dropdowns', async () => {
      // Mount component and attach to document
      const div = document.createElement('div')
      document.body.appendChild(div)
      
      wrapper = mount(DNavbar, {
        props: { items: mockItems },
        attachTo: div
      })

      const servicesItem = wrapper.findAllComponents(DNavbarItem)[2]
      
      // Open dropdown
      await servicesItem.vm.$emit('toggle-dropdown', 'services')
      expect(servicesItem.props('isDropdownOpen')).toBe(true)
      
      // Simulate click outside
      const outsideElement = document.createElement('div')
      document.body.appendChild(outsideElement)
      
      const clickEvent = new Event('click', { bubbles: true })
      Object.defineProperty(clickEvent, 'target', {
        value: outsideElement,
        enumerable: true
      })
      
      document.dispatchEvent(clickEvent)
      
      // Wait for next tick
      await wrapper.vm.$nextTick()
      
      // Dropdown should be closed
      expect(servicesItem.props('isDropdownOpen')).toBe(false)
      
      // Cleanup
      document.body.removeChild(outsideElement)
      document.body.removeChild(div)
    })
  })

  describe('Responsive and Styling Props', () => {
    it('applies sticky class when sticky prop is true', () => {
      wrapper = mount(DNavbar, {
        props: { 
          items: mockItems,
          sticky: true
        }
      })

      expect(wrapper.classes()).toContain('d-navbar--sticky')
    })

    it('applies responsive class when responsive prop is true', () => {
      wrapper = mount(DNavbar, {
        props: { 
          items: mockItems,
          responsive: true
        }
      })

      expect(wrapper.classes()).toContain('d-navbar--responsive')
    })

    it('applies responsive class by default', () => {
      wrapper = mount(DNavbar, {
        props: { items: mockItems }
      })

      expect(wrapper.classes()).toContain('d-navbar--responsive')
    })

    it('does not apply responsive class when responsive is false', () => {
      wrapper = mount(DNavbar, {
        props: { 
          items: mockItems,
          responsive: false
        }
      })

      expect(wrapper.classes()).not.toContain('d-navbar--responsive')
    })
  })

  describe('Props Validation', () => {
    it('validates items prop structure', () => {
      // Valid items should work
      const validItems = [
        { label: 'Home', href: '/' },
        { label: 'About' }
      ]

      wrapper = mount(DNavbar, {
        props: { items: validItems }
      })

      expect(wrapper.findAllComponents(DNavbarItem)).toHaveLength(2)
    })

    it('handles items without href', () => {
      const itemsWithoutHref = [
        { id: 'button', label: 'Button Item' }
      ]

      wrapper = mount(DNavbar, {
        props: { items: itemsWithoutHref }
      })

      const navbarItems = wrapper.findAllComponents(DNavbarItem)
      expect(navbarItems).toHaveLength(1)
      expect(navbarItems[0].props('item')).toEqual(itemsWithoutHref[0])
    })

    it('handles items with children (dropdowns)', () => {
      const itemsWithChildren = [
        { 
          id: 'parent',
          label: 'Parent', 
          children: [
            { id: 'child1', label: 'Child 1', href: '/child1' },
            { id: 'child2', label: 'Child 2', href: '/child2' }
          ]
        }
      ]

      wrapper = mount(DNavbar, {
        props: { items: itemsWithChildren }
      })

      const navbarItems = wrapper.findAllComponents(DNavbarItem)
      expect(navbarItems).toHaveLength(1)
      expect(navbarItems[0].props('item')).toEqual(itemsWithChildren[0])
    })
  })

  describe('Component Integration', () => {
    it('integrates properly with DNavbarItem components', () => {
      wrapper = mount(DNavbar, {
        props: { items: mockItems }
      })

      const navbarItems = wrapper.findAllComponents(DNavbarItem)
      
      // Check that all DNavbarItem components are properly rendered
      expect(navbarItems).toHaveLength(4)
      
      // Check that each component receives correct props
      navbarItems.forEach((item, index) => {
        expect(item.props('item')).toEqual(mockItems[index])
        expect(item.props('active')).toBeDefined()
        expect(item.props('isDropdownOpen')).toBeDefined()
      })
    })

    it('handles complex navigation structure', () => {
      const complexItems = [
        { 
          id: 'main',
          label: 'Main',
          href: '/main',
          children: [
            { 
              id: 'sub1',
              label: 'Sub 1',
              href: '/main/sub1'
            },
            { 
              id: 'sub2',
              label: 'Sub 2',
              href: '/main/sub2',
              disabled: true
            }
          ]
        },
        { 
          id: 'simple',
          label: 'Simple',
          href: '/simple'
        }
      ]

      wrapper = mount(DNavbar, {
        props: { 
          items: complexItems,
          currentPath: '/main/sub1'
        }
      })

      const navbarItems = wrapper.findAllComponents(DNavbarItem)
      expect(navbarItems).toHaveLength(2)
      
      // Main item should be active due to path matching
      expect(navbarItems[0].props('active')).toBe(true)
      expect(navbarItems[1].props('active')).toBe(false)
    })
  })
})