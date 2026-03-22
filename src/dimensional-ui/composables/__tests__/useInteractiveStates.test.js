import { describe, it, expect } from 'vitest'

describe('useInteractiveStates', () => {
  it('should be importable', async () => {
    const { useInteractiveStates } = await import('../useInteractiveStates.js')
    expect(useInteractiveStates).toBeDefined()
    expect(typeof useInteractiveStates).toBe('function')
  })

  it('should provide basic functionality', async () => {
    const { useInteractiveStates } = await import('../useInteractiveStates.js')
    
    // Test with minimal options to avoid DOM dependencies
    const interactiveStates = useInteractiveStates({ 
      trackFocus: false,
      trackHover: false,
      trackActive: false 
    })

    // Test API structure
    expect(interactiveStates.isHovered).toBeDefined()
    expect(interactiveStates.isPressed).toBeDefined()
    expect(interactiveStates.isFocused).toBeDefined()
    expect(interactiveStates.isActive).toBeDefined()
    expect(interactiveStates.setActive).toBeDefined()
    expect(interactiveStates.resetStates).toBeDefined()

    // Test manual active state control (doesn't require DOM)
    interactiveStates.setActive(true)
    expect(interactiveStates.isActive.value).toBe(true)
    
    interactiveStates.setActive(false)
    expect(interactiveStates.isActive.value).toBe(false)
  })
})